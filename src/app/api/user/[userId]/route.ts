import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const userId = params.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clerkClient();
    const uploaderInfo = await client.users.getUser(userId);

    return NextResponse.json({
      fullName: uploaderInfo.fullName,
      username: uploaderInfo.username,
      EmailAddress: uploaderInfo.emailAddresses[0]?.emailAddress || "",
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user information",
      },
      { status: 500 },
    );
  }
}
