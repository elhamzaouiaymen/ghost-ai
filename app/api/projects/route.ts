import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  if (rawName !== undefined && typeof rawName !== "string") {
    return NextResponse.json({ error: "name must be a string" }, { status: 400 });
  }

  const name = typeof rawName === "string" && rawName.trim() ? rawName.trim() : "Untitled Project";

  const project = await prisma.project.create({
    data: { ownerId: userId, name },
  });

  return NextResponse.json(project, { status: 201 });
}
