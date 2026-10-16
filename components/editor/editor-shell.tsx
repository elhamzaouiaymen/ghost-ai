"use client"

import { useState } from "react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"

export function EditorShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <EditorNavbar isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} />
      <ProjectSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
