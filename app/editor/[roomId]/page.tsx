"use server"

import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { AccessDenied } from "@/components/editor/access-denied"
import { getProjectWithAccess } from "@/lib/project-access"
import { WorkspaceView } from "./workspace-view"

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { roomId } = await params
  const project = await getProjectWithAccess(roomId)
  if (!project) return <AccessDenied />

  return <WorkspaceView projectName={project.name} />
}
