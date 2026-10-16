"use client"

import * as React from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isOpen: boolean
  onToggle: () => void
  toggleRef?: React.RefObject<HTMLButtonElement | null>
}

export function EditorNavbar({ isOpen, onToggle, toggleRef }: EditorNavbarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center border-b border-border-default bg-bg-surface px-3">
      {/* Left section */}
      <div className="flex items-center">
        <Button
          ref={toggleRef}
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          className="text-copy-primary hover:bg-bg-elevated hover:text-copy-primary"
        >
          {isOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </Button>
      </div>

      {/* Center section */}
      <div className="flex flex-1 items-center justify-center" />

      {/* Right section */}
      <div className="flex items-center" />
    </header>
  )
}
