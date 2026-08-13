import Link from "next/link";
import { formatSalary } from "@/lib/utils";
import { Badge } from "./ui/Badge";
import styles from "./RoleCard.module.css";

interface RoleCardProps {
  name: string;
  slug: string;
  category: string;
  description: string;
  skillCount: number;
  averageSalary?: number;
}

export function RoleCard({
  name,
  slug,
  category,
  description,
  skillCount,
  averageSalary,
}: RoleCardProps) {
  return (
    <Link href={`/roles/${slug}`} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.category}>{category}</div>
          <h3 className={styles.title}>{name}</h3>
        </div>
        <Badge variant="role" size="sm">
          {category.split(" ")[0]}
        </Badge>
      </div>

      <p className={styles.description}>{description}</p>

      <div className={styles.footer}>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>◈</span>
          <span className={styles.metaValue}>{skillCount}</span>
          <span>skills</span>
        </div>
        {averageSalary && averageSalary > 0 && (
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>$</span>
            <span className={styles.metaValue}>{formatSalary(averageSalary)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
