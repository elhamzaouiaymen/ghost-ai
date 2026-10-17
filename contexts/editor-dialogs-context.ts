"use client"

import { createContext } from "react"

interface EditorDialogsContextValue {
  openCreate: () => void
}

export const EditorDialogsContext = createContext<EditorDialogsContextValue | null>(null)
