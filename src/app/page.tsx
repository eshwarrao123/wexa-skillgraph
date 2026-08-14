import { getAllRoles } from "@/lib/queries";
import { RoleExplorer } from "@/components/RoleExplorer";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { type RoleWithSkillCount } from "@/lib/types";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let roles: RoleWithSkillCount[];
  let error: string | null = null;

  try {
    roles = await getAllRoles();
  } catch (err) {
    error = "Unable to load roles. Please check your database connection.";
    console.error("[HomePage] Failed to fetch roles:", err);
    roles = [];
  }

  return (
    <main>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Explore how skills connect to careers
          </h1>
          <p className={styles.heroDescription}>
            SkillGraph maps relationships between roles, skills, technologies and
            projects. Discover your path in tech.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          {error && <ErrorBanner message={error} />}
          <RoleExplorer roles={roles} />
        </div>
      </section>
    </main>
  );
}
