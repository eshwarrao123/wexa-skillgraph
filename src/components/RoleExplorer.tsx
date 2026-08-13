"use client";

import { useState, useMemo } from "react";
import { type RoleWithSkillCount } from "@/lib/types";
import { RoleGrid } from "./RoleGrid";
import styles from "./RoleExplorer.module.css";

interface RoleExplorerProps {
  roles: RoleWithSkillCount[];
}

export function RoleExplorer({ roles }: RoleExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = new Set(roles.map((r) => r.category));
    return ["all", ...Array.from(cats).sort()];
  }, [roles]);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch = role.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || role.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [roles, search, selectedCategory]);

  return (
    <div className={styles.explorer}>
      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Search roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label="Search roles"
        />

        <div className={styles.categoryFilters}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${styles.categoryButton} ${
                selectedCategory === category ? styles.categoryButtonActive : ""
              }`}
              aria-pressed={selectedCategory === category}
            >
              {category === "all" ? "All Roles" : category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.results}>
        <div className={styles.resultCount}>
          {filteredRoles.length} {filteredRoles.length === 1 ? "role" : "roles"}
        </div>
        <RoleGrid
          roles={filteredRoles}
          emptyMessage={
            search || selectedCategory !== "all"
              ? "No roles match your filters"
              : "No roles available"
          }
        />
      </div>
    </div>
  );
}
