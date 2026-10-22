import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getLiveblocks, getUserColor } from "@/lib/liveblocks";
import { getProjectWithAccess } from "@/lib/project-access";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const room =
    typeof body === "object" && body !== null && typeof (body as Record<string, unknown>).room === "string"
      ? ((body as Record<string, unknown>).room as string).trim()
      : "";

  if (!room) {
    return NextResponse.json({ error: "room is required" }, { status: 400 });
  }

  const project = await getProjectWithAccess(room);
  if (!project) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const liveblocks = getLiveblocks();
  await liveblocks.getOrCreateRoom(room, { defaultAccesses: [] });

  const name =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.emailAddresses[0]?.emailAddress ||
    "Unknown";
  const avatar = user.imageUrl;
  const cursorColor = getUserColor(user.id);

  const session = liveblocks.prepareSession(user.id, {
    userInfo: { name, avatar, cursorColor },
  });
  session.allow(room, session.FULL_ACCESS);

  const { status, body: sessionBody } = await session.authorize();
  return new Response(sessionBody, { status });
}
