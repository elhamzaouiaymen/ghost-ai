"use client"

import { useNodes, useReactFlow } from "@xyflow/react"
import type { CanvasNode } from "@/types/canvas"

const COLOR_SWATCHES = [
  { label: "Default", value: "" },
  { label: "Blue",   value: "#3B82F6" },
  { label: "Cyan",   value: "#06B6D4" },
  { label: "Green",  value: "#22C55E" },
  { label: "Yellow", value: "#EAB308" },
  { label: "Orange", value: "#F97316" },
  { label: "Red",    value: "#EF4444" },
  { label: "Purple", value: "#A855F7" },
  { label: "Pink",   value: "#EC4899" },
]

interface NodePropertiesPanelProps {
  nodeId: string
}

export function NodePropertiesPanel({ nodeId }: NodePropertiesPanelProps) {
  const nodes = useNodes<CanvasNode>()
  const { updateNodeData, updateNode } = useReactFlow()

  const node = nodes.find((n) => n.id === nodeId)
  if (!node) return null

  const color = node.data.color ?? ""
  const width = node.width ?? 160
  const height = node.height ?? 80

  return (
    <div className="absolute top-4 right-4 z-10 w-52 rounded-lg border border-border-default bg-bg-surface p-3 shadow-lg">
      <p className="mb-3 text-xs font-medium text-copy-secondary uppercase tracking-wide">Node</p>

      <div className="mb-3">
        <p className="mb-1.5 text-xs text-copy-muted">Color</p>
        <div className="flex flex-wrap gap-1.5">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.value}
              title={swatch.label}
              onClick={() => updateNodeData(nodeId, { color: swatch.value || undefined })}
              className={`size-5 rounded border-2 transition-transform hover:scale-110 ${
                color === swatch.value ? "border-accent-cyan scale-110" : "border-border-default"
              }`}
              style={{ backgroundColor: swatch.value || "var(--bg-elevated)" }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs text-copy-muted">Size</p>
        <div className="flex gap-2">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[10px] text-copy-muted">W</span>
            <input
              type="number"
              min={20}
              step={10}
              value={width}
              onChange={(e) => updateNode(nodeId, { width: Math.max(20, Number(e.target.value)) })}
              className="w-full rounded border border-border-default bg-bg-base px-1.5 py-1 text-xs text-copy-primary focus:outline-none focus:border-accent-cyan"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[10px] text-copy-muted">H</span>
            <input
              type="number"
              min={20}
              step={10}
              value={height}
              onChange={(e) => updateNode(nodeId, { height: Math.max(20, Number(e.target.value)) })}
              className="w-full rounded border border-border-default bg-bg-base px-1.5 py-1 text-xs text-copy-primary focus:outline-none focus:border-accent-cyan"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
