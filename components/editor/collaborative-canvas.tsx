"use client"

import { useCallback, useState } from "react"
import { ReactFlow, Background, MiniMap, BackgroundVariant, useReactFlow } from "@xyflow/react"
import type { OnSelectionChangeParams } from "@xyflow/react"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"
import type { CanvasNode, CanvasEdge, CanvasShape, ShapeDragPayload } from "@/types/canvas"
import { CanvasNodeComponent } from "./canvas-node"
import { ShapePanel, DRAG_TYPE } from "./shape-panel"
import { NodePropertiesPanel } from "./node-properties-panel"

const nodeTypes = { canvasNode: CanvasNodeComponent }
const edgeTypes = {}

const VALID_SHAPES = new Set<CanvasShape>([
  "rectangle", "diamond", "circle", "pill", "cylinder", "hexagon",
])

function isShapeDragPayload(value: unknown): value is ShapeDragPayload {
  if (typeof value !== "object" || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.shape === "string" &&
    VALID_SHAPES.has(v.shape as CanvasShape) &&
    typeof v.width === "number" &&
    Number.isFinite(v.width) &&
    typeof v.height === "number" &&
    Number.isFinite(v.height)
  )
}

let nodeCounter = 0

export function CollaborativeCanvas() {
  const { screenToFlowPosition, addNodes } = useReactFlow()
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const onSelectionChange = useCallback(({ nodes }: OnSelectionChangeParams) => {
    setSelectedNodeId(nodes.length === 1 ? nodes[0].id : null)
  }, [])
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  const onInsert = useCallback(
    (payload: ShapeDragPayload) => {
      if (!isShapeDragPayload(payload)) return
      const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      nodeCounter += 1
      const id = `${payload.shape}-${Date.now()}-${nodeCounter}`
      addNodes({
        id,
        type: "canvasNode",
        position: { x: center.x - payload.width / 2, y: center.y - payload.height / 2 },
        width: payload.width,
        height: payload.height,
        data: { label: "", shape: payload.shape },
      })
    },
    [screenToFlowPosition, addNodes],
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const raw = e.dataTransfer.getData(DRAG_TYPE)
      if (!raw) return

      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        return
      }
      if (!isShapeDragPayload(parsed)) return
      const payload = parsed
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })

      nodeCounter += 1
      const id = `${payload.shape}-${Date.now()}-${nodeCounter}`

      addNodes({
        id,
        type: "canvasNode",
        position: {
          x: position.x - payload.width / 2,
          y: position.y - payload.height / 2,
        },
        width: payload.width,
        height: payload.height,
        data: { label: "", shape: payload.shape },
      })
    },
    [screenToFlowPosition, addNodes],
  )

  return (
    <div className="relative size-full flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onSelectionChange={onSelectionChange}
        connectOnClick={false}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <MiniMap />
        <Cursors />
      </ReactFlow>
      <ShapePanel onInsert={onInsert} />
      {selectedNodeId && <NodePropertiesPanel nodeId={selectedNodeId} />}
    </div>
  )
}
