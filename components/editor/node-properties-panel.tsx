"use client"

import { useNodes, useReactFlow } from "@xyflow/react"
import type { CircuitNode } from "@/types/canvas"

const LED_COLORS = [
  { label: "Red",    value: "red",    hex: "#ef4444" },
  { label: "Green",  value: "green",  hex: "#22c55e" },
  { label: "Yellow", value: "yellow", hex: "#eab308" },
  { label: "Blue",   value: "blue",   hex: "#3b82f6" },
]

interface NodePropertiesPanelProps {
  nodeId: string
}

export function NodePropertiesPanel({ nodeId }: NodePropertiesPanelProps) {
  const nodes = useNodes<CircuitNode>()
  const { updateNodeData } = useReactFlow()

  const node = nodes.find((n) => n.id === nodeId)
  if (!node) return null

  const type = node.type

  return (
    <div className="absolute top-4 right-4 z-10 w-52 rounded-lg border border-border-default bg-bg-surface p-3 shadow-lg">
      <p className="mb-3 text-xs font-medium text-copy-secondary uppercase tracking-wide">
        {type === "batteryNode"  ? "Battery"
        : type === "switchNode"  ? "Switch"
        : type === "ledNode"     ? "LED"
        : type === "resistorNode" ? "Resistor"
        : "Component"}
      </p>

      {/* Label — shared by all */}
      <div className="mb-3">
        <p className="mb-1 text-xs text-copy-muted">Label</p>
        <input
          type="text"
          value={(node.data.label as string | undefined) ?? ""}
          onChange={(e) => updateNodeData(nodeId, { label: e.target.value })}
          placeholder="Optional label"
          className="w-full rounded border border-border-default bg-bg-base px-2 py-1 text-xs text-copy-primary focus:outline-none focus:border-accent-cyan"
        />
      </div>

      {/* Switch: state badge */}
      {type === "switchNode" && (
        <div className="mb-3">
          <p className="mb-1 text-xs text-copy-muted">State</p>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              (node.data as { closed: boolean }).closed
                ? "bg-green-900 text-green-400"
                : "bg-red-900 text-red-400"
            }`}
          >
            {(node.data as { closed: boolean }).closed ? "Closed" : "Open"}
          </span>
          <p className="mt-1 text-[10px] text-copy-muted">Click the switch on canvas to toggle</p>
        </div>
      )}

      {/* LED: color picker */}
      {type === "ledNode" && (
        <div className="mb-3">
          <p className="mb-1.5 text-xs text-copy-muted">Color</p>
          <div className="flex gap-2">
            {LED_COLORS.map((c) => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => updateNodeData(nodeId, { color: c.value })}
                className={`size-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  (node.data as { color?: string }).color === c.value
                    ? "border-accent-cyan scale-110"
                    : "border-border-default"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Resistor: resistance value */}
      {type === "resistorNode" && (
        <div className="mb-3">
          <p className="mb-1 text-xs text-copy-muted">Resistance (Ω)</p>
          <input
            type="number"
            min={1}
            step={10}
            value={(node.data as { resistance?: number }).resistance ?? 100}
            onChange={(e) => {
              const v = Math.max(1, Number(e.target.value) || 1)
              updateNodeData(nodeId, { resistance: v })
            }}
            className="w-full rounded border border-border-default bg-bg-base px-2 py-1 text-xs text-copy-primary focus:outline-none focus:border-accent-cyan"
          />
        </div>
      )}
    </div>
  )
}
