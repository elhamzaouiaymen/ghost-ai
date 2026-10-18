"use client"

import * as React from "react"
import { Share2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShareDialog } from "@/components/editor/share-dialog"

interface WorkspaceViewProps {
  projectId: string
  projectName: string
  isOwner: boolean
}

export function WorkspaceView({ projectId, projectName, isOwner }: WorkspaceViewProps) {
  const [aiOpen, setAiOpen] = React.useState(false)
  const [shareOpen, setShareOpen] = React.useState(false)

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Canvas area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Workspace navbar */}
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-4">
          <span className="text-sm font-medium text-copy-primary">{projectName}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
              <Share2 className="mr-1.5 size-3.5" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setAiOpen((v) => !v)}
              aria-label="Toggle AI sidebar"
              aria-pressed={aiOpen}
            >
              <MessageSquare className="size-4" />
            </Button>
          </div>
        </div>

        {/* Canvas placeholder */}
        <div className="canvas-dot-grid flex flex-1 items-center justify-center bg-bg-base">
          <span className="text-sm text-copy-muted">Canvas placeholder</span>
        </div>
      </div>

      {/* Right sidebar placeholder */}
      {aiOpen && (
        <aside className="w-72 shrink-0 border-l border-border-default bg-bg-surface" />
      )}

      <ShareDialog
        projectId={projectId}
        isOwner={isOwner}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </div>
  )
}
