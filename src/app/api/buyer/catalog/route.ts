import { NextRequest, NextResponse } from "next/server";
import { verifyBuyerToken, BUYER_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  // Verify buyer session
  const cookieVal = req.cookies.get(BUYER_COOKIE_NAME)?.value;
  const buyerSession = cookieVal ? verifyBuyerToken(cookieVal) : null;

  if (!buyerSession || buyerSession.token !== token) {
    return NextResponse.json({ error: "Unauthorized session for this portal" }, { status: 401 });
  }

  const catalog = db.getBuyerCatalog(token);

  if (!catalog) {
    return NextResponse.json(
      { error: "Access Revoked or Invalid Link. Please contact Pro Tech Enterprises." },
      { status: 403 }
    );
  }

  return NextResponse.json(catalog);
}
