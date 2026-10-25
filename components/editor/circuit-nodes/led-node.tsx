"use client"

import { Handle, Position } from "@xyflow/react"
import type { NodeProps } from "@xyflow/react"
import type { LedNode } from "@/types/canvas"
import { usePoweredIds } from "./simulation-context"

const LED_COLORS: Record<string, { base: string; glow: string }> = {
  red:    { base: "#ef4444", glow: "rgba(239,68,68,0.6)" },
  green:  { base: "#22c55e", glow: "rgba(34,197,94,0.6)" },
  yellow: { base: "#eab308", glow: "rgba(234,179,8,0.6)" },
  blue:   { base: "#3b82f6", glow: "rgba(59,130,246,0.6)" },
}

const DEFAULT_COLOR = "red"

export function LedNodeComponent({ id, data, selected }: NodeProps<LedNode>) {
  const poweredIds = usePoweredIds()
  const isPowered = poweredIds.has(id)
  const colorKey = data.color ?? DEFAULT_COLOR
  const colors = LED_COLORS[colorKey] ?? LED_COLORS[DEFAULT_COLOR]

  return (
    <div
      className={`relative size-full flex flex-col items-center justify-center gap-1 rounded-full border-2 ${
        selected ? "border-accent-cyan" : "border-slate-600"
      } bg-bg-surface select-none transition-all duration-300`}
      style={
        isPowered
          ? { boxShadow: `0 0 16px 6px ${colors.glow}`, borderColor: colors.base }
          : undefined
      }
    >
      <Handle type="target" position={Position.Left}  id="left"  className="!bg-slate-500" />

      {/* LED bulb icon */}
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="16"
          r="10"
          fill={isPowered ? colors.base : "#374151"}
          stroke={colors.base}
          strokeWidth="2"
          style={{ transition: "fill 0.3s" }}
        />
        {/* Filament cross */}
        <line x1="14" y1="12" x2="22" y2="20" stroke={isPowered ? "#fff" : "#6b7280"} strokeWidth="1.5" />
        <line x1="22" y1="12" x2="14" y2="20" stroke={isPowered ? "#fff" : "#6b7280"} strokeWidth="1.5" />
        {/* Base */}
        <rect x="14" y="26" width="8" height="3" rx="1" fill={colors.base} />
        <line x1="18" y1="29" x2="18" y2="33" stroke={colors.base} strokeWidth="2" />
      </svg>

      <span className="text-[10px] font-medium text-copy-secondary truncate px-1">
        {data.label || "LED"}
      </span>

      <Handle type="source" position={Position.Right} id="right" className="!bg-slate-500" />
    </div>
  )
}
