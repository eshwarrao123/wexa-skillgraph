import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoleDetail, getRelatedRoles } from "@/lib/queries";
import { formatSalary } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import styles from "./page.module.css";

interface RolePageProps {
  params: Promise<{ slug: string }>;
}

export default async function RolePage({ params }: RolePageProps) {
  const { slug } = await params;

  let role;
  let relatedRoles;
  let error: string | null = null;

  try {
    role = await getRoleDetail(slug);
    if (!role) {
      notFound();
    }
    relatedRoles = await getRelatedRoles(slug);
  } catch (err) {
    error = "Failed to load role details. Please try again.";
    console.error(`[RolePage] Error loading role ${slug}:`, err);
    return (
      <main>
        <div className="container">
          <ErrorBanner message={error} />
        </div>
      </main>
    );
  }

  const coreSkills = role.skills.filter((s) => s.importance === "core");
  const preferredSkills = role.skills.filter((s) => s.importance === "preferred");
  const bonusSkills = role.skills.filter((s) => s.importance === "bonus");

  return (
    <main>
      <div className="container">
        <div className={styles.page}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Roles</Link>
            <span className={styles.separator}>/</span>
            <span>{role.name}</span>
          </nav>

          <header className={styles.header}>
            <div className={styles.headerTop}>
              <div>
                <Badge variant="role" size="sm">
                  {role.category}
                </Badge>
                <h1 className={styles.title}>{role.name}</h1>
              </div>
            </div>
            <p className={styles.description}>{role.description}</p>

            <div className={styles.metadata}>
              {role.averageSalary && role.averageSalary > 0 && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Average Salary</span>
                  <span className={styles.metaValue}>
                    {formatSalary(role.averageSalary)}
                  </span>
                </div>
              )}
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Skills Required</span>
                <span className={styles.metaValue}>{role.skills.length}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Technologies</span>
                <span className={styles.metaValue}>{role.technologies.length}</span>
              </div>
            </div>
          </header>

          <section className={styles.section}>
            <SectionHeader
              title="Required Skills"
              description="Skills needed for this role, grouped by importance"
            />

            {coreSkills.length > 0 && (
              <div className={styles.skillGroup}>
                <h3 className={styles.skillGroupTitle}>Core Skills</h3>
                <p className={styles.skillGroupDescription}>
                  Essential skills required for this role
                </p>
                <div className={styles.skillList}>
                  {coreSkills.map(({ skill }) => (
                    <Link
                      key={skill.id}
                      href={`/skills/${skill.slug}`}
                      className={styles.skillBadge}
                    >
                      <Badge variant="skill">{skill.name}</Badge>
                      <span className={styles.skillDifficulty}>
                        {skill.difficulty}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {preferredSkills.length > 0 && (
              <div className={styles.skillGroup}>
                <h3 className={styles.skillGroupTitle}>Preferred Skills</h3>
                <p className={styles.skillGroupDescription}>
                  Valuable additional skills that strengthen your profile
                </p>
                <div className={styles.skillList}>
                  {preferredSkills.map(({ skill }) => (
                    <Link
                      key={skill.id}
                      href={`/skills/${skill.slug}`}
                      className={styles.skillBadge}
                    >
                      <Badge variant="skill">{skill.name}</Badge>
                      <span className={styles.skillDifficulty}>
                        {skill.difficulty}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {bonusSkills.length > 0 && (
              <div className={styles.skillGroup}>
                <h3 className={styles.skillGroupTitle}>Bonus Skills</h3>
                <p className={styles.skillGroupDescription}>
                  Nice-to-have skills that can differentiate you
                </p>
                <div className={styles.skillList}>
                  {bonusSkills.map(({ skill }) => (
                    <Link
                      key={skill.id}
                      href={`/skills/${skill.slug}`}
                      className={styles.skillBadge}
                    >
                      <Badge variant="skill">{skill.name}</Badge>
                      <span className={styles.skillDifficulty}>
                        {skill.difficulty}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {role.skills.length === 0 && (
              <EmptyState
                title="No skills defined"
                description="Skills will appear here as they're added to the database"
              />
            )}
          </section>

          {role.technologies.length > 0 && (
            <section className={styles.section}>
              <SectionHeader
                title="Technologies"
                description="Tools and technologies commonly used in this role"
              />
              <div className={styles.techList}>
                {role.technologies.map(({ tech, frequency }) => (
                  <div key={tech.id} className={styles.techItem}>
                    <div className={styles.techIcon}>{tech.icon}</div>
                    <div className={styles.techInfo}>
                      <span className={styles.techName}>{tech.name}</span>
                      <Badge variant="tech" size="sm">
                        {frequency}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {relatedRoles && relatedRoles.length > 0 && (
            <section className={styles.section}>
              <SectionHeader
                title="Related Roles"
                description="Similar roles that share skills with this position"
              />
              <div className={styles.relatedRoles}>
                {relatedRoles.map((related) => (
                  <div key={related.slug} className={styles.relatedCard}>
                    <div className={styles.relatedHeader}>
                      <Link
                        href={`/roles/${related.slug}`}
                        className={styles.relatedTitle}
                      >
                        {related.role}
                      </Link>
                      <span className={styles.relatedCount}>
                        {related.sharedSkills} shared skills
                      </span>
                    </div>
                    <div className={styles.relatedSkills}>
                      {related.skills.slice(0, 4).map((skill, idx) => (
                        <Badge key={idx} variant="skill" size="sm">
                          {skill}
                        </Badge>
                      ))}
                      {related.skills.length > 4 && (
                        <span className={styles.relatedMore}>
                          +{related.skills.length - 4} more
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/compare?role1=${slug}&role2=${related.slug}`}
                      className={styles.compareButton}
                    >
                      Compare roles →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.section}>
            <div className={styles.graphPlaceholder}>
              <div className={styles.placeholderIcon}>◈</div>
              <h3 className={styles.placeholderTitle}>Interactive Graph</h3>
              <p className={styles.placeholderDescription}>
                Explore this role's connected skills, technologies, and projects
                visually. Graph visualization coming in Phase 4.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
