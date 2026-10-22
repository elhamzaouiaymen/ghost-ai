"use client"

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense"
import { ErrorBoundary } from "react-error-boundary"
import { ReactFlowProvider } from "@xyflow/react"
import { CollaborativeCanvas } from "./collaborative-canvas"

interface CanvasWrapperProps {
  roomId: string
}

function CanvasError() {
  return (
    <div className="flex flex-1 items-center justify-center bg-bg-base">
      <span className="text-sm text-copy-muted">Failed to connect to canvas. Please refresh.</span>
    </div>
  )
}

function CanvasLoading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-bg-base">
      <span className="text-sm text-copy-muted">Connecting…</span>
    </div>
  )
}

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
      >
        <ErrorBoundary fallback={<CanvasError />}>
          <ClientSideSuspense fallback={<CanvasLoading />}>
            <ReactFlowProvider>
              <CollaborativeCanvas />
            </ReactFlowProvider>
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
