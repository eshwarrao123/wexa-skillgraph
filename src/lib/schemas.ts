/**
 * Zod validation schemas for external/query parameters.
 *
 * All user-controlled input is validated here before reaching the query layer.
 * Keeps validation logic separate from Cypher.
 */

import { z } from "zod";

// ── Slug validation ───────────────────────────────────────────────────
// Slugs must be lowercase alphanumeric with hyphens, 2-80 characters.
const slugPattern = /^[a-z0-9][a-z0-9-]{0,78}[a-z0-9]$/;

export const SlugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(80, "Slug must be at most 80 characters")
  .regex(slugPattern, "Slug must be lowercase alphanumeric with hyphens only")
  .transform((s) => s.toLowerCase());

// ── Route parameter schemas ───────────────────────────────────────────

/** /roles/[slug] or /skills/[slug] */
export const SingleSlugParams = z.object({
  slug: SlugSchema,
});

/** /compare?role1=X&role2=Y */
export const CompareParams = z.object({
  slug1: SlugSchema,
  slug2: SlugSchema,
});

/** Graph visualization query — optional depth limit */
export const GraphQueryParams = z.object({
  slug: SlugSchema,
  limit: z
    .coerce.number()
    .int()
    .min(10, "Limit must be at least 10")
    .max(150, "Limit must be at most 150")
    .default(80),
});

// ── Type exports ──────────────────────────────────────────────────────

export type SlugInput = z.infer<typeof SlugSchema>;
export type SingleSlugInput = z.infer<typeof SingleSlugParams>;
export type CompareInput = z.infer<typeof CompareParams>;
export type GraphQueryInput = z.infer<typeof GraphQueryParams>;
