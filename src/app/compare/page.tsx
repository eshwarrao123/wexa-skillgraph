"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { type RoleWithSkillCount, type SharedSkill } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./page.module.css";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const role1Slug = searchParams.get("role1");
  const role2Slug = searchParams.get("role2");

  const [roles, setRoles] = useState<RoleWithSkillCount[]>([]);
  const [role1, setRole1] = useState<string>(role1Slug || "");
  const [role2, setRole2] = useState<string>(role2Slug || "");
  const [comparison, setComparison] = useState<{
    role1Data?: RoleWithSkillCount;
    role2Data?: RoleWithSkillCount;
    sharedSkills: SharedSkill[];
    role1OnlySkills: string[];
    role2OnlySkills: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch(() => setError("Failed to load roles"));
  }, []);

  useEffect(() => {
    if (role1 && role2 && role1 !== role2) {
      setLoading(true);
      setError(null);
      fetch(`/api/compare?role1=${role1}&role2=${role2}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to compare roles");
          return res.json();
        })
        .then((data) => {
          setComparison(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [role1, role2]);

  const handleCompare = () => {
    if (role1 && role2 && role1 !== role2) {
      const url = new URL(window.location.href);
      url.searchParams.set("role1", role1);
      url.searchParams.set("role2", role2);
      window.history.pushState({}, "", url);
    }
  };

  return (
    <main>
      <div className="container">
        <div className={styles.page}>
          <header className={styles.header}>
            <h1 className={styles.title}>Compare Roles</h1>
            <p className={styles.description}>
              Compare two roles side-by-side to understand their shared and unique
              skill requirements.
            </p>
          </header>

          <section className={styles.selectionSection}>
            <div className={styles.selectors}>
              <div className={styles.selector}>
                <label htmlFor="role1" className={styles.label}>
                  Role A
                </label>
                <select
                  id="role1"
                  value={role1}
                  onChange={(e) => setRole1(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select a role...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.slug}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.versus}>vs</div>

              <div className={styles.selector}>
                <label htmlFor="role2" className={styles.label}>
                  Role B
                </label>
                <select
                  id="role2"
                  value={role2}
                  onChange={(e) => setRole2(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select a role...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.slug}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {role1 && role2 && role1 !== role2 && (
              <button onClick={handleCompare} className={styles.compareButton}>
                Compare Roles
              </button>
            )}

            {role1 && role2 && role1 === role2 && (
              <div className={styles.warning}>
                Please select two different roles to compare
              </div>
            )}
          </section>

          {error && <ErrorBanner message={error} />}

          {loading && (
            <div className={styles.loadingState}>
              <Skeleton height="200px" />
              <Skeleton height="300px" />
            </div>
          )}

          {!loading && comparison && (
            <>
              <section className={styles.summarySection}>
                <div className={styles.summaryGrid}>
                  {comparison.role1Data && (
                    <div className={styles.summaryCard}>
                      <Badge variant="role" size="sm">
                        {comparison.role1Data.category}
                      </Badge>
                      <h2 className={styles.summaryTitle}>
                        {comparison.role1Data.name}
                      </h2>
                      <p className={styles.summaryDescription}>
                        {comparison.role1Data.description}
                      </p>
                      <div className={styles.summaryMeta}>
                        <span className={styles.metaItem}>
                          {comparison.role1Data.skillCount} skills
                        </span>
                      </div>
                    </div>
                  )}

                  {comparison.role2Data && (
                    <div className={styles.summaryCard}>
                      <Badge variant="role" size="sm">
                        {comparison.role2Data.category}
                      </Badge>
                      <h2 className={styles.summaryTitle}>
                        {comparison.role2Data.name}
                      </h2>
                      <p className={styles.summaryDescription}>
                        {comparison.role2Data.description}
                      </p>
                      <div className={styles.summaryMeta}>
                        <span className={styles.metaItem}>
                          {comparison.role2Data.skillCount} skills
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {comparison.sharedSkills.length > 0 ? (
                <section className={styles.section}>
                  <SectionHeader
                    title="Shared Skills"
                    description={`${comparison.sharedSkills.length} skills required by both roles`}
                  />
                  <div className={styles.skillList}>
                    {comparison.sharedSkills.map((skill, idx) => (
                      <Badge key={idx} variant="skill">
                        {skill.sharedSkill}
                      </Badge>
                    ))}
                  </div>
                </section>
              ) : (
                <section className={styles.section}>
                  <EmptyState
                    title="No shared skills"
                    description="These roles don't have any skills in common"
                  />
                </section>
              )}

              <div className={styles.uniqueSkillsGrid}>
                <section className={styles.uniqueSection}>
                  <h3 className={styles.uniqueTitle}>
                    Only in {comparison.role1Data?.name}
                  </h3>
                  {comparison.role1OnlySkills.length > 0 ? (
                    <div className={styles.skillList}>
                      {comparison.role1OnlySkills.map((skill, idx) => (
                        <Badge key={idx} variant="default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.emptyText}>
                      All skills are shared with the other role
                    </p>
                  )}
                </section>

                <section className={styles.uniqueSection}>
                  <h3 className={styles.uniqueTitle}>
                    Only in {comparison.role2Data?.name}
                  </h3>
                  {comparison.role2OnlySkills.length > 0 ? (
                    <div className={styles.skillList}>
                      {comparison.role2OnlySkills.map((skill, idx) => (
                        <Badge key={idx} variant="default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.emptyText}>
                      All skills are shared with the other role
                    </p>
                  )}
                </section>
              </div>
            </>
          )}

          {!loading && !comparison && role1 && role2 && (
            <EmptyState
              title="Select two roles to compare"
              description="Choose different roles from the dropdowns above to see their skill comparison"
            />
          )}
        </div>
      </div>
    </main>
  );
}
