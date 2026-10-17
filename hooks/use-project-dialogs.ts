"use client"

import { useState } from "react"

export type DialogType = "create" | "rename" | "delete" | null

interface MockProject {
  id: string
  name: string
  slug: string
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function useProjectDialogs() {
  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const [activeProject, setActiveProject] = useState<MockProject | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Create form state
  const [createName, setCreateName] = useState("")
  const createSlug = toSlug(createName)

  // Rename form state
  const [renameName, setRenameName] = useState("")

  function openCreate() {
    setCreateName("")
    setOpenDialog("create")
  }

  function openRename(project: MockProject) {
    setActiveProject(project)
    setRenameName(project.name)
    setOpenDialog("rename")
  }

  function openDelete(project: MockProject) {
    setActiveProject(project)
    setOpenDialog("delete")
  }

  function closeDialog() {
    setOpenDialog(null)
    setActiveProject(null)
    setIsLoading(false)
  }

  function handleCreate() {
    if (!createName.trim()) return
    setIsLoading(true)
    // Mock submit — no API call
    setTimeout(() => {
      closeDialog()
    }, 400)
  }

  function handleRename() {
    if (!renameName.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      closeDialog()
    }, 400)
  }

  function handleDelete() {
    setIsLoading(true)
    setTimeout(() => {
      closeDialog()
    }, 400)
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
