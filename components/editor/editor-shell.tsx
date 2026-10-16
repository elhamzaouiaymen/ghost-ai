"use client"

import * as React from "react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"

export function EditorShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const toggleRef = React.useRef<HTMLButtonElement>(null)

  function handleClose() {
    setIsOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <div className="flex h-full flex-col">
      <EditorNavbar isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} toggleRef={toggleRef} />
      <ProjectSidebar isOpen={isOpen} onClose={handleClose} />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
