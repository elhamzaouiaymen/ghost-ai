import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentIdentity } from "@/lib/project-access"

type Params = { params: Promise<{ projectId: string }> }

interface EnrichedCollaborator {
  email: string
  name: string | null
  avatar: string | null
}

async function enrichEmails(emails: string[]): Promise<EnrichedCollaborator[]> {
  if (emails.length === 0) return []
  try {
    const clerk = await clerkClient()
    const result = await clerk.users.getUserList({ emailAddress: emails, limit: 100 })
    const byEmail = new Map<string, (typeof result.data)[0]>()
    for (const user of result.data) {
      for (const ea of user.emailAddresses) {
        byEmail.set(ea.emailAddress, user)
      }
    }
    return emails.map((email) => {
      const user = byEmail.get(email)
      if (!user) return { email, name: null, avatar: null }
      const name =
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
        user.username ||
        null
      return { email, name, avatar: user.imageUrl || null }
    })
  } catch {
    return emails.map((email) => ({ email, name: null, avatar: null }))
  }
}

export async function GET(_req: Request, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const isOwner = project.ownerId === userId

  if (!isOwner) {
    const identity = await getCurrentIdentity()
    if (!identity?.primaryEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    const collab = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email: identity.primaryEmail } },
    })
    if (!collab) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  })

  const collaborators = await enrichEmails(rows.map((r) => r.email))
  return NextResponse.json({ isOwner, collaborators })
}

export async function POST(req: Request, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (project.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { email: rawEmail } = body as Record<string, unknown>
  if (typeof rawEmail !== "string" || !rawEmail.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 400 })
  }
  const email = rawEmail.trim().toLowerCase()

  await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId, email } },
    update: {},
    create: { projectId, email },
  })

  const [enriched] = await enrichEmails([email])
  return NextResponse.json(enriched, { status: 201 })
}

export async function DELETE(req: Request, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (project.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { email: rawEmail } = body as Record<string, unknown>
  if (typeof rawEmail !== "string" || !rawEmail.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 400 })
  }
  const email = rawEmail.trim().toLowerCase()

  await prisma.projectCollaborator.deleteMany({ where: { projectId, email } })
  return new NextResponse(null, { status: 204 })
}
