/**
 * Utility helpers for SkillGraph
 */

/**
 * Safely convert Neo4j Integer (or JS number/bigint) to a plain JS number.
 * Neo4j driver returns Integer objects for whole numbers which don't serialize to JSON.
 */
export function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);

  // Neo4j Integer object has .toNumber() method
  if (
    typeof value === "object" &&
    value !== null &&
    "toNumber" in value &&
    typeof (value as { toNumber: () => number }).toNumber === "function"
  ) {
    return (value as { toNumber: () => number }).toNumber();
  }

  // Fallback: try parsing
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Generate a URL-safe slug from a name.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Format salary as readable string.
 */
export function formatSalary(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
