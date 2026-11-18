import { NextResponse } from "next/server";
import { BUYER_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(BUYER_COOKIE_NAME);
  return response;
}
