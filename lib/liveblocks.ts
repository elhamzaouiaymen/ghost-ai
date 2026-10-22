import { Liveblocks } from "@liveblocks/node";

const CURSOR_COLORS = [
  "#E63946",
  "#F4A261",
  "#2A9D8F",
  "#457B9D",
  "#9B5DE5",
  "#F15BB5",
  "#00BBF9",
  "#00F5D4",
  "#FEE440",
  "#FB5607",
];

export function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash * 31) + userId.charCodeAt(i)) >>> 0;
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}

declare global {
  // eslint-disable-next-line no-var
  var liveblocks: Liveblocks | undefined;
}

export function getLiveblocks(): Liveblocks {
  if (globalThis.liveblocks) return globalThis.liveblocks;
  const client = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY! });
  if (process.env.NODE_ENV === "development") {
    globalThis.liveblocks = client;
  }
  return client;
}
