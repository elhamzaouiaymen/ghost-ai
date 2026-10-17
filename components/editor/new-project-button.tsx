"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditorDialogs } from "@/hooks/use-editor-dialogs"

export function NewProjectButton() {
  const { openCreate } = useEditorDialogs()

  return (
    <Button
      onClick={openCreate}
      className="gap-2 bg-accent-cyan text-[var(--bg-base)] hover:bg-accent-cyan/80"
    >
      <Plus className="size-4" />
      New project
    </Button>
  )
}
