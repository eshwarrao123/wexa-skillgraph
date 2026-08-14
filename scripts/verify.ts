import { loadEnvConfig } from "@next/env";
import type { getRoleSubgraph } from "../src/lib/queries";

loadEnvConfig(process.cwd());

function countGraphIntegrity(graph: Awaited<ReturnType<typeof getRoleSubgraph>>) {
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const uniqueLinks = new Set(
    graph.links.map((link) => `${link.source}:${link.type}:${link.target}`)
  );

  return {
    duplicateNodes: graph.nodes.length - nodeIds.size,
    duplicateLinks: graph.links.length - uniqueLinks.size,
    invalidLinks: graph.links.filter(
      (link) => !nodeIds.has(link.source) || !nodeIds.has(link.target)
    ).length,
  };
}

async function verify() {
  const { executeRead } = await import("../src/lib/neo4j");
  const {
    getAllRoles,
    getRoleDetail,
    getSkillTechProjects,
    getSharedSkills,
    getRelatedRoles,
    getSkillPrerequisites,
    getRoleSubgraph,
    getTechPopularity,
    getSkillDetail,
  } = await import("../src/lib/queries");

  const [roles, role, multiHop, sharedSkills, relatedRoles, chains, graph, technologies, skill] =
    await Promise.all([
      getAllRoles(),
      getRoleDetail("frontend-developer"),
      getSkillTechProjects("frontend-developer"),
      getSharedSkills("frontend-developer", "full-stack-developer"),
      getRelatedRoles("frontend-developer"),
      getSkillPrerequisites("css-and-styling"),
      getRoleSubgraph("frontend-developer", 80),
      getTechPopularity(),
      getSkillDetail("css-and-styling"),
    ]);

  const constraints = await executeRead(async (session) => {
    try {
      const result = await session.run("SHOW CONSTRAINTS");
      return result.records.length;
    } catch {
      return -1;
    }
  });

  console.log(
    JSON.stringify(
      {
        constraints,
        q1: { roles: roles.length, skillCounts: roles.map((item) => item.skillCount) },
        q2: {
          found: Boolean(role),
          skills: role?.skills.length ?? 0,
          technologies: role?.technologies.length ?? 0,
        },
        q3: { paths: multiHop.length, first: multiHop[0] ?? null },
        q4: { sharedSkills: sharedSkills.length, names: sharedSkills.map((item) => item.sharedSkill) },
        q5: { relatedRoles: relatedRoles.length, first: relatedRoles[0] ?? null },
        q6: { chains: chains.length, first: chains[0] ?? null },
        q7: {
          nodes: graph.nodes.length,
          links: graph.links.length,
          integrity: countGraphIntegrity(graph),
        },
        q8: { technologies: technologies.length, first: technologies[0] ?? null },
        skillDetail: {
          found: Boolean(skill),
          technologies: skill?.technologies.length ?? 0,
          projects: skill?.projects.length ?? 0,
          resources: skill?.resources.length ?? 0,
          prerequisites: skill?.prerequisites.length ?? 0,
        },
      },
      null,
      2
    )
  );
}

verify()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    import("../src/lib/neo4j").then((m) => m.closeDriver()).catch(console.error);
  });
