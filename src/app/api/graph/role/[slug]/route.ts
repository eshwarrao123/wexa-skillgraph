import { NextResponse } from "next/server";
import { getRoleDetail, getRoleSubgraph } from "@/lib/queries";
import { SlugSchema } from "@/lib/schemas";
import { z } from "zod";

const GraphQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(10)
    .max(150)
    .optional()
    .default(80),
});

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;
    
    // Validate slug
    const validatedSlug = SlugSchema.parse(slug);

    // Parse query parameters for limit
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    
    // Zod's coerce.number() turns null into 0. Pass undefined when omitted to trigger default().
    const { limit } = GraphQuerySchema.parse({
      limit: limitParam === null ? undefined : limitParam,
    });

    const role = await getRoleDetail(validatedSlug);
    if (!role) {
      return NextResponse.json(
        {
          error: {
            code: "ROLE_NOT_FOUND",
            message: "The requested role could not be found.",
          },
        },
        { status: 404 }
      );
    }

    const graphData = await getRoleSubgraph(validatedSlug, limit);

    // Ensure all data is JSON-safe (remove Neo4j-specific objects)
    const sanitizedData = {
      nodes: graphData.nodes.map((node) => ({
        id: String(node.id),
        name: String(node.name),
        label: String(node.label),
        slug: node.slug ? String(node.slug) : undefined,
        category: node.category ? String(node.category) : undefined,
        difficulty: node.difficulty ? String(node.difficulty) : undefined,
        icon: node.icon ? String(node.icon) : undefined,
      })),
      links: graphData.links.map((link) => ({
        source: String(link.source),
        target: String(link.target),
        type: String(link.type),
      })),
    };

    // Handle empty graph
    if (sanitizedData.nodes.length === 0) {
      return NextResponse.json(
        {
          data: sanitizedData,
          message: "No connections found for this role",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      data: sanitizedData,
    });
  } catch (error) {
    console.error("[API /api/graph/role/[slug]] Error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "Invalid request parameters",
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    // Handle database errors
    return NextResponse.json(
      {
        error: {
          code: "GRAPH_UNAVAILABLE",
          message: "Unable to load the role graph right now. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
