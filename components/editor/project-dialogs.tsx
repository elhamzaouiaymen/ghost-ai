"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProjectActions } from "@/hooks/use-project-actions"

type DialogsProps = ReturnType<typeof useProjectActions>

export function ProjectDialogs(props: DialogsProps) {
  const {
    openDialog,
    activeProject,
    isLoading,
    createName,
    setCreateName,
    createSlug,
    handleCreate,
    renameName,
    setRenameName,
    handleRename,
    handleDelete,
    closeDialog,
  } = props

  return (
    <>
      {/* Create Project */}
      <Dialog open={openDialog === "create"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              placeholder="Project name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
            {createName.trim() && (
              <p className="text-xs text-copy-muted">
                Room ID: <span className="font-mono text-copy-secondary">{createSlug}</span>
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!createName.trim() || isLoading}
              className="bg-accent-cyan text-[var(--bg-base)] hover:bg-accent-cyan/80"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Project */}
      <Dialog open={openDialog === "rename"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            {activeProject && (
              <DialogDescription>
                Current name: <span className="font-medium text-copy-secondary">{activeProject.name}</span>
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="py-2">
            <Input
              placeholder="New project name"
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!renameName.trim() || isLoading}
              className="bg-accent-cyan text-[var(--bg-base)] hover:bg-accent-cyan/80"
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project */}
      <Dialog open={openDialog === "delete"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            {activeProject && (
              <DialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-medium text-copy-secondary">{activeProject.name}</span>? This
                action cannot be undone.
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
