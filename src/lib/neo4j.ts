/**
 * CognoDB / Neo4j Driver — Singleton Pattern
 *
 * Uses the official neo4j-driver over Bolt protocol.
 * Attaches driver to globalThis to survive Next.js HMR in development.
 * All database access MUST go through this module — never import neo4j-driver elsewhere.
 */

import neo4j, { Driver, Session, SessionMode } from "neo4j-driver";

// ── Environment validation ────────────────────────────────────────────
const COGNODB_URI = process.env.COGNODB_URI;
const COGNODB_USER = process.env.COGNODB_USER;
const COGNODB_PASSWORD = process.env.COGNODB_PASSWORD;

function validateEnv(): { uri: string; user: string; password: string } {
  const missing: string[] = [];
  if (!COGNODB_URI) missing.push("COGNODB_URI");
  if (!COGNODB_USER) missing.push("COGNODB_USER");
  if (!COGNODB_PASSWORD) missing.push("COGNODB_PASSWORD");

  if (missing.length > 0) {
    throw new Error(
      `[SkillGraph] Missing required environment variables: ${missing.join(", ")}. ` +
        `Copy .env.example to .env.local and fill in your CognoDB credentials.`
    );
  }

  return {
    uri: COGNODB_URI!,
    user: COGNODB_USER!,
    password: COGNODB_PASSWORD!,
  };
}

// ── Singleton driver ──────────────────────────────────────────────────
const globalForNeo4j = globalThis as unknown as { __neo4jDriver?: Driver };

function getDriver(): Driver {
  if (globalForNeo4j.__neo4jDriver) {
    return globalForNeo4j.__neo4jDriver;
  }

  const env = validateEnv();

  const driver = neo4j.driver(
    env.uri,
    neo4j.auth.basic(env.user, env.password),
    {
      maxConnectionPoolSize: 10,
      connectionAcquisitionTimeout: 10_000, // 10s
      connectionTimeout: 5_000, // 5s
      logging: {
        level: "warn",
        logger: (level, message) =>
          console.log(`[neo4j-${level}] ${message}`),
      },
    }
  );

  if (process.env.NODE_ENV !== "production") {
    globalForNeo4j.__neo4jDriver = driver;
  }

  return driver;
}

export const driver = getDriver();

// ── Session helpers ───────────────────────────────────────────────────

/**
 * Execute a read query with automatic session lifecycle management.
 * The session is always closed in the finally block.
 */
export async function executeRead<T>(
  work: (session: Session) => Promise<T>
): Promise<T> {
  const session = driver.session({ defaultAccessMode: neo4j.session.READ });
  try {
    return await work(session);
  } finally {
    await session.close();
  }
}

/**
 * Execute a write query with automatic session lifecycle management.
 * The session is always closed in the finally block.
 */
export async function executeWrite<T>(
  work: (session: Session) => Promise<T>
): Promise<T> {
  const session = driver.session({ defaultAccessMode: neo4j.session.WRITE });
  try {
    return await work(session);
  } finally {
    await session.close();
  }
}

// ── Health check ──────────────────────────────────────────────────────

export interface HealthCheckResult {
  status: "healthy" | "unhealthy";
  latencyMs: number;
  message: string;
  timestamp: string;
}

/**
 * Lightweight database connectivity check.
 * Returns structured result — never throws.
 */
export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();
  const start = performance.now();

  try {
    await executeRead(async (session) => {
      await session.run("RETURN 1 AS ok");
    });

    return {
      status: "healthy",
      latencyMs: Math.round(performance.now() - start),
      message: "CognoDB connection successful",
      timestamp,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    return {
      status: "unhealthy",
      latencyMs: Math.round(performance.now() - start),
      message: `CognoDB connection failed: ${message}`,
      timestamp,
    };
  }
}

/**
 * Gracefully close the driver. Call during application shutdown.
 */
export async function closeDriver(): Promise<void> {
  try {
    await driver.close();
    delete globalForNeo4j.__neo4jDriver;
  } catch {
    // Swallow close errors during shutdown
  }
}
