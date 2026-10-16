"use client"

import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <div
      inert={!isOpen}
      className={cn(
        "fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-border-default bg-bg-surface transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border-default px-4">
        <span className="text-sm font-semibold text-copy-primary">Projects</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close sidebar"
          className="text-copy-muted hover:bg-bg-elevated hover:text-copy-primary"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-1 flex-col overflow-hidden p-3">
        <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="flex flex-1 items-center justify-center">
            <span className="text-sm text-copy-muted">No projects yet</span>
          </TabsContent>

          <TabsContent value="shared" className="flex flex-1 items-center justify-center">
            <span className="text-sm text-copy-muted">No projects yet</span>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border-default p-3">
        <Button
          className="w-full gap-2 bg-accent-cyan text-[var(--bg-base)] hover:bg-accent-cyan/80"
          size="default"
        >
          <Plus className="size-4" />
          New Project
        </Button>
      </div>
    </div>
  )
}
