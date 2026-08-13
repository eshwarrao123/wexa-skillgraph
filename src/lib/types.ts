/**
 * Domain types for SkillGraph — Career Intelligence Explorer
 *
 * These types represent the graph data model and query results.
 * Kept practical for UI consumption, not over-engineered.
 */

// ── Node Types ────────────────────────────────────────────────────────

export interface Role {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  averageSalary: number;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
}

export interface Resource {
  id: string;
  name: string;
  url: string;
  type: "course" | "documentation" | "tutorial" | "book" | "video";
  platform: string;
  isFree: boolean;
}

// ── Relationship Property Types ───────────────────────────────────────

export type SkillImportance = "core" | "preferred" | "bonus";
export type TechFrequency = "daily" | "weekly" | "occasional";

// ── Query Result Types ────────────────────────────────────────────────

/** Q1: Role card for landing page */
export interface RoleWithSkillCount extends Role {
  skillCount: number;
}

/** Q2: Role detail with connected skills and technologies */
export interface RoleDetail extends Role {
  skills: Array<{
    skill: Skill;
    importance: SkillImportance;
  }>;
  technologies: Array<{
    tech: Technology;
    frequency: TechFrequency;
  }>;
}

/** Q3: Multi-hop traversal result — Role → Skill → Technology → Project */
export interface SkillTechProject {
  skill: string;
  technology: string;
  projects: string[];
}

/** Q4: Shared skill between two roles */
export interface SharedSkill {
  sharedSkill: string;
  category: string;
}

/** Q5: Related role by skill overlap */
export interface RelatedRole {
  role: string;
  slug: string;
  sharedSkills: number;
  skills: string[];
}

/** Q6: Skill prerequisite chain */
export interface SkillChain {
  chain: string[];
}

/** Q7: Graph node/edge data for force-directed visualization */
export interface GraphNode {
  id: string;
  name: string;
  label: string; // Node label: Role, Skill, Technology, Project, Resource
  [key: string]: unknown;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string; // Relationship type
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/** Q8: Technology popularity across roles */
export interface TechPopularity {
  technology: string;
  slug: string;
  roleCount: number;
  roles: string[];
}

/** Skill detail page data */
export interface SkillDetail extends Skill {
  technologies: Technology[];
  projects: Project[];
  resources: Resource[];
  prerequisites: SkillChain[];
}
