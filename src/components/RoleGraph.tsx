"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { type GraphData } from "@/lib/types";
import { Badge } from "./ui/Badge";
import { EmptyState } from "./ui/EmptyState";
import { ErrorBanner } from "./ui/ErrorBanner";
import styles from "./RoleGraph.module.css";

// Dynamic import to avoid SSR issues with canvas
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface RoleGraphProps {
  roleSlug: string;
  roleName: string;
}

interface GraphNode {
  id: string;
  name: string;
  label: string;
  slug?: string;
  category?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
}

interface GraphDataInternal {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function RoleGraph({ roleSlug, roleName }: RoleGraphProps) {
  const [graphData, setGraphData] = useState<GraphDataInternal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  // Fetch graph data
  useEffect(() => {
    let mounted = true;

    async function fetchGraph() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/graph/role/${roleSlug}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error?.message || "Failed to load graph");
        }

        if (mounted) {
          setGraphData(result.data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load graph data"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchGraph();

    return () => {
      mounted = false;
    };
  }, [roleSlug]);

  // Handle responsive sizing
  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.min(600, Math.max(400, width * 0.6));
        setDimensions({ width, height });
      }
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Node color based on type
  const getNodeColor = useCallback((node: GraphNode) => {
    switch (node.label) {
      case "Role":
        return "var(--color-role)";
      case "Skill":
        return "var(--color-skill)";
      case "Technology":
        return "var(--color-tech)";
      case "Project":
        return "var(--color-project)";
      case "Resource":
        return "var(--color-resource)";
      default:
        return "var(--text-muted)";
    }
  }, []);

  // Node size based on type and if it's the center role
  const getNodeSize = useCallback(
    (node: GraphNode) => {
      if (node.label === "Role" && node.slug === roleSlug) {
        return 8; // Center role is largest
      }
      switch (node.label) {
        case "Role":
          return 6;
        case "Skill":
          return 5;
        case "Technology":
          return 5;
        case "Project":
          return 4;
        case "Resource":
          return 3;
        default:
          return 4;
      }
    },
    [roleSlug]
  );

  // Handle node click for navigation
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (node.label === "Role" && node.slug) {
      window.location.href = `/roles/${node.slug}`;
    } else if (node.label === "Skill" && node.slug) {
      window.location.href = `/skills/${node.slug}`;
    }
    // Technology, Project, Resource don't have dedicated pages yet
  }, []);

  // Recenter graph
  const handleRecenter = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 20);
    }
  }, []);

  // Retry on error
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.graphWrapper} ref={containerRef}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonCircle}></div>
            <div className={styles.skeletonText}>Loading graph...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorBanner
          title="Graph unavailable"
          message={error}
          action={
            <button onClick={handleRetry} className={styles.retryButton}>
              Retry
            </button>
          }
        />
      </div>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="No connections to visualize"
          description="This role doesn't have connected skills, technologies, or projects in the database yet."
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Interactive Graph</h3>
          <p className={styles.description}>
            Explore {roleName}'s connected skills, technologies, and projects
          </p>
        </div>
        <button onClick={handleRecenter} className={styles.recenterButton}>
          <span className={styles.recenterIcon}>◈</span>
          Recenter
        </button>
      </div>

      <div className={styles.graphWrapper} ref={containerRef}>
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          nodeLabel="name"
          nodeColor={(node: any) => getNodeColor(node as GraphNode)}
          nodeRelSize={5}
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            const size = getNodeSize(node);
            const color = getNodeColor(node);
            const isCenter = node.label === "Role" && node.slug === roleSlug;

            // Draw node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();

            // Add border for center role
            if (isCenter) {
              ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
              ctx.lineWidth = 2 / globalScale;
              ctx.stroke();
            }

            // Draw label at appropriate zoom
            if (globalScale > 1.5 || isCenter) {
              ctx.font = `${fontSize}px Inter, sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "var(--text-primary)";
              ctx.fillText(label, node.x, node.y + size + fontSize);
            }
          }}
          linkColor={() => "rgba(100, 116, 139, 0.3)"}
          linkWidth={1}
          linkDirectionalParticles={0}
          onNodeClick={(node: any) => handleNodeClick(node as GraphNode)}
          onNodeHover={(node: any) => setHoveredNode(node as GraphNode)}
          cooldownTicks={100}
          d3VelocityDecay={0.3}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
        />

        {hoveredNode && (
          <div className={styles.tooltip}>
            <div className={styles.tooltipTitle}>{hoveredNode.name}</div>
            <div className={styles.tooltipType}>{hoveredNode.label}</div>
            {hoveredNode.category && (
              <div className={styles.tooltipMeta}>{hoveredNode.category}</div>
            )}
          </div>
        )}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendTitle}>Node Types</div>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <Badge variant="role" size="sm">
              Role
            </Badge>
          </div>
          <div className={styles.legendItem}>
            <Badge variant="skill" size="sm">
              Skill
            </Badge>
          </div>
          <div className={styles.legendItem}>
            <Badge variant="tech" size="sm">
              Technology
            </Badge>
          </div>
          <div className={styles.legendItem}>
            <Badge variant="project" size="sm">
              Project
            </Badge>
          </div>
          <div className={styles.legendItem}>
            <Badge variant="resource" size="sm">
              Resource
            </Badge>
          </div>
        </div>
      </div>

      <div className={styles.textAlternative}>
        <h4 className={styles.altTitle}>Connected Entities</h4>
        <div className={styles.altContent}>
          {["Role", "Skill", "Technology", "Project", "Resource"].map(
            (type) => {
              const nodes = graphData.nodes.filter((n) => n.label === type);
              if (nodes.length === 0) return null;

              return (
                <div key={type} className={styles.altSection}>
                  <strong className={styles.altSectionTitle}>
                    {type}s ({nodes.length}):
                  </strong>
                  <span className={styles.altList}>
                    {nodes.map((n) => n.name).join(", ")}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
