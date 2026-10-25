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

    // BFS reachability from `start`, optionally excluding one specific edge.
    function reach(start: string, excludeA?: string, excludeB?: string): Set<string> {
      const visited = new Set<string>()
      const queue: string[] = [start]
      while (queue.length > 0) {
        const cur = queue.shift()!
        if (visited.has(cur)) continue
        visited.add(cur)
        adj.get(cur)?.forEach((nb) => {
          if (
            (cur === excludeA && nb === excludeB) ||
            (cur === excludeB && nb === excludeA)
          )
            return
          if (!visited.has(nb)) queue.push(nb)
        })
      }
      return visited
    }

    // An LED is powered when there is a path that goes through its internal edge
    // as part of a complete battery loop.
    //
    // Specifically: excluding the LED's own internal edge, battery:right must reach
    // led:left AND battery:left must reach led:right (or the symmetric pair).
    // This prevents a dangling-terminal LED from lighting up just because it is
    // attached to a node that already belongs to a complete loop.
    const poweredIds = new Set<string>()
    const batteries = nodes.filter((n) => n.type === "batteryNode")
    const leds      = nodes.filter((n) => n.type === "ledNode")

    for (const led of leds) {
      const ledL = `${led.id}:left`
      const ledR = `${led.id}:right`

      for (const battery of batteries) {
        const batL = `${battery.id}:left`
        const batR = `${battery.id}:right`

        // Reachability sets computed without the LED's internal edge
        const fromBatR = reach(batR, ledL, ledR)
        const fromBatL = reach(batL, ledL, ledR)

        if (
          (fromBatR.has(ledL) && fromBatL.has(ledR)) ||
          (fromBatR.has(ledR) && fromBatL.has(ledL))
        ) {
          poweredIds.add(led.id)
          break
        }
      }
    }

    return poweredIds
  }, [nodes, edges])
}
