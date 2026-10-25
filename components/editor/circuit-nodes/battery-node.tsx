"use client"

import { Handle, Position } from "@xyflow/react"
import type { NodeProps } from "@xyflow/react"
import type { BatteryNode } from "@/types/canvas"

export function BatteryNodeComponent({ data, selected }: NodeProps<BatteryNode>) {
  return (
    <div
      className={`relative size-full flex items-center justify-between rounded-full px-3 text-xs font-bold border-2 ${
        selected ? "border-accent-cyan" : "border-yellow-400"
      } bg-yellow-400 text-yellow-900 select-none`}
    >
      <Handle type="target" position={Position.Left}  id="left"  className="!bg-yellow-900" />
      <span className="text-sm">−</span>
      <span className="truncate text-center flex-1 px-1">{data.label || "Battery"}</span>
      <span className="text-sm">+</span>
      <Handle type="source" position={Position.Right} id="right" className="!bg-yellow-900" />
    </div>
  )
}
