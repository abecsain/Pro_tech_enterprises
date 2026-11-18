import { NextRequest, NextResponse } from "next/server";
import { signBuyerToken, BUYER_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token, loginId, password } = await req.json();

    if (!token || !loginId || !password) {
      return NextResponse.json({ error: "Token, Login ID, and Password are required" }, { status: 400 });
    }

    const authResult = db.authenticateBuyer(token, loginId, password);

    if (!authResult.success || !authResult.recipient || !authResult.shareLink) {
      return NextResponse.json({ error: authResult.error || "Authentication failed" }, { status: 401 });
    }

    const sessionPayload = {
      recipientId: authResult.recipient.id,
      loginId: loginId.trim(),
      token,
      name: authResult.recipient.name,
      companyName: authResult.recipient.company_name,
    };

    const jwtToken = signBuyerToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      recipient: {
        id: authResult.recipient.id,
        name: authResult.recipient.name,
        companyName: authResult.recipient.company_name,
        portalDisplayName: authResult.recipient.portal_display_name,
      },
    });

    response.cookies.set(BUYER_COOKIE_NAME, jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
  }
}
