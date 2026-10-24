import { createContext, useContext } from "react"

export const CircuitSimulationContext = createContext<Set<string>>(new Set())

export function usePoweredIds(): Set<string> {
  return useContext(CircuitSimulationContext)
}
