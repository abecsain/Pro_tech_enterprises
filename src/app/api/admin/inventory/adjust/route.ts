import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import { StockMovementType } from "@/types";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = token ? verifyAdminToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, variantId, quantityChange, movementType, note } = await req.json();

    if (!productId || quantityChange === undefined || quantityChange === 0) {
      return NextResponse.json({ error: "Product ID and a non-zero quantity change are required" }, { status: 400 });
    }

    const type: StockMovementType = movementType || (quantityChange > 0 ? "manual_addition" : "manual_reduction");

    const result = db.adjustStock({
      productId,
      variantId,
      quantityChange: Number(quantityChange),
      movementType: type,
      adminUserName: session.fullName,
      adminUserId: session.userId,
      note,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      newStock: result.newStock,
      message: `Stock successfully updated to ${result.newStock}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to adjust stock" }, { status: 500 });
  }
}
