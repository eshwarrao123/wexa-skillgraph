import Link from "next/link";
import styles from "../../not-found.module.css";

export default function SkillNotFound() {
  return (
    <main className={styles.notFound}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.icon}>◈</div>
          <h1 className={styles.title}>Skill Not Found</h1>
          <p className={styles.description}>
            The skill you&apos;re looking for doesn&apos;t exist in our database.
          </p>
          <Link href="/" className={styles.homeLink}>
            Browse All Roles
          </Link>
        </div>
      </div>
    </main>
  );
}
