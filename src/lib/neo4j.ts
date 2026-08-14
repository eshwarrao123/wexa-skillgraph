/**
 * CognoDB / Neo4j Driver — Singleton Pattern
 *
 * Uses the official neo4j-driver over Bolt protocol.
 * Attaches driver to globalThis to survive Next.js HMR in development.
 * All database access MUST go through this module — never import neo4j-driver elsewhere.
 */

import neo4j, { Driver, Session } from "neo4j-driver";

// ── Environment validation ────────────────────────────────────────────

function validateEnv(): { uri: string; user: string; password: string } {
  const uri = process.env.COGNODB_URI;
  const user = process.env.COGNODB_USER;
  const password = process.env.COGNODB_PASSWORD;

  const missing: string[] = [];
  if (!uri) missing.push("COGNODB_URI");
  if (!user) missing.push("COGNODB_USER");
  if (!password) missing.push("COGNODB_PASSWORD");

  if (missing.length > 0) {
    throw new Error(
      `[SkillGraph] Missing required environment variables: ${missing.join(", ")}. ` +
        `Copy .env.example to .env.local and fill in your CognoDB credentials.`
    );
  }

  return { uri: uri!, user: user!, password: password! };
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
      connectionAcquisitionTimeout: 10_000,
      connectionTimeout: 5_000,
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

// ── Session helpers ───────────────────────────────────────────────────

export async function executeRead<T>(
  work: (session: Session) => Promise<T>
): Promise<T> {
  const d = getDriver();
  const session = d.session({ defaultAccessMode: neo4j.session.READ });
  try {
    return await work(session);
  } finally {
    await session.close();
  }
}

export async function executeWrite<T>(
  work: (session: Session) => Promise<T>
): Promise<T> {
  const d = getDriver();
  const session = d.session({ defaultAccessMode: neo4j.session.WRITE });
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

export async function closeDriver(): Promise<void> {
  try {
    if (globalForNeo4j.__neo4jDriver) {
      await globalForNeo4j.__neo4jDriver.close();
      delete globalForNeo4j.__neo4jDriver;
    }
  } catch {
    // Swallow close errors during shutdown
  }
}
