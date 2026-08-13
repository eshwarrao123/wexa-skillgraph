import { NextResponse } from "next/server";
import { getRoleDetail, getSharedSkills } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role1Slug = searchParams.get("role1");
  const role2Slug = searchParams.get("role2");

  if (!role1Slug || !role2Slug) {
    return NextResponse.json(
      { error: "Both role1 and role2 query parameters are required" },
      { status: 400 }
    );
  }

  if (role1Slug === role2Slug) {
    return NextResponse.json(
      { error: "Cannot compare a role with itself" },
      { status: 400 }
    );
  }

  try {
    const [role1Data, role2Data, sharedSkills] = await Promise.all([
      getRoleDetail(role1Slug),
      getRoleDetail(role2Slug),
      getSharedSkills(role1Slug, role2Slug),
    ]);

    if (!role1Data || !role2Data) {
      return NextResponse.json(
        { error: "One or both roles not found" },
        { status: 404 }
      );
    }

    const role1SkillNames = new Set(role1Data.skills.map((s) => s.skill.name));
    const role2SkillNames = new Set(role2Data.skills.map((s) => s.skill.name));
    const sharedSkillNames = new Set(sharedSkills.map((s) => s.sharedSkill));

    const role1OnlySkills = Array.from(role1SkillNames).filter(
      (skill) => !sharedSkillNames.has(skill)
    );

    const role2OnlySkills = Array.from(role2SkillNames).filter(
      (skill) => !sharedSkillNames.has(skill)
    );

    return NextResponse.json({
      role1Data: {
        id: role1Data.id,
        name: role1Data.name,
        slug: role1Data.slug,
        category: role1Data.category,
        description: role1Data.description,
        averageSalary: role1Data.averageSalary,
        skillCount: role1Data.skills.length,
      },
      role2Data: {
        id: role2Data.id,
        name: role2Data.name,
        slug: role2Data.slug,
        category: role2Data.category,
        description: role2Data.description,
        averageSalary: role2Data.averageSalary,
        skillCount: role2Data.skills.length,
      },
      sharedSkills,
      role1OnlySkills,
      role2OnlySkills,
    });
  } catch (error) {
    console.error("[API /api/compare] Error:", error);
    return NextResponse.json(
      { error: "Failed to compare roles" },
      { status: 500 }
    );
  }
}
