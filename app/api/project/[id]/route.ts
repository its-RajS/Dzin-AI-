import { prisma } from "@/packages/database/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = user.id;

    const project = await prisma.project.findUnique({
      where: {
        userId,
        id,
      },
      include: {
        frames: true,
      },
    });

    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to get project" },
      { status: 500 }
    );
  }
}
