"use client"

import { useCallback, useState } from "react"
import { ReactFlow, Background, MiniMap, BackgroundVariant, useReactFlow } from "@xyflow/react"
import type { OnSelectionChangeParams } from "@xyflow/react"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"
import type { CircuitNode, CircuitEdge, ElectricComponentType, ComponentDragPayload, SwitchData } from "@/types/canvas"
import { BatteryNodeComponent }  from "./circuit-nodes/battery-node"
import { SwitchNodeComponent }   from "./circuit-nodes/switch-node"
import { LedNodeComponent }      from "./circuit-nodes/led-node"
import { ResistorNodeComponent } from "./circuit-nodes/resistor-node"
import { CircuitSimulationContext } from "./circuit-nodes/simulation-context"
import { WireEdge } from "./circuit-nodes/wire-edge"
import { useCircuitSimulation } from "@/hooks/use-circuit-simulation"
import { ShapePanel, DRAG_TYPE } from "./shape-panel"
import { NodePropertiesPanel } from "./node-properties-panel"

const nodeTypes = {
  batteryNode:  BatteryNodeComponent,
  switchNode:   SwitchNodeComponent,
  ledNode:      LedNodeComponent,
  resistorNode: ResistorNodeComponent,
}
const edgeTypes = { wireEdge: WireEdge }

const VALID_COMPONENT_TYPES = new Set<ElectricComponentType>([
  "battery", "switch", "led", "resistor",
])

function isComponentDragPayload(value: unknown): value is ComponentDragPayload {
  if (typeof value !== "object" || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.componentType === "string" &&
    VALID_COMPONENT_TYPES.has(v.componentType as ElectricComponentType) &&
    typeof v.width === "number" &&
    Number.isFinite(v.width) &&
    typeof v.height === "number" &&
    Number.isFinite(v.height)
  )
}

function buildInitialData(componentType: ElectricComponentType): CircuitNode["data"] {
  switch (componentType) {
    case "battery":  return { label: "" }
    case "switch":   return { label: "", closed: false } satisfies SwitchData
    case "led":      return { label: "", color: "red" }
    case "resistor": return { label: "", resistance: 100 }
  }
}

let nodeCounter = 0

export function CollaborativeCanvas() {
  const { screenToFlowPosition, addNodes } = useReactFlow()
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const onSelectionChange = useCallback(({ nodes }: OnSelectionChangeParams) => {
    setSelectedNodeId(nodes.length === 1 ? nodes[0].id : null)
  }, [])

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CircuitNode, CircuitEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  const poweredIds = useCircuitSimulation(nodes, edges)

  const onInsert = useCallback(
    (payload: ComponentDragPayload) => {
      if (!isComponentDragPayload(payload)) return
      const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      nodeCounter += 1
      const id = `${payload.componentType}-${Date.now()}-${nodeCounter}`
      addNodes({
        id,
        type: `${payload.componentType}Node`,
        position: { x: center.x - payload.width / 2, y: center.y - payload.height / 2 },
        width: payload.width,
        height: payload.height,
        data: buildInitialData(payload.componentType),
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
      if (!isComponentDragPayload(parsed)) return

      const payload = parsed
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })

      nodeCounter += 1
      const id = `${payload.componentType}-${Date.now()}-${nodeCounter}`

      addNodes({
        id,
        type: `${payload.componentType}Node`,
        position: {
          x: position.x - payload.width / 2,
          y: position.y - payload.height / 2,
        },
        width: payload.width,
        height: payload.height,
        data: buildInitialData(payload.componentType),
      })
    },
    [screenToFlowPosition, addNodes],
  )

  return (
    <div className="relative size-full flex-1">
      <CircuitSimulationContext.Provider value={poweredIds}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDelete={onDelete}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: "wireEdge" }}
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
      </CircuitSimulationContext.Provider>
      <ShapePanel onInsert={onInsert} />
      {selectedNodeId && <NodePropertiesPanel nodeId={selectedNodeId} />}
    </div>
  )
}
