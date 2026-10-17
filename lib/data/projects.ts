import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import type { Project } from "@prisma/client"

export async function getProjectsForUser(): Promise<{ owned: Project[]; shared: Project[] }> {
  const user = await currentUser()
  if (!user) return { owned: [], shared: [] }

  const email = user.emailAddresses[0]?.emailAddress

  const [owned, shared] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    email
      ? prisma.project.findMany({
          where: { collaborators: { some: { email } } },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([] as Project[]),
  ])

  return { owned, shared }
}
