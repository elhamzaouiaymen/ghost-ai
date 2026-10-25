import type { Node, Edge } from "@xyflow/react"

export type ElectricComponentType = "battery" | "switch" | "led" | "resistor"

export interface BatteryData extends Record<string, unknown> {
  label?: string
}

export interface SwitchData extends Record<string, unknown> {
  label?: string
  closed: boolean
}

export interface LedData extends Record<string, unknown> {
  label?: string
  color?: string
}

export interface ResistorData extends Record<string, unknown> {
  label?: string
  resistance?: number
}

export type BatteryNode  = Node<BatteryData,  "batteryNode">
export type SwitchNode   = Node<SwitchData,   "switchNode">
export type LedNode      = Node<LedData,      "ledNode">
export type ResistorNode = Node<ResistorData, "resistorNode">

export type CircuitNode = BatteryNode | SwitchNode | LedNode | ResistorNode
export type CircuitEdge = Edge<Record<string, unknown>, "wireEdge">

export interface ComponentDragPayload {
  componentType: ElectricComponentType
  width: number
  height: number
}
