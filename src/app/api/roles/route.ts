import { NextResponse } from "next/server";
import { getAllRoles } from "@/lib/queries";

export async function GET() {
  try {
    const roles = await getAllRoles();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("[API /api/roles] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}
