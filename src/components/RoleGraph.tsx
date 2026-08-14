"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { ForceGraphMethods } from "react-force-graph-2d";
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
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const router = useRouter();

  // Fetch graph data
  useEffect(() => {
    let mounted = true;

    async function fetchGraph() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/graph/role/${roleSlug}`);

        if (!response.ok) {
          const isJson = response.headers.get("content-type")?.includes("application/json");
          if (isJson) {
            const errorResult = await response.json();
            throw new Error(errorResult.error?.message || "Failed to load graph");
          } else {
            const textResponse = await response.text();
            console.error("API returned non-JSON error:", textResponse.substring(0, 200));
            throw new Error("Unable to load the role graph right now.");
          }
        }

        const isJson = response.headers.get("content-type")?.includes("application/json");
        if (!isJson) {
          throw new Error("Unable to load the role graph right now.");
        }

        const result = await response.json();

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
        return "#3b82f6";
      case "Skill":
        return "#10b981";
      case "Technology":
        return "#8b5cf6";
      case "Project":
        return "#f59e0b";
      case "Resource":
        return "#64748b";
      default:
        return "#94a3b8";
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

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (node.label === "Role" && node.slug) {
        router.push(`/roles/${node.slug}`);
      } else if (node.label === "Skill" && node.slug) {
        router.push(`/skills/${node.slug}`);
      }
    },
    [router]
  );

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
            Explore {roleName}&apos;s connected skills, technologies, and projects
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
          nodeColor={(node: unknown) => getNodeColor(node as GraphNode)}
          nodeRelSize={5}
          nodeCanvasObject={(node: unknown, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const graphNode = node as GraphNode;
            const label = graphNode.name;
            const fontSize = 12 / globalScale;
            const size = getNodeSize(graphNode);
            const color = getNodeColor(graphNode);
            const isCenter = graphNode.label === "Role" && graphNode.slug === roleSlug;
            const x = graphNode.x ?? 0;
            const y = graphNode.y ?? 0;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();

            if (isCenter) {
              ctx.strokeStyle = "rgba(198, 190, 190, 0.8)";
              ctx.lineWidth = 2 / globalScale;
              ctx.stroke();
            }

            if (globalScale > 1.5 || isCenter) {
              ctx.font = `${fontSize}px Inter, sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";

              const labelY = y + size + fontSize;

              // Add dark stroke for readability
              ctx.lineWidth = 2.5 / globalScale;
              ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
              ctx.strokeText(label, x, labelY);

              // Light contrasting text color
              ctx.fillStyle = "#F8FAFC";
              ctx.fillText(label, x, labelY);
            }
          }}
          linkColor={() => "rgba(248, 248, 248, 0.97)"}
          linkWidth={1}
          linkDirectionalParticles={0}
          onNodeClick={(node: unknown) => handleNodeClick(node as GraphNode)}
          onNodeHover={(node: unknown) => setHoveredNode(node ? (node as GraphNode) : null)}
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
