// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax" as "lax" | "strict" | "none" | undefined,
    maxAge: 0, // Expire immediately
  };

  cookieStore.set("access-token", "", cookieOptions);
  cookieStore.set("refresh-token", "", cookieOptions);
  cookieStore.set("user", "", cookieOptions);

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
}
