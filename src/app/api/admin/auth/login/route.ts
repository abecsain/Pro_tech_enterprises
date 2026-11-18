import { NextRequest, NextResponse } from "next/server";
import { comparePassword, signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check credentials against super_admin or manager
    let userRole: "super_admin" | "manager" = "super_admin";
    let fullName = "Super Admin (Pro Tech)";
    let userId = "admin_super";
    let valid = false;

    if (cleanEmail === "admin@protechenterprises.com" && (password === "admin123" || password === "admin@123")) {
      valid = true;
      userRole = "super_admin";
      fullName = "Super Admin (Pro Tech)";
      userId = "admin_super";
    } else if (cleanEmail === "manager@protechenterprises.com" && (password === "manager123" || password === "manager@123")) {
      valid = true;
      userRole = "manager";
      fullName = "Production Manager";
      userId = "admin_manager";
    } else {
      // Check in memory store
      const settings = db.getSettings();
      if (cleanEmail === settings.company_email.toLowerCase() && password === "admin123") {
        valid = true;
      }
    }

    if (!valid) {
      return NextResponse.json({ error: "Invalid admin email or password" }, { status: 401 });
    }

    const permissions =
      userRole === "super_admin"
        ? [
            "dashboard.view",
            "products.manage",
            "categories.manage",
            "inventory.manage",
            "share_links.manage",
            "pricing.manage",
            "bookings.manage",
            "reports.view",
            "settings.manage",
          ]
        : ["dashboard.view", "products.manage", "categories.manage", "inventory.manage", "bookings.manage", "reports.view"];

    const token = signAdminToken({
      userId,
      email: cleanEmail,
      fullName,
      role: userRole,
      permissions,
    });

    db.logActivity(fullName, userRole, "Admin Logged In", "auth", { email: cleanEmail });

    const response = NextResponse.json({
      success: true,
      user: {
        userId,
        email: cleanEmail,
        fullName,
        role: userRole,
        permissions,
      },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 });
  }
}
