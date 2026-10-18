"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Project } from "@prisma/client"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  onOpenCreate: () => void
  onOpenRename: (project: Project) => void
  onOpenDelete: (project: Project) => void
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onOpenCreate,
  onOpenRename,
  onOpenDelete,
  ownedProjects,
  sharedProjects,
}: ProjectSidebarProps) {
  const pathname = usePathname()
  const activeId = pathname.startsWith("/editor/") ? pathname.slice("/editor/".length) : null

  return (
    <div
      inert={!isOpen}
      className={cn(
        "shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out",
        isOpen ? "w-72" : "w-0"
      )}
    >
      <div className="flex h-full w-72 flex-col border-r border-border-default bg-bg-surface">
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

          <TabsContent value="my-projects" className="mt-2 flex flex-1 flex-col gap-1 overflow-y-auto">
            {ownedProjects.length === 0 ? (
              <span className="py-4 text-center text-sm text-copy-muted">No projects yet</span>
            ) : (
              ownedProjects.map((project) => (
                <div
                  key={project.id}
                  className={cn(
                    "group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-bg-elevated",
                    project.id === activeId && "bg-bg-elevated"
                  )}
                >
                  <Link
                    href={`/editor/${project.id}`}
                    className="min-w-0 flex-1 truncate text-sm text-copy-primary"
                  >
                    {project.name}
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="inline-flex size-6 shrink-0 items-center justify-center rounded-md opacity-0 group-hover:opacity-100 text-copy-muted hover:bg-bg-base hover:text-copy-primary focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                      aria-label="Project actions"
                    >
                      <MoreHorizontal className="size-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => onOpenRename(project)}>
                        <Pencil className="mr-2 size-3.5" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onOpenDelete(project)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 size-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="shared" className="mt-2 flex flex-1 flex-col gap-1 overflow-y-auto">
            {sharedProjects.length === 0 ? (
              <span className="py-4 text-center text-sm text-copy-muted">No projects yet</span>
            ) : (
              sharedProjects.map((project) => (
                <div
                  key={project.id}
                  className={cn(
                    "group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-bg-elevated",
                    project.id === activeId && "bg-bg-elevated"
                  )}
                >
                  <Link
                    href={`/editor/${project.id}`}
                    className="min-w-0 flex-1 truncate text-sm text-copy-primary"
                  >
                    {project.name}
                  </Link>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border-default p-3">
        <Button
          onClick={onOpenCreate}
          className="w-full gap-2 bg-accent-cyan text-[var(--bg-base)] hover:bg-accent-cyan/80"
          size="default"
        >
          <Plus className="size-4" />
          New Project
        </Button>
      </div>
      </div>
    </div>
  )
}
