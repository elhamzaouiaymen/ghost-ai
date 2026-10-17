"use client"

import * as React from "react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogs } from "./project-dialogs"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import { EditorDialogsContext } from "@/contexts/editor-dialogs-context"

export function EditorShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const toggleRef = React.useRef<HTMLButtonElement>(null)
  const dialogs = useProjectDialogs()

  function handleClose() {
    setIsOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <EditorDialogsContext.Provider value={{ openCreate: dialogs.openCreate }}>
      <div className="flex h-full flex-col">
        <EditorNavbar isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} toggleRef={toggleRef} />
        <ProjectSidebar
          isOpen={isOpen}
          onClose={handleClose}
          onOpenCreate={dialogs.openCreate}
          onOpenRename={dialogs.openRename}
          onOpenDelete={dialogs.openDelete}
        />
        <ProjectDialogs {...dialogs} />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </EditorDialogsContext.Provider>
  )
}
