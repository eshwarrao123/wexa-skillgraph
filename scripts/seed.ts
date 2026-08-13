/**
 * Seed Script — Loads graph data into CognoDB
 *
 * Usage: npx tsx scripts/seed.ts
 *
 * Connects via environment variables, clears existing data, creates
 * constraints, loads all nodes and relationships.
 */

import neo4j from "neo4j-driver";
import * as data from "./seed-data";

// ── Environment ───────────────────────────────────────────────────────

const URI = process.env.COGNODB_URI;
const USER = process.env.COGNODB_USER;
const PASSWORD = process.env.COGNODB_PASSWORD;

if (!URI || !USER || !PASSWORD) {
  console.error("❌ Missing env vars. Set COGNODB_URI, COGNODB_USER, COGNODB_PASSWORD");
  console.error("   Copy .env.example to .env.local and fill in credentials.");
  process.exit(1);
}

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

async function run(cypher: string, params: Record<string, unknown> = {}) {
  const session = driver.session();
  try {
    return await session.run(cypher, params);
  } finally {
    await session.close();
  }
}

// ── Main ──────────────────────────────────────────────────────────────

async function seed() {
  console.log("🚀 SkillGraph Seed Script");
  console.log("========================\n");

  // 1. Verify connection
  console.log("📡 Connecting to CognoDB...");
  try {
    await run("RETURN 1 AS ok");
    console.log("✅ Connected successfully\n");
  } catch (err) {
    console.error("❌ Failed to connect:", (err as Error).message);
    process.exit(1);
  }

  // 2. Clear existing data
  console.log("🧹 Clearing existing data...");
  await run("MATCH (n) DETACH DELETE n");
  console.log("✅ Database cleared\n");

  // 3. Create constraints (use CREATE CONSTRAINT IF NOT EXISTS)
  console.log("📐 Creating constraints...");
  const constraints = [
    "CREATE CONSTRAINT role_slug IF NOT EXISTS FOR (r:Role) REQUIRE r.slug IS UNIQUE",
    "CREATE CONSTRAINT skill_slug IF NOT EXISTS FOR (s:Skill) REQUIRE s.slug IS UNIQUE",
    "CREATE CONSTRAINT tech_slug IF NOT EXISTS FOR (t:Technology) REQUIRE t.slug IS UNIQUE",
    "CREATE CONSTRAINT project_slug IF NOT EXISTS FOR (p:Project) REQUIRE p.slug IS UNIQUE",
    "CREATE CONSTRAINT resource_id IF NOT EXISTS FOR (r:Resource) REQUIRE r.id IS UNIQUE",
  ];
  for (const c of constraints) {
    try {
      await run(c);
    } catch (err) {
      // CognoDB may use different constraint syntax — try alternative
      console.warn(`⚠️  Constraint may not be supported: ${(err as Error).message.slice(0, 80)}`);
    }
  }
  console.log("✅ Constraints created\n");

  // 4. Create nodes
  console.log("📦 Creating nodes...");

  for (const r of data.roles) {
    await run(
      `CREATE (n:Role {id: $id, name: $name, slug: $slug, category: $category, description: $description, averageSalary: $averageSalary})`,
      r
    );
  }
  console.log(`   ✅ ${data.roles.length} Roles`);

  for (const s of data.skills) {
    await run(
      `CREATE (n:Skill {id: $id, name: $name, slug: $slug, category: $category, difficulty: $difficulty})`,
      s
    );
  }
  console.log(`   ✅ ${data.skills.length} Skills`);

  for (const t of data.technologies) {
    await run(
      `CREATE (n:Technology {id: $id, name: $name, slug: $slug, category: $category, icon: $icon})`,
      t
    );
  }
  console.log(`   ✅ ${data.technologies.length} Technologies`);

  for (const p of data.projects) {
    await run(
      `CREATE (n:Project {id: $id, name: $name, slug: $slug, description: $description, difficulty: $difficulty, estimatedHours: $estimatedHours})`,
      p
    );
  }
  console.log(`   ✅ ${data.projects.length} Projects`);

  for (const r of data.resources) {
    await run(
      `CREATE (n:Resource {id: $id, name: $name, url: $url, type: $type, platform: $platform, isFree: $isFree})`,
      r
    );
  }
  console.log(`   ✅ ${data.resources.length} Resources`);

  // 5. Create relationships
  console.log("\n🔗 Creating relationships...");

  for (const [roleId, skillId, props] of data.requiresSkill) {
    await run(
      `MATCH (r:Role {id: $roleId}), (s:Skill {id: $skillId})
       CREATE (r)-[:REQUIRES_SKILL {importance: $importance}]->(s)`,
      { roleId, skillId, importance: props.importance }
    );
  }
  console.log(`   ✅ ${data.requiresSkill.length} REQUIRES_SKILL`);

  for (const [roleId, techId, props] of data.usesTechnology) {
    await run(
      `MATCH (r:Role {id: $roleId}), (t:Technology {id: $techId})
       CREATE (r)-[:USES_TECHNOLOGY {frequency: $frequency}]->(t)`,
      { roleId, techId, frequency: props.frequency }
    );
  }
  console.log(`   ✅ ${data.usesTechnology.length} USES_TECHNOLOGY`);

  for (const [skillId, techId] of data.implementedWith) {
    await run(
      `MATCH (s:Skill {id: $skillId}), (t:Technology {id: $techId})
       CREATE (s)-[:IMPLEMENTED_WITH]->(t)`,
      { skillId, techId }
    );
  }
  console.log(`   ✅ ${data.implementedWith.length} IMPLEMENTED_WITH`);

  for (const [projId, skillId] of data.demonstrates) {
    await run(
      `MATCH (p:Project {id: $projId}), (s:Skill {id: $skillId})
       CREATE (p)-[:DEMONSTRATES]->(s)`,
      { projId, skillId }
    );
  }
  console.log(`   ✅ ${data.demonstrates.length} DEMONSTRATES`);

  for (const [projId, techId] of data.builtWith) {
    await run(
      `MATCH (p:Project {id: $projId}), (t:Technology {id: $techId})
       CREATE (p)-[:BUILT_WITH]->(t)`,
      { projId, techId }
    );
  }
  console.log(`   ✅ ${data.builtWith.length} BUILT_WITH`);

  for (const [resId, skillId] of data.teaches) {
    await run(
      `MATCH (r:Resource {id: $resId}), (s:Skill {id: $skillId})
       CREATE (r)-[:TEACHES]->(s)`,
      { resId, skillId }
    );
  }
  console.log(`   ✅ ${data.teaches.length} TEACHES`);

  for (const [r1Id, r2Id, props] of data.relatedTo) {
    await run(
      `MATCH (r1:Role {id: $r1Id}), (r2:Role {id: $r2Id})
       CREATE (r1)-[:RELATED_TO {similarity: $similarity}]->(r2)`,
      { r1Id, r2Id, similarity: props.similarity }
    );
  }
  console.log(`   ✅ ${data.relatedTo.length} RELATED_TO`);

  for (const [s1Id, s2Id] of data.prerequisiteOf) {
    await run(
      `MATCH (s1:Skill {id: $s1Id}), (s2:Skill {id: $s2Id})
       CREATE (s1)-[:PREREQUISITE_OF]->(s2)`,
      { s1Id, s2Id }
    );
  }
  console.log(`   ✅ ${data.prerequisiteOf.length} PREREQUISITE_OF`);

  // 6. Verify counts
  console.log("\n📊 Verification...");
  const nodeCount = await run("MATCH (n) RETURN count(n) AS c");
  const relCount = await run("MATCH ()-[r]->() RETURN count(r) AS c");
  const nodes = nodeCount.records[0].get("c").toNumber();
  const rels = relCount.records[0].get("c").toNumber();
  console.log(`   Nodes: ${nodes}`);
  console.log(`   Relationships: ${rels}`);

  const totalRels =
    data.requiresSkill.length + data.usesTechnology.length +
    data.implementedWith.length + data.demonstrates.length +
    data.builtWith.length + data.teaches.length +
    data.relatedTo.length + data.prerequisiteOf.length;

  const totalNodes =
    data.roles.length + data.skills.length +
    data.technologies.length + data.projects.length +
    data.resources.length;

  if (nodes === totalNodes && rels === totalRels) {
    console.log("\n✅ All counts match! Seed complete.");
  } else {
    console.warn(`\n⚠️  Expected ${totalNodes} nodes / ${totalRels} rels, got ${nodes} / ${rels}`);
  }

  await driver.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  driver.close();
  process.exit(1);
});
