import { Router, type IRouter } from "express";
import { db, childrenTable, storiesTable, reportsTable, donationClicksTable, volunteersTable, materialHelpTable, helpRequestsTable, contactsTable, visitsTable } from "@workspace/db";
import { desc, eq, gte, lt } from "drizzle-orm";
import {
  GetPublicSettingsResponse,
  ListChildrenResponse,
  GetChildResponse,
  ListStoriesResponse,
  ListReportsResponse,
  ListArchiveReportsResponse,
  TrackDonationClickBody,
  SubmitVolunteerBody,
  SubmitMaterialHelpBody,
  SubmitHelpRequestBody,
  SubmitContactBody,
} from "@workspace/api-zod";
import { getSettings } from "../lib/settings";

const router: IRouter = Router();

router.get("/settings", async (_req, res) => {
  const data = await getSettings();
  res.json(GetPublicSettingsResponse.parse(data));
});

router.get("/children", async (_req, res) => {
  const rows = await db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.isActive, true))
    .orderBy(desc(childrenTable.isUrgent), desc(childrenTable.id));
  res.json(ListChildrenResponse.parse(rows));
});

router.get("/children/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const rows = await db.select().from(childrenTable).where(eq(childrenTable.id, id)).limit(1);
  if (rows.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(GetChildResponse.parse(rows[0]));
});

router.get("/stories", async (_req, res) => {
  const rows = await db.select().from(storiesTable).orderBy(desc(storiesTable.id));
  res.json(ListStoriesResponse.parse(rows));
});

const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;

router.get("/reports", async (_req, res) => {
  const cutoff = new Date(Date.now() - SEVEN_DAYS_MS);
  const rows = await db
    .select()
    .from(reportsTable)
    .where(gte(reportsTable.createdAt, cutoff))
    .orderBy(desc(reportsTable.createdAt));
  res.json(ListReportsResponse.parse(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.get("/reports/archive", async (_req, res) => {
  const cutoff = new Date(Date.now() - SEVEN_DAYS_MS);
  const rows = await db
    .select()
    .from(reportsTable)
    .where(lt(reportsTable.createdAt, cutoff))
    .orderBy(desc(reportsTable.createdAt));
  res.json(ListArchiveReportsResponse.parse(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.post("/visits", async (req, res) => {
  const path = typeof req.body?.path === "string" ? req.body.path : "/";
  await db.insert(visitsTable).values({
    path,
    ipAddress: req.ip ?? null,
    userAgent: req.headers["user-agent"] ?? null,
  });
  res.json({ ok: true });
});

router.post("/donation-clicks", async (req, res) => {
  const body = TrackDonationClickBody.parse(req.body);
  await db.insert(donationClicksTable).values({
    childId: body.childId,
    amount: body.amount ?? null,
    ipAddress: req.ip ?? null,
  });
  res.json({ ok: true });
});

router.post("/volunteers", async (req, res) => {
  const body = SubmitVolunteerBody.parse(req.body);
  const inserted = await db.insert(volunteersTable).values(body).returning({ id: volunteersTable.id });
  res.json({ ok: true, id: inserted[0]?.id ?? null });
});

router.post("/materials", async (req, res) => {
  const body = SubmitMaterialHelpBody.parse(req.body);
  const inserted = await db.insert(materialHelpTable).values(body).returning({ id: materialHelpTable.id });
  res.json({ ok: true, id: inserted[0]?.id ?? null });
});

router.post("/help-requests", async (req, res) => {
  const body = SubmitHelpRequestBody.parse(req.body);
  const inserted = await db
    .insert(helpRequestsTable)
    .values({
      childName: body.childName,
      age: body.age,
      diagnosis: body.diagnosis,
      targetSum: body.targetSum,
      parentContacts: body.parentContacts,
      photoUrl: body.photoUrl ?? null,
    })
    .returning({ id: helpRequestsTable.id });
  res.json({ ok: true, id: inserted[0]?.id ?? null });
});

router.post("/contacts", async (req, res) => {
  const body = SubmitContactBody.parse(req.body);
  const inserted = await db.insert(contactsTable).values(body).returning({ id: contactsTable.id });
  res.json({ ok: true, id: inserted[0]?.id ?? null });
});

export default router;
