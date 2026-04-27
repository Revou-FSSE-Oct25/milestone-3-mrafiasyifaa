import { NextRequest, NextResponse } from "next/server";
import { httpRequestDuration } from "@/src/app/api/metrics/route";

export async function GET(request: NextRequest) {
  const start = Date.now();
  const cookie = request.cookies.get("auth_session");

  if (!cookie) {
    const response = NextResponse.json({ user: null });
    httpRequestDuration.observe(
      { path: "/api/auth/me", method: "GET", status: "200" },
      (Date.now() - start) / 1000
    );
    return response;
  }

  try {
    const user = JSON.parse(cookie.value);
    const response = NextResponse.json({ user });
    httpRequestDuration.observe(
      { path: "/api/auth/me", method: "GET", status: "200" },
      (Date.now() - start) / 1000
    );
    return response;
  } catch {
    const response = NextResponse.json({ user: null });
    httpRequestDuration.observe(
      { path: "/api/auth/me", method: "GET", status: "500" },
      (Date.now() - start) / 1000
    );
    return response;
  }
}
