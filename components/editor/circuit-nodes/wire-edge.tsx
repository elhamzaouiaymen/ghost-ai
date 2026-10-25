"use client"

import { useCallback } from "react"
import { getBezierPath, EdgeLabelRenderer, useReactFlow } from "@xyflow/react"
import type { EdgeProps } from "@xyflow/react"

export function WireEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) {
  const { deleteElements } = useReactFlow()

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      deleteElements({ edges: [{ id }] })
    },
    [id, deleteElements],
  )

  return (
    <>
      {/* Wide invisible hit area so the wire is easy to click */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={14}
        stroke="transparent"
        className="react-flow__edge-interaction"
      />
      {/* Visible wire */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={selected ? 3 : 2}
        stroke={selected ? "#06b6d4" : "#64748b"}
        strokeLinecap="round"
        className="react-flow__edge-path transition-colors"
      />
      {/* Delete button — appears when the wire is selected */}
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <button
              onClick={onDelete}
              title="Remove wire"
              className="flex size-5 items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold leading-none hover:bg-red-600 transition-colors shadow"
            >
              ×
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
