import { type RoleWithSkillCount } from "@/lib/types";
import { RoleCard } from "./RoleCard";
import { SkeletonCard } from "./ui/Skeleton";
import { EmptyState } from "./ui/EmptyState";
import styles from "./RoleGrid.module.css";

interface RoleGridProps {
  roles: RoleWithSkillCount[];
  loading?: boolean;
  emptyMessage?: string;
}

export function RoleGrid({ roles, loading, emptyMessage }: RoleGridProps) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <EmptyState
        title={emptyMessage || "No roles found"}
        description="Try adjusting your search or filters"
      />
    );
  }

  return (
    <div className={styles.grid}>
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          name={role.name}
          slug={role.slug}
          category={role.category}
          description={role.description}
          skillCount={role.skillCount}
          averageSalary={role.averageSalary}
        />
      ))}
    </div>
  );
}
