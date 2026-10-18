import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import type { Project } from "@prisma/client"

export async function getCurrentIdentity(): Promise<{
  userId: string
  primaryEmail: string | null
} | null> {
  const user = await currentUser()
  if (!user) return null

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    null

  return { userId: user.id, primaryEmail }
}

export async function getProjectWithAccess(projectId: string): Promise<Project | null> {
  const identity = await getCurrentIdentity()
  if (!identity) return null

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return null

  if (project.ownerId === identity.userId) return project

  if (identity.primaryEmail) {
    const collab = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email: identity.primaryEmail } },
    })
    if (collab) return project
  }

  return null
}
