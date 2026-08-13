import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkillDetail } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import styles from "./page.module.css";

interface SkillPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { slug } = await params;

  let skill;
  let error: string | null = null;

  try {
    skill = await getSkillDetail(slug);
    if (!skill) {
      notFound();
    }
  } catch (err) {
    error = "Failed to load skill details. Please try again.";
    console.error(`[SkillPage] Error loading skill ${slug}:`, err);
    return (
      <main>
        <div className="container">
          <ErrorBanner message={error} />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className={styles.page}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Skills</Link>
            <span className={styles.separator}>/</span>
            <span>{skill.name}</span>
          </nav>

          <header className={styles.header}>
            <div className={styles.headerTop}>
              <div>
                <Badge variant="skill" size="sm">
                  {skill.category}
                </Badge>
                <h1 className={styles.title}>{skill.name}</h1>
              </div>
              <Badge variant="default">
                {skill.difficulty}
              </Badge>
            </div>
          </header>

          {skill.technologies.length > 0 && (
            <section className={styles.section}>
              <SectionHeader
                title="Technologies"
                description="Technologies that implement this skill"
              />
              <div className={styles.techList}>
                {skill.technologies.map((tech) => (
                  <div key={tech.id} className={styles.techCard}>
                    <div className={styles.techIcon}>{tech.icon}</div>
                    <div className={styles.techInfo}>
                      <h3 className={styles.techName}>{tech.name}</h3>
                      <Badge variant="tech" size="sm">
                        {tech.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skill.projects.length > 0 && (
            <section className={styles.section}>
              <SectionHeader
                title="Projects"
                description="Projects that demonstrate this skill"
              />
              <div className={styles.projectList}>
                {skill.projects.map((project) => (
                  <div key={project.id} className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                      <h3 className={styles.projectName}>{project.name}</h3>
                      <div className={styles.projectMeta}>
                        <Badge variant="project" size="sm">
                          {project.difficulty}
                        </Badge>
                        <span className={styles.projectHours}>
                          ~{project.estimatedHours}h
                        </span>
                      </div>
                    </div>
                    <p className={styles.projectDescription}>
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skill.resources.length > 0 && (
            <section className={styles.section}>
              <SectionHeader
                title="Learning Resources"
                description="Curated resources to learn this skill"
              />
              <div className={styles.resourceList}>
                {skill.resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.resourceCard}
                  >
                    <div className={styles.resourceHeader}>
                      <h3 className={styles.resourceName}>{resource.name}</h3>
                      <span className={styles.resourceExternal}>↗</span>
                    </div>
                    <div className={styles.resourceMeta}>
                      <Badge variant="resource" size="sm">
                        {resource.type}
                      </Badge>
                      <span className={styles.resourcePlatform}>
                        {resource.platform}
                      </span>
                      {resource.isFree && (
                        <Badge variant="default" size="sm">
                          Free
                        </Badge>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {skill.prerequisites.length > 0 && (
            <section className={styles.section}>
              <SectionHeader
                title="Skill Prerequisites"
                description="Learning path and advanced skills"
              />
              <div className={styles.prerequisitesList}>
                {skill.prerequisites.map((prereq, idx) => (
                  <div key={idx} className={styles.prerequisiteChain}>
                    {prereq.chain.map((skillName, i) => (
                      <div key={i} className={styles.prerequisiteItem}>
                        <span className={styles.prerequisiteName}>
                          {skillName}
                        </span>
                        {i < prereq.chain.length - 1 && (
                          <span className={styles.prerequisiteArrow}>→</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {skill.technologies.length === 0 &&
            skill.projects.length === 0 &&
            skill.resources.length === 0 && (
              <EmptyState
                title="No connected data"
                description="This skill doesn't have connected technologies, projects, or resources yet"
              />
            )}
        </div>
      </div>
    </main>
  );
}
