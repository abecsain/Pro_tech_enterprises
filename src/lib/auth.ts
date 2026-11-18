import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.SUPABASE_JWT_SECRET ||
  "pte_super_secret_jwt_key_2026_enterprise_secure";
const ADMIN_COOKIE_NAME = "pte_admin_session";
const BUYER_COOKIE_NAME = "pte_buyer_session";

export interface AdminSession {
  userId: string;
  email: string;
  fullName: string;
  role: "super_admin" | "manager";
  permissions: string[];
}

export interface BuyerSession {
  recipientId: string;
  loginId: string;
  token: string;
  name: string;
  companyName?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSecureToken(bytes = 24): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export function signAdminToken(payload: AdminSession, expiresIn = "12h"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyAdminToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminSession;
  } catch {
    return null;
  }
}

export function signBuyerToken(payload: BuyerSession, expiresIn = "24h"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyBuyerToken(token: string): BuyerSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as BuyerSession;
  } catch {
    return null;
  }
}

export { ADMIN_COOKIE_NAME, BUYER_COOKIE_NAME };
