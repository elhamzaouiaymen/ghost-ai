"use client"

import { useCallback, useState } from "react"
import { ReactFlow, Background, MiniMap, BackgroundVariant, useReactFlow } from "@xyflow/react"
import type { OnSelectionChangeParams } from "@xyflow/react"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"
import type { CanvasNode, CanvasEdge, ShapeDragPayload } from "@/types/canvas"
import { CanvasNodeComponent } from "./canvas-node"
import { ShapePanel, DRAG_TYPE } from "./shape-panel"
import { NodePropertiesPanel } from "./node-properties-panel"

const nodeTypes = { canvasNode: CanvasNodeComponent }
const edgeTypes = {}

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

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const raw = e.dataTransfer.getData(DRAG_TYPE)
      if (!raw) return

      const payload: ShapeDragPayload = JSON.parse(raw)
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
      <ShapePanel />
      {selectedNodeId && <NodePropertiesPanel nodeId={selectedNodeId} />}
    </div>
  )
}
