"use client"

import { useContext } from "react"
import { EditorDialogsContext } from "@/contexts/editor-dialogs-context"

export function useEditorDialogs() {
  const ctx = useContext(EditorDialogsContext)
  if (!ctx) throw new Error("useEditorDialogs must be used within EditorShell")
  return ctx
}
