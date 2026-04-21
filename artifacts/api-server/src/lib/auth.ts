import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db, adminUsersTable, adminSessionsTable } from "@workspace/db";
import { eq, lt } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";

const SESSION_COOKIE = "mds_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export async function ensureAdminUser(): Promise<void> {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin12345";
  const existing = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.username, username))
    .limit(1);
  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(adminUsersTable).values({ username, passwordHash });
  }
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<{ sessionId: string; username: string } | null> {
  const rows = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.username, username))
    .limit(1);
  const user = rows[0];
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  const sessionId = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db
    .insert(adminSessionsTable)
    .values({ id: sessionId, userId: user.id, expiresAt });
  return { sessionId, username: user.username };
}

export async function logoutAdmin(sessionId: string): Promise<void> {
  await db.delete(adminSessionsTable).where(eq(adminSessionsTable.id, sessionId));
}

export async function getAdminFromSession(
  sessionId: string | undefined,
): Promise<{ username: string } | null> {
  if (!sessionId) return null;
  const rows = await db
    .select({
      session: adminSessionsTable,
      user: adminUsersTable,
    })
    .from(adminSessionsTable)
    .innerJoin(adminUsersTable, eq(adminSessionsTable.userId, adminUsersTable.id))
    .where(eq(adminSessionsTable.id, sessionId))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (row.session.expiresAt.getTime() < Date.now()) {
    await db.delete(adminSessionsTable).where(eq(adminSessionsTable.id, sessionId));
    return null;
  }
  return { username: row.user.username };
}

export async function pruneExpiredSessions(): Promise<void> {
  await db.delete(adminSessionsTable).where(lt(adminSessionsTable.expiresAt, new Date()));
}

export function setSessionCookie(res: Response, sessionId: string): void {
  res.cookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

export function getSessionId(req: Request): string | undefined {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
  return cookies?.[SESSION_COOKIE];
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const sessionId = getSessionId(req);
  const admin = await getAdminFromSession(sessionId);
  if (!admin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { admin?: { username: string } }).admin = admin;
  next();
}
