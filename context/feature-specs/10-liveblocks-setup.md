Set up the realtime collbaoration infrastructure using Liveblocks. 

## Configuration

Configure the `liveblocks.config.ts` at the project root.

Define:

## Presence:

- cursor position
- `isThinking` boolean

## UserMeta

- user ID
- display name
- avatar URL
- cursor color


## Liveblocks Client

Create a cached Liveblocks node client in `lib`

Add a helper that deterninistically maps a user ID to a consistent color from a fixed palette.

## Auth Route

Create `POST /api/liveblocks-auth`

Use the project ID as the Liveblocks room ID.

This route must:
1. require Clerk authentication
2. verify project access using the existing access layer
3. ensure the Liveblocks room exists (create only if needed)
4. return a session token with:
  - user name
  - avatar
  - generated custor color

  Return `403` for unauthorized project access.


## Dependencies

Already installed:
- @liveblocks/client 
- @liveblocks/react 
- @liveblocks/react-ui 
- @liveblocks/react-flow 
- @xyflow/react

## Check When Done
- All requirements are met.
