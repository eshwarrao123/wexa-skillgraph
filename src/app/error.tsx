"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Error Boundary]", error);
  }, [error]);

  return (
    <main className={styles.error}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.icon}>⚠</div>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.description}>
            An unexpected error occurred while loading this page. Please try again
            or return to the home page.
          </p>
          <div className={styles.actions}>
            <button onClick={reset} className={styles.retryButton}>
              Try Again
            </button>
            <Link href="/" className={styles.homeLink}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
