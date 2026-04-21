import { Router, type IRouter } from "express";
import { db, childrenTable, storiesTable, reportsTable, volunteersTable, materialHelpTable, helpRequestsTable, contactsTable, donationClicksTable } from "@workspace/db";
import { desc, eq, gte, sql } from "drizzle-orm";
import {
  AdminLoginBody,
  AdminCreateChildBody,
  AdminUpdateChildBody,
  AdminCreateStoryBody,
  AdminUpdateStoryBody,
  AdminCreateReportBody,
  AdminUpdateSettingsBody,
} from "@workspace/api-zod";
import {
  loginAdmin,
  logoutAdmin,
  setSessionCookie,
  clearSessionCookie,
  getSessionId,
  requireAdmin,
} from "../lib/auth";
import { getSettings, updateSettings } from "../lib/settings";

const router: IRouter = Router();

router.post("/login", async (req, res) => {
  const body = AdminLoginBody.parse(req.body);
  const result = await loginAdmin(body.username, body.password);
  if (!result) {
    res.status(401).json({ error: "Неверный логин или пароль" });
    return;
  }
  setSessionCookie(res, result.sessionId);
  res.json({ username: result.username });
});

router.post("/logout", async (req, res) => {
  const sid = getSessionId(req);
  if (sid) await logoutAdmin(sid);
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get("/me", requireAdmin, (req, res) => {
  const admin = (req as typeof req & { admin: { username: string } }).admin;
  res.json({ username: admin.username });
});

router.use(requireAdmin);

router.get("/children", async (_req, res) => {
  const rows = await db.select().from(childrenTable).orderBy(desc(childrenTable.id));
  res.json(rows);
});

router.post("/children", async (req, res) => {
  const body = AdminCreateChildBody.parse(req.body);
  const inserted = await db.insert(childrenTable).values({
    ...body,
    isActive: body.isActive ?? true,
    isUrgent: body.isUrgent ?? true,
  }).returning();
  res.json(inserted[0]);
});

router.put("/children/:id", async (req, res) => {
  const id = Number(req.params.id);
  const body = AdminUpdateChildBody.parse(req.body);
  const updated = await db
    .update(childrenTable)
    .set({
      ...body,
      isActive: body.isActive ?? true,
      isUrgent: body.isUrgent ?? false,
    })
    .where(eq(childrenTable.id, id))
    .returning();
  if (updated.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated[0]);
});

router.delete("/children/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(childrenTable).where(eq(childrenTable.id, id));
  res.json({ ok: true });
});

router.get("/stories", async (_req, res) => {
  const rows = await db.select().from(storiesTable).orderBy(desc(storiesTable.id));
  res.json(rows);
});

router.post("/stories", async (req, res) => {
  const body = AdminCreateStoryBody.parse(req.body);
  const inserted = await db.insert(storiesTable).values(body).returning();
  res.json(inserted[0]);
});

router.put("/stories/:id", async (req, res) => {
  const id = Number(req.params.id);
  const body = AdminUpdateStoryBody.parse(req.body);
  const updated = await db.update(storiesTable).set(body).where(eq(storiesTable.id, id)).returning();
  if (updated.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated[0]);
});

router.delete("/stories/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(storiesTable).where(eq(storiesTable.id, id));
  res.json({ ok: true });
});

router.get("/reports", async (_req, res) => {
  const rows = await db.select().from(reportsTable).orderBy(desc(reportsTable.createdAt));
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/reports", async (req, res) => {
  const body = AdminCreateReportBody.parse(req.body);
  const inserted = await db.insert(reportsTable).values(body).returning();
  const r = inserted[0];
  res.json({ ...r, createdAt: r.createdAt.toISOString() });
});

router.delete("/reports/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(reportsTable).where(eq(reportsTable.id, id));
  res.json({ ok: true });
});

router.get("/submissions", async (_req, res) => {
  const [volunteers, materials, helpRequests, contacts] = await Promise.all([
    db.select().from(volunteersTable).orderBy(desc(volunteersTable.id)),
    db.select().from(materialHelpTable).orderBy(desc(materialHelpTable.id)),
    db.select().from(helpRequestsTable).orderBy(desc(helpRequestsTable.id)),
    db.select().from(contactsTable).orderBy(desc(contactsTable.id)),
  ]);
  res.json({
    volunteers: volunteers.map((v) => ({ ...v, createdAt: v.createdAt.toISOString() })),
    materials: materials.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })),
    helpRequests: helpRequests.map((h) => ({ ...h, createdAt: h.createdAt.toISOString() })),
    contacts: contacts.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })),
  });
});

router.get("/donation-stats", async (_req, res) => {
  const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;
  const cutoff = new Date(Date.now() - SEVEN_DAYS_MS);
  const grouped = await db
    .select({
      childId: donationClicksTable.childId,
      count: sql<number>`count(*)::int`,
    })
    .from(donationClicksTable)
    .where(gte(donationClicksTable.createdAt, cutoff))
    .groupBy(donationClicksTable.childId);

  const childIds = grouped.map((g) => g.childId);
  const childMap = new Map<number, string>();
  if (childIds.length > 0) {
    const kids = await db.select().from(childrenTable);
    for (const k of kids) childMap.set(k.id, `${k.name} ${k.surname}`);
  }
  const perChild = grouped.map((g) => ({
    childId: g.childId,
    childName: childMap.get(g.childId) ?? `Ребёнок #${g.childId}`,
    count: g.count,
  }));
  const totalWeek = perChild.reduce((sum, x) => sum + x.count, 0);
  res.json({ totalWeek, perChild });
});

router.get("/settings", async (_req, res) => {
  const data = await getSettings();
  res.json(data);
});

router.put("/settings", async (req, res) => {
  const body = AdminUpdateSettingsBody.parse(req.body);
  const updated = await updateSettings(body as Parameters<typeof updateSettings>[0]);
  res.json(updated);
});

export default router;
