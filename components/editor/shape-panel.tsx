"use client"

import { RectangleHorizontal, Diamond, Circle, Pill, Cylinder, Hexagon } from "lucide-react"
import type { CanvasShape, ShapeDragPayload } from "@/types/canvas"

const DRAG_TYPE = "application/ghost-shape"

interface ShapeEntry {
  shape: CanvasShape
  label: string
  width: number
  height: number
  icon: React.ReactNode
}

const SHAPES: ShapeEntry[] = [
  { shape: "rectangle", label: "Rectangle", width: 160, height: 80,  icon: <RectangleHorizontal className="size-4" /> },
  { shape: "diamond",   label: "Diamond",   width: 140, height: 120, icon: <Diamond   className="size-4" /> },
  { shape: "circle",    label: "Circle",    width: 80,  height: 80,  icon: <Circle    className="size-4" /> },
  { shape: "pill",      label: "Pill",      width: 160, height: 60,  icon: <Pill      className="size-4" /> },
  { shape: "cylinder",  label: "Cylinder",  width: 80,  height: 100, icon: <Cylinder  className="size-4" /> },
  { shape: "hexagon",   label: "Hexagon",   width: 100, height: 100, icon: <Hexagon   className="size-4" /> },
]

function onDragStart(e: React.DragEvent, entry: ShapeEntry) {
  const payload: ShapeDragPayload = { shape: entry.shape, width: entry.width, height: entry.height }
  e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(payload))
  e.dataTransfer.effectAllowed = "copy"
}

export function ShapePanel() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-full border border-border-default bg-bg-surface px-3 py-2 shadow-lg">
      {SHAPES.map((entry) => (
        <button
          key={entry.shape}
          draggable
          onDragStart={(e) => onDragStart(e, entry)}
          title={entry.label}
          className="flex size-8 cursor-grab items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-bg-elevated hover:text-copy-primary active:cursor-grabbing"
        >
          {entry.icon}
        </button>
      ))}
    </div>
  )
}

export { DRAG_TYPE }
