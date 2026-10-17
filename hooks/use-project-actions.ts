"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"

export type DialogType = "create" | "rename" | "delete" | null

interface ProjectRef {
  id: string
  name: string
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function shortSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}

export function useProjectActions() {
  const router = useRouter()
  const params = useParams()
  const activeWorkspaceId = typeof params?.projectId === "string" ? params.projectId : undefined

  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const [activeProject, setActiveProject] = useState<ProjectRef | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Create form state
  const [createName, setCreateName] = useState("")
  const [createSuffix, setCreateSuffix] = useState("")
  const createSlug = createName.trim() ? `${toSlug(createName)}-${createSuffix}` : ""

  // Rename form state
  const [renameName, setRenameName] = useState("")

  function openCreate() {
    setCreateName("")
    setCreateSuffix(shortSuffix())
    setOpenDialog("create")
  }

  function openRename(project: ProjectRef) {
    setActiveProject(project)
    setRenameName(project.name)
    setOpenDialog("rename")
  }

  function openDelete(project: ProjectRef) {
    setActiveProject(project)
    setOpenDialog("delete")
  }

  function closeDialog() {
    setOpenDialog(null)
    setActiveProject(null)
    setIsLoading(false)
  }

  async function handleCreate() {
    if (!createName.trim()) return
    const roomId = `${toSlug(createName)}-${createSuffix}`
    setIsLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roomId, name: createName.trim() }),
      })
      if (!res.ok) throw new Error("Failed to create project")
      const project = await res.json()
      closeDialog()
      router.push(`/editor/${project.id}`)
      router.refresh()
    } catch {
      setIsLoading(false)
    }
  }

  async function handleRename() {
    if (!activeProject || !renameName.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameName.trim() }),
      })
      if (!res.ok) throw new Error("Failed to rename project")
      closeDialog()
      router.refresh()
    } catch {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!activeProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete project")
      closeDialog()
      if (activeWorkspaceId === activeProject.id) {
        router.push("/editor")
        router.refresh()
      } else {
        router.refresh()
      }
    } catch {
      setIsLoading(false)
    }
  }

  return {
    openDialog,
    activeProject,
    isLoading,
    // Create
    createName,
    setCreateName,
    createSlug,
    openCreate,
    handleCreate,
    // Rename
    renameName,
    setRenameName,
    openRename,
    handleRename,
    // Delete
    openDelete,
    handleDelete,
    // Close
    closeDialog,
  }
}
