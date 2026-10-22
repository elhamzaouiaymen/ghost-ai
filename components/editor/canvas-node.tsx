"use client"

import { Handle, Position } from "@xyflow/react"
import type { NodeProps } from "@xyflow/react"
import type { CanvasNode } from "@/types/canvas"

export function CanvasNodeComponent({ data, selected }: NodeProps<CanvasNode>) {
  return (
    <div
      className={`size-full flex items-center justify-center border text-xs text-copy-primary ${
        selected ? "border-accent-cyan" : "border-border-default"
      }`}
      style={{ backgroundColor: data.color || "var(--bg-surface)" }}
    >
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <span className="truncate px-2">{data.label}</span>
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  )
}
