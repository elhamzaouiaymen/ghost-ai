import { useMemo } from "react"
import type { CircuitNode, CircuitEdge, SwitchData } from "@/types/canvas"

/**
 * Circuit simulation using a terminal-level graph.
 *
 * Each component has two vertices: `${id}:left` and `${id}:right`.
 * Internal edges connect those two vertices for components that
 * conduct (LED, Resistor, closed Switch). Battery has NO internal
 * edge — it is the source, not a conductor.
 *
 * Wire edges (from React Flow) connect one component's terminal to
 * another's. A circuit is complete when battery:left and battery:right
 * end up in the same connected component via external wires + internals.
 * Only then are LEDs in that component powered.
 */
export function useCircuitSimulation(
  nodes: CircuitNode[],
  edges: CircuitEdge[],
): Set<string> {
  return useMemo(() => {
    const adj = new Map<string, Set<string>>()

    const addVertex = (v: string) => {
      if (!adj.has(v)) adj.set(v, new Set())
    }
    const addEdge = (a: string, b: string) => {
      addVertex(a)
      addVertex(b)
      adj.get(a)!.add(b)
      adj.get(b)!.add(a)
    }

    // Create terminal vertices for every node
    for (const node of nodes) {
      addVertex(`${node.id}:left`)
      addVertex(`${node.id}:right`)
    }

    // Internal component edges (current flows left↔right through the component)
    for (const node of nodes) {
      switch (node.type) {
        case "batteryNode":
          // No internal edge — battery is the EMF source, not a conductor
          break
        case "switchNode":
          // Only conducts when closed
          if ((node.data as SwitchData).closed) {
            addEdge(`${node.id}:left`, `${node.id}:right`)
          }
          break
        case "ledNode":
        case "resistorNode":
          addEdge(`${node.id}:left`, `${node.id}:right`)
          break
      }
    }

    // Wire edges — connect the specific handle (terminal) of each node
    for (const edge of edges) {
      const srcHandle = edge.sourceHandle ?? "right"
      const tgtHandle = edge.targetHandle ?? "left"
      addEdge(`${edge.source}:${srcHandle}`, `${edge.target}:${tgtHandle}`)
    }

    // BFS to label connected components
    const componentOf = new Map<string, number>()
    let compId = 0
    for (const v of adj.keys()) {
      if (componentOf.has(v)) continue
      const queue: string[] = [v]
      while (queue.length > 0) {
        const cur = queue.shift()!
        if (componentOf.has(cur)) continue
        componentOf.set(cur, compId)
        adj.get(cur)?.forEach((n) => {
          if (!componentOf.has(n)) queue.push(n)
        })
      }
      compId++
    }

    // An LED is powered when:
    //   1. Some battery has both its terminals in the same component (complete loop)
    //   2. The LED's terminals are also in that component
    const poweredIds = new Set<string>()
    const batteries = nodes.filter((n) => n.type === "batteryNode")
    const leds      = nodes.filter((n) => n.type === "ledNode")

    for (const battery of batteries) {
      const leftComp  = componentOf.get(`${battery.id}:left`)
      const rightComp = componentOf.get(`${battery.id}:right`)
      if (leftComp === undefined || rightComp === undefined) continue
      if (leftComp !== rightComp) continue // incomplete circuit

      // Complete circuit found — power every LED whose terminals are in it
      for (const led of leds) {
        if (componentOf.get(`${led.id}:left`) === leftComp) {
          poweredIds.add(led.id)
        }
      }
    }

    return poweredIds
  }, [nodes, edges])
}
