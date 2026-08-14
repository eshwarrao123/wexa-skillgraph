/**
 * Centralized Cypher Query Layer
 *
 * ALL application Cypher queries live in this file.
 * All user-controlled values use $parameter syntax — NEVER string concatenation.
 * Each query function handles its own session lifecycle via executeRead.
 */

import { executeRead } from "./neo4j";
import type {
  RoleWithSkillCount,
  RoleDetail,
  SkillTechProject,
  SharedSkill,
  RelatedRole,
  SkillChain,
  GraphData,
  GraphNode,
  GraphLink,
  TechPopularity,
  Skill,
  Technology,
  Project,
  Resource,
  SkillImportance,
  TechFrequency,
  SkillDetail,
} from "./types";
import { toNumber } from "./utils";

// ── Q1: All Roles (Landing Page) ──────────────────────────────────────

export async function getAllRoles(): Promise<RoleWithSkillCount[]> {
  return executeRead(async (session) => {
    const result = await session.run(`
      MATCH (r:Role)
      OPTIONAL MATCH (r)-[:REQUIRES_SKILL]->(s:Skill)
      RETURN r, count(s) AS skillCount
      ORDER BY r.name
    `);

    return result.records.map((record) => {
      const r = record.get("r").properties;
      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        category: r.category,
        description: r.description,
        averageSalary: toNumber(r.averageSalary),
        skillCount: toNumber(record.get("skillCount")),
      };
    });
  });
}

// ── Q2: Role Detail ───────────────────────────────────────────────────

export async function getRoleDetail(slug: string): Promise<RoleDetail | null> {
  return executeRead(async (session) => {
    const result = await session.run(
      `
      MATCH (r:Role {slug: $slug})
      OPTIONAL MATCH (r)-[rs:REQUIRES_SKILL]->(s:Skill)
      WITH r, collect(DISTINCT CASE WHEN s IS NOT NULL THEN {skill: s, importance: rs.importance} END) AS skills
      OPTIONAL MATCH (r)-[ut:USES_TECHNOLOGY]->(t:Technology)
      RETURN r, skills, collect(DISTINCT CASE WHEN t IS NOT NULL THEN {tech: t, frequency: ut.frequency} END) AS technologies
      `,
      { slug }
    );

    if (result.records.length === 0) return null;

    const record = result.records[0];
    const r = record.get("r").properties;
    const rawSkills = record.get("skills") as Array<{
      skill: { properties: Record<string, unknown> };
      importance: string;
    }>;
    const rawTechs = record.get("technologies") as Array<{
      tech: { properties: Record<string, unknown> };
      frequency: string;
    }>;

    // Defensively deduplicate skills and technologies in TypeScript
    const uniqueSkills = new Map();
    rawSkills
      .filter((item) => item && item.skill != null)
      .forEach((item) => {
        const id = item.skill.properties.id as string;
        if (!uniqueSkills.has(id)) {
          uniqueSkills.set(id, {
            skill: normalizeSkill(item.skill.properties),
            importance: item.importance as SkillImportance,
          });
        }
      });

    const uniqueTechs = new Map();
    rawTechs
      .filter((item) => item && item.tech != null)
      .forEach((item) => {
        const id = item.tech.properties.id as string;
        if (!uniqueTechs.has(id)) {
          uniqueTechs.set(id, {
            tech: normalizeTechnology(item.tech.properties),
            frequency: item.frequency as TechFrequency,
          });
        }
      });

    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      category: r.category,
      description: r.description,
      averageSalary: toNumber(r.averageSalary),
      skills: Array.from(uniqueSkills.values()),
      technologies: Array.from(uniqueTechs.values()),
    };
  });
}

// ── Q3: Multi-Hop Role → Skill → Technology → Project ─────────────────

export async function getSkillTechProjects(
  slug: string
): Promise<SkillTechProject[]> {
  return executeRead(async (session) => {
    const result = await session.run(
      `
      MATCH (r:Role {slug: $slug})-[:REQUIRES_SKILL]->(s:Skill)
        -[:IMPLEMENTED_WITH]->(t:Technology)<-[:BUILT_WITH]-(p:Project)
      RETURN s.name AS skill,
        t.name AS technology,
        collect(DISTINCT p.name) AS projects
      ORDER BY skill
      `,
      { slug }
    );

    return result.records.map((record) => ({
      skill: record.get("skill") as string,
      technology: record.get("technology") as string,
      projects: record.get("projects") as string[],
    }));
  });
}

// ── Q4: Shared Skills Between Two Roles ───────────────────────────────

export async function getSharedSkills(
  slug1: string,
  slug2: string
): Promise<SharedSkill[]> {
  return executeRead(async (session) => {
    const result = await session.run(
      `
      MATCH (r1:Role {slug: $slug1})-[:REQUIRES_SKILL]->(s:Skill)
        <-[:REQUIRES_SKILL]-(r2:Role {slug: $slug2})
      RETURN s.name AS sharedSkill,
        s.category AS category
      ORDER BY category, sharedSkill
      `,
      { slug1, slug2 }
    );

    return result.records.map((record) => ({
      sharedSkill: record.get("sharedSkill") as string,
      category: record.get("category") as string,
    }));
  });
}

// ── Q5: Related Roles by Skill Overlap ────────────────────────────────

export async function getRelatedRoles(slug: string): Promise<RelatedRole[]> {
  return executeRead(async (session) => {
    const result = await session.run(
      `
      MATCH (r:Role {slug: $slug})-[:REQUIRES_SKILL]->(s:Skill)
        <-[:REQUIRES_SKILL]-(related:Role)
      WHERE related <> r
      RETURN related.name AS role,
        related.slug AS slug,
        count(s) AS sharedSkills,
        collect(s.name) AS skills
      ORDER BY sharedSkills DESC
      LIMIT 5
      `,
      { slug }
    );

    return result.records.map((record) => ({
      role: record.get("role") as string,
      slug: record.get("slug") as string,
      sharedSkills: toNumber(record.get("sharedSkills")),
      skills: record.get("skills") as string[],
    }));
  });
}

// ── Q6: Variable-Depth Skill Prerequisites ────────────────────────────

export async function getSkillPrerequisites(
  slug: string
): Promise<SkillChain[]> {
  return executeRead(async (session) => {
    const result = await session.run(
      `
      MATCH path = (s:Skill {slug: $slug})-[:PREREQUISITE_OF*1..4]->(advanced:Skill)
      RETURN [n IN nodes(path) | n.name] AS chain
      ORDER BY length(path)
      `,
      { slug }
    );

    return result.records.map((record) => ({
      chain: record.get("chain") as string[],
    }));
  });
}

// ── Q7: Role Subgraph for Force Graph ─────────────────────────────────

export async function getRoleSubgraph(
  slug: string,
  limit: number = 80
): Promise<GraphData> {
  return executeRead(async (session) => {
    const result = await session.run(
      `
      MATCH (r:Role {slug: $slug})-[rel1]-(connected)
      OPTIONAL MATCH (connected)-[rel2]-(secondary)
      WHERE secondary <> r
      RETURN r, connected, secondary, rel1, rel2
      LIMIT $limit
      `,
      { slug, limit: neo4jInt(limit) }
    );

    const nodesMap = new Map<string, GraphNode>();
    const linksSet = new Set<string>();
    const links: GraphLink[] = [];

    for (const record of result.records) {
      // Process all node fields
      for (const key of ["r", "connected", "secondary"]) {
        const node = record.get(key);
        if (node && node.properties) {
          const id = node.properties.id || node.identity?.toString();
          if (id && !nodesMap.has(id)) {
            nodesMap.set(id, {
              id,
              name: node.properties.name || id,
              label: node.labels?.[0] || "Unknown",
              ...node.properties,
            });
          }
        }
      }

      // Process relationship fields
      for (const key of ["rel1", "rel2"]) {
        const rel = record.get(key);
        if (rel) {
          const sourceId =
            rel.start?.toString() || rel.startNodeElementId;
          const targetId =
            rel.end?.toString() || rel.endNodeElementId;
          const linkKey = `${sourceId}-${rel.type}-${targetId}`;

          if (!linksSet.has(linkKey)) {
            linksSet.add(linkKey);
            // Map Neo4j internal IDs to our node IDs
            const sourceNode = findNodeByInternalId(nodesMap, sourceId, result.records);
            const targetNode = findNodeByInternalId(nodesMap, targetId, result.records);
            if (sourceNode && targetNode) {
              links.push({
                source: sourceNode,
                target: targetNode,
                type: rel.type,
              });
            }
          }
        }
      }
    }

    return {
      nodes: Array.from(nodesMap.values()),
      links,
    };
  });
}

/** Helper to map Neo4j internal IDs to application node IDs */
function findNodeByInternalId(
  nodesMap: Map<string, GraphNode>,
  internalId: string,
  records: Array<{ get: (key: string) => unknown }>
): string | undefined {
  // Check all nodes in the map — for small graphs this is fine
  for (const record of records) {
    for (const key of ["r", "connected", "secondary"]) {
      const node = record.get(key) as { properties?: Record<string, unknown>; identity?: { toString(): string }; elementId?: string } | null;
      if (node && node.properties) {
        const nodeInternalId = node.identity?.toString() || node.elementId;
        if (nodeInternalId === internalId) {
          const appId = (node.properties.id as string) || nodeInternalId;
          if (nodesMap.has(appId)) return appId;
        }
      }
    }
  }
  return undefined;
}

// ── Q8: Technology Popularity ─────────────────────────────────────────

export async function getTechPopularity(): Promise<TechPopularity[]> {
  return executeRead(async (session) => {
    const result = await session.run(`
      MATCH (t:Technology)<-[:USES_TECHNOLOGY]-(r:Role)
      RETURN t.name AS technology,
        t.slug AS slug,
        count(r) AS roleCount,
        collect(r.name) AS roles
      ORDER BY roleCount DESC
    `);

    return result.records.map((record) => ({
      technology: record.get("technology") as string,
      slug: record.get("slug") as string,
      roleCount: toNumber(record.get("roleCount")),
      roles: record.get("roles") as string[],
    }));
  });
}

// ── Additional: Skill Detail ──────────────────────────────────────────

export async function getSkillDetail(slug: string): Promise<SkillDetail | null> {
  return executeRead(async (session) => {
    const result = await session.run(
      `
      MATCH (s:Skill {slug: $slug})
      OPTIONAL MATCH (s)-[:IMPLEMENTED_WITH]->(t:Technology)
      OPTIONAL MATCH (p:Project)-[:DEMONSTRATES]->(s)
      OPTIONAL MATCH (res:Resource)-[:TEACHES]->(s)
      RETURN s,
        collect(DISTINCT t) AS technologies,
        collect(DISTINCT p) AS projects,
        collect(DISTINCT res) AS resources
      `,
      { slug }
    );

    if (result.records.length === 0) return null;

    const record = result.records[0];
    const s = record.get("s").properties;

    // Get prerequisite chains separately
    const prereqResult = await session.run(
      `
      MATCH path = (s:Skill {slug: $slug})-[:PREREQUISITE_OF*1..4]->(advanced:Skill)
      RETURN [n IN nodes(path) | n.name] AS chain
      ORDER BY length(path)
      `,
      { slug }
    );

    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      category: s.category,
      difficulty: s.difficulty,
      technologies: (record.get("technologies") as Array<{ properties: Record<string, unknown> }>)
        .filter((n) => n != null)
        .map((n) => normalizeTechnology(n.properties)),
      projects: (record.get("projects") as Array<{ properties: Record<string, unknown> }>)
        .filter((n) => n != null)
        .map((n) => normalizeProject(n.properties)),
      resources: (record.get("resources") as Array<{ properties: Record<string, unknown> }>)
        .filter((n) => n != null)
        .map((n) => normalizeResource(n.properties)),
      prerequisites: prereqResult.records.map((r) => ({
        chain: r.get("chain") as string[],
      })),
    };
  });
}

// ── Normalization helpers ─────────────────────────────────────────────

function normalizeSkill(props: Record<string, unknown>): Skill {
  return {
    id: props.id as string,
    name: props.name as string,
    slug: props.slug as string,
    category: props.category as string,
    difficulty: props.difficulty as Skill["difficulty"],
  };
}

function normalizeTechnology(props: Record<string, unknown>): Technology {
  return {
    id: props.id as string,
    name: props.name as string,
    slug: props.slug as string,
    category: props.category as string,
    icon: props.icon as string,
  };
}

function normalizeProject(props: Record<string, unknown>): Project {
  return {
    id: props.id as string,
    name: props.name as string,
    slug: props.slug as string,
    description: props.description as string,
    difficulty: props.difficulty as Project["difficulty"],
    estimatedHours: toNumber(props.estimatedHours),
  };
}

function normalizeResource(props: Record<string, unknown>): Resource {
  return {
    id: props.id as string,
    name: props.name as string,
    url: props.url as string,
    type: props.type as Resource["type"],
    platform: props.platform as string,
    isFree: Boolean(props.isFree),
  };
}

/** Helper to create Neo4j integer for LIMIT params */
function neo4jInt(value: number) {
  // neo4j-driver returns Integer objects; pass plain number and let driver handle it
  return value;
}
