import { getTechPopularity } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { type TechPopularity } from "@/lib/types";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  let technologies: TechPopularity[];
  let error: string | null = null;

  try {
    technologies = await getTechPopularity();
  } catch (err) {
    error = "Unable to load technologies. Please check your database connection.";
    console.error("[ExplorePage] Failed to fetch technologies:", err);
    technologies = [];
  }

  return (
    <main>
      <div className="container">
        <div className={styles.page}>
          <header className={styles.header}>
            <h1 className={styles.title}>Explore Technologies</h1>
            <p className={styles.description}>
              Discover technologies ranked by the number of connected roles. See
              which tools and platforms are most valuable across different career
              paths.
            </p>
          </header>

          {error && <ErrorBanner message={error} />}

          {!error && technologies.length > 0 && (
            <section>
              <SectionHeader
                title={`${technologies.length} Technologies`}
                description="Ranked by number of connected roles"
              />
              <div className={styles.techGrid}>
                {technologies.map((tech) => (
                  <div key={tech.slug} className={styles.techCard}>
                    <div className={styles.techHeader}>
                      <div className={styles.techInfo}>
                        <h3 className={styles.techName}>{tech.technology}</h3>
                        <Badge variant="tech" size="sm">
                          {tech.slug.split("-")[0]}
                        </Badge>
                      </div>
                      <div className={styles.techCount}>
                        <span className={styles.countValue}>{tech.roleCount}</span>
                        <span className={styles.countLabel}>
                          {tech.roleCount === 1 ? "role" : "roles"}
                        </span>
                      </div>
                    </div>

                    {tech.roles.length > 0 && (
                      <div className={styles.techRoles}>
                        <span className={styles.rolesLabel}>Used in:</span>
                        <div className={styles.rolesList}>
                          {tech.roles.slice(0, 3).map((role: string, idx: number) => (
                            <span key={idx} className={styles.roleName}>
                              {role}
                            </span>
                          ))}
                          {tech.roles.length > 3 && (
                            <span className={styles.rolesMore}>
                              +{tech.roles.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {!error && technologies.length === 0 && (
            <EmptyState
              title="No technologies found"
              description="Technologies will appear here as they're added to the database"
            />
          )}
        </div>
      </div>
    </main>
  );
}
