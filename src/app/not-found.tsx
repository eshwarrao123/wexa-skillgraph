import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.icon}>404</div>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.description}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/" className={styles.homeLink}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
