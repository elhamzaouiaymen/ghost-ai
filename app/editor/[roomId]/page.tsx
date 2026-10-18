import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { Share2, MessageSquare } from "lucide-react"
import { AccessDenied } from "@/components/editor/access-denied"
import { getProjectWithAccess } from "@/lib/project-access"
import { Button } from "@/components/ui/button"

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

  return (
    <div className="flex h-full">
      {/* Workspace area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Workspace navbar */}
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-4">
          <span className="text-sm font-medium text-copy-primary">{project.name}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>
              <Share2 className="mr-1.5 size-3.5" />
              Share
            </Button>
            <Button variant="ghost" size="icon-sm" disabled aria-label="Toggle AI sidebar">
              <MessageSquare className="size-4" />
            </Button>
          </div>
        </div>

        {/* Canvas placeholder */}
        <div className="flex flex-1 items-center justify-center bg-bg-base">
          <span className="text-sm text-copy-muted">Canvas placeholder</span>
        </div>
      </div>

      {/* Right sidebar placeholder */}
      <aside className="w-72 shrink-0 border-l border-border-default bg-bg-surface" />
    </div>
  )
}
