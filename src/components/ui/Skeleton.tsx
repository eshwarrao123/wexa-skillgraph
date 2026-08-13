import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({ width, height = "1rem", className = "" }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton height="1.5rem" width="70%" />
      <Skeleton height="1rem" width="40%" />
      <Skeleton height="4rem" width="100%" />
      <div className={styles.skeletonRow}>
        <Skeleton height="1.5rem" width="30%" />
        <Skeleton height="1.5rem" width="25%" />
      </div>
    </div>
  );
}
