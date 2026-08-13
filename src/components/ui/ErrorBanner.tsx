import styles from "./ErrorBanner.module.css";

interface ErrorBannerProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
}

export function ErrorBanner({
  title = "Something went wrong",
  message,
  action,
}: ErrorBannerProps) {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.icon}>⚠</div>
        <div className={styles.text}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
