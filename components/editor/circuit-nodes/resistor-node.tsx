"use client"

import { Handle, Position } from "@xyflow/react"
import type { NodeProps } from "@xyflow/react"
import type { ResistorNode } from "@/types/canvas"

export function ResistorNodeComponent({ data, selected }: NodeProps<ResistorNode>) {
  const label = data.resistance != null ? `${data.resistance}Ω` : (data.label || "Resistor")

  return (
    <div
      className={`relative size-full flex items-center justify-center border-2 rounded-lg ${
        selected ? "border-accent-cyan" : "border-orange-600"
      } bg-orange-900 select-none`}
    >
      <Handle type="target" position={Position.Left}  id="left"  className="!bg-orange-400" />

      {/* Resistor zigzag symbol */}
      <svg width="70" height="28" viewBox="0 0 70 28" className="shrink-0">
        {/* Wire stubs */}
        <line x1="0"  y1="14" x2="10" y2="14" stroke="#fb923c" strokeWidth="2" />
        <line x1="60" y1="14" x2="70" y2="14" stroke="#fb923c" strokeWidth="2" />
        {/* Zigzag body */}
        <polyline
          points="10,14 16,4 22,24 28,4 34,24 40,4 46,24 52,4 58,14 60,14"
          fill="none"
          stroke="#fb923c"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      <span className="absolute bottom-1 text-[10px] font-medium text-orange-300 truncate px-1">
        {label}
      </span>

      <Handle type="source" position={Position.Right} id="right" className="!bg-orange-400" />
    </div>
  )
}
