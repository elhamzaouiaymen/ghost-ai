"use client"

import * as React from "react"
import { Share2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WorkspaceViewProps {
  projectName: string
}

export function WorkspaceView({ projectName }: WorkspaceViewProps) {
  const [aiOpen, setAiOpen] = React.useState(false)

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Canvas area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Workspace navbar */}
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-4">
          <span className="text-sm font-medium text-copy-primary">{projectName}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>
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
        <div
          className="flex flex-1 items-center justify-center bg-bg-base"
          style={{
            backgroundImage: "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <span className="text-sm text-copy-muted">Canvas placeholder</span>
        </div>
      </div>

      {/* Right sidebar placeholder */}
      {aiOpen && (
        <aside className="w-72 shrink-0 border-l border-border-default bg-bg-surface" />
      )}
    </div>
  )
}
