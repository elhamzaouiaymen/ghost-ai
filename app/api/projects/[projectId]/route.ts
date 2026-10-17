import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 });
  }

  const { name: rawName } = body as Record<string, unknown>;
  if (typeof rawName !== "string" || !rawName.trim()) {
    return NextResponse.json({ error: "name is required and must be a non-empty string" }, { status: 400 });
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: { name: rawName.trim() },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.project.delete({ where: { id: projectId } });

  return new NextResponse(null, { status: 204 });
}
