"use client"

import { useCallback } from "react"
import { Handle, Position, useReactFlow } from "@xyflow/react"
import type { NodeProps } from "@xyflow/react"
import type { SwitchNode } from "@/types/canvas"

export function SwitchNodeComponent({ id, data, selected }: NodeProps<SwitchNode>) {
  const { updateNodeData } = useReactFlow()

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      updateNodeData(id, { closed: !data.closed })
    },
    [id, data.closed, updateNodeData],
  )

  return (
    <div
      className={`relative size-full flex flex-col items-center justify-center gap-1 rounded-lg border-2 ${
        selected ? "border-accent-cyan" : "border-slate-500"
      } bg-bg-surface select-none cursor-pointer`}
      onClick={toggle}
      title={data.closed ? "Click to open switch" : "Click to close switch"}
    >
      <Handle type="target" position={Position.Left}  id="left"  className="!bg-slate-500" />

      {/* Switch visual */}
      <svg width="60" height="28" viewBox="0 0 60 28">
        {/* Left contact */}
        <circle cx="6" cy="14" r="4" fill="#64748b" />
        {/* Right contact */}
        <circle cx="54" cy="14" r="4" fill="#64748b" />
        {/* Wire stubs */}
        <line x1="0" y1="14" x2="10" y2="14" stroke="#64748b" strokeWidth="2" />
        <line x1="50" y1="14" x2="60" y2="14" stroke="#64748b" strokeWidth="2" />
        {/* Bridging arm */}
        {data.closed ? (
          <line x1="10" y1="14" x2="50" y2="14" stroke="#22c55e" strokeWidth="2.5" />
        ) : (
          <line x1="10" y1="14" x2="44" y2="6"  stroke="#ef4444" strokeWidth="2.5" />
        )}
      </svg>

      <span className={`text-[10px] font-medium ${data.closed ? "text-green-400" : "text-red-400"}`}>
        {data.label || (data.closed ? "Closed" : "Open")}
      </span>

      <Handle type="source" position={Position.Right} id="right" className="!bg-slate-500" />
    </div>
  )
}
