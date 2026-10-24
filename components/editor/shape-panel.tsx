"use client"

import type { ElectricComponentType, ComponentDragPayload } from "@/types/canvas"

const DRAG_TYPE = "application/ghost-shape"

interface ComponentEntry {
  componentType: ElectricComponentType
  label: string
  width: number
  height: number
  icon: string
}

const COMPONENTS: ComponentEntry[] = [
  { componentType: "battery",  label: "Battery",  width: 120, height: 60,  icon: "🔋" },
  { componentType: "switch",   label: "Switch",   width: 100, height: 80,  icon: "🔌" },
  { componentType: "led",      label: "LED",      width: 80,  height: 80,  icon: "💡" },
  { componentType: "resistor", label: "Resistor", width: 120, height: 60,  icon: "〰️" },
]

function onDragStart(e: React.DragEvent, entry: ComponentEntry) {
  const payload: ComponentDragPayload = {
    componentType: entry.componentType,
    width: entry.width,
    height: entry.height,
  }
  e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(payload))
  e.dataTransfer.effectAllowed = "copy"
}

interface ShapePanelProps {
  onInsert: (payload: ComponentDragPayload) => void
}

export function ShapePanel({ onInsert }: ShapePanelProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full border border-border-default bg-bg-surface px-4 py-2 shadow-lg">
      {COMPONENTS.map((entry) => (
        <button
          key={entry.componentType}
          draggable
          onDragStart={(e) => onDragStart(e, entry)}
          onClick={() =>
            onInsert({ componentType: entry.componentType, width: entry.width, height: entry.height })
          }
          title={`${entry.label} — click or drag`}
          className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-copy-secondary transition-colors hover:bg-bg-elevated hover:text-copy-primary cursor-grab active:cursor-grabbing"
        >
          <span className="text-xl leading-none">{entry.icon}</span>
          <span className="text-[10px]">{entry.label}</span>
        </button>
      ))}
    </div>
  )
}

export { DRAG_TYPE }
