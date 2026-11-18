import { NextRequest, NextResponse } from "next/server";
import { verifyBuyerToken, BUYER_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token, items } = await req.json();

    if (!token || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Token and at least one item are required" }, { status: 400 });
    }

    const cookieVal = req.cookies.get(BUYER_COOKIE_NAME)?.value;
    const buyerSession = cookieVal ? verifyBuyerToken(cookieVal) : null;

    if (!buyerSession || buyerSession.token !== token) {
      return NextResponse.json({ error: "Unauthorized session for this portal" }, { status: 401 });
    }

    const result = db.createBooking({ token, items });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process bulk booking" }, { status: 500 });
  }
}
