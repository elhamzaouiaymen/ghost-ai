Replace the canvas placeholder with a Liveblocks-backend React Flow canvas.

## Implementation

1. Keep the workswpace page server-side
2. Create a client-side editor/canvas wrapper that sets up the Liveblocks room.

It should include:
- `LiveblocksProvider` using `/api/liveblocks-auth`
- `RoomProvider` using the current room ID
- initial presence with `cursor: null`
- `ClientSidebarSuspense` with a simple loading state
- an error fallback for Liveblocks connection issues

3. Wire React Flow to Liveblocks state.
  - use `useLiveblocksFlow`
  - enable suspense
  - start with empty nodes and edges
  - pass the synced node, edges, and change handlers into `ReactFlow`
   
 4. Add shared canvas types in `types/canvas.ts`

Node data should support:
- label
- color
- shape

Also define the custom node and edge types:
- `canvasNode`
- `canvasEdge`

5. Render the basic canvas

Include:
- Loose connection behaviour
- `fitView`
- `MiniMap`
- dot-pattern background


## Scope limits
- don't add controls yet
- don't add custom node or edge rendering yet
- don't add persistence logic
- don't add AI behaviour
- keep this focused on the collaborative canvas foundation

## Check when done
- Client canvas wrapper sets up the liveblocks room.
- React Flow uses liveblocks-synnced nodes and edges.
- share canvas types exist in the `types/canvas.ts`
- `yarn build` passes
