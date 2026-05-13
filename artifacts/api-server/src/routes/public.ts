import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  bannersTable,
  childrenTable,
  contactsTable,
  donationClicksTable,
  galleryItemsTable,
  galleryPhotosTable,
  helpRequestsTable,
  materialHelpTable,
  reportsTable,
  storiesTable,
  visitsTable,
  volunteersTable,
} from "@workspace/db/schema";
import { sendMail } from "../lib/mailer";
import { and, desc, eq, gte, lt } from "drizzle-orm";
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

router.get("/gallery-items", async (_req, res) => {
  const [items, children, photos] = await Promise.all([
    db.select().from(galleryItemsTable).orderBy(desc(galleryItemsTable.createdAt), desc(galleryItemsTable.id)),
    db.select().from(childrenTable),
    db.select().from(galleryPhotosTable).orderBy(galleryPhotosTable.sortOrder, galleryPhotosTable.id),
  ]);

  const childMap = new Map(children.map((child) => [child.id, `${child.name} ${child.surname}`]));
  const photoMap = new Map<number, string[]>();

  for (const photo of photos) {
    const list = photoMap.get(photo.galleryItemId) ?? [];
    list.push(photo.photoUrl);
    photoMap.set(photo.galleryItemId, list);
  }

  res.json(
    items.map((item) => ({
      ...item,
      photos: photoMap.get(item.id)?.length ? photoMap.get(item.id) : [item.photoUrl],
      childName: item.childId ? childMap.get(item.childId) ?? null : null,
      createdAt: item.createdAt.toISOString(),
    })),
  );
});

router.get("/banners", async (_req, res) => {
  const rows = await db
    .select()
    .from(bannersTable)
    .where(and(eq(bannersTable.isEnabled, true), eq(bannersTable.isArchived, false)))
    .orderBy(desc(bannersTable.createdAt), desc(bannersTable.id));

  res.json(rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })));
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
  if (!body.consentAccepted) {
    res.status(400).json({ error: "Необходимо согласие на обработку персональных данных" });
    return;
  }

  const inserted = await db
    .insert(volunteersTable)
    .values({
      name: body.name,
      phone: body.phone,
      email: body.email,
      city: body.city,
      helpType: body.helpType,
      consentAccepted: true,
      consentAcceptedAt: new Date(),
    })
    .returning({ id: volunteersTable.id });
  res.json({ ok: true, id: inserted[0]?.id ?? null });
});

router.post("/materials", async (req, res) => {
  const body = SubmitMaterialHelpBody.parse(req.body);
  if (!body.consentAccepted) {
    res.status(400).json({ error: "Необходимо согласие на обработку персональных данных" });
    return;
  }

  const inserted = await db
    .insert(materialHelpTable)
    .values({
      name: body.name,
      phone: body.phone,
      items: body.items,
      preferredDate: body.preferredDate,
      consentAccepted: true,
      consentAcceptedAt: new Date(),
    })
    .returning({ id: materialHelpTable.id });
  res.json({ ok: true, id: inserted[0]?.id ?? null });
});

router.post("/help-requests", async (req, res) => {
  const body = SubmitHelpRequestBody.parse(req.body);
  if (!body.consentAccepted) {
    res.status(400).json({ error: "Необходимо согласие на обработку персональных данных" });
    return;
  }

  const inserted = await db
    .insert(helpRequestsTable)
    .values({
      childName: body.childName,
      age: body.age,
      diagnosis: body.diagnosis,
      targetSum: body.targetSum,
      parentContacts: body.parentContacts,
      photoUrl: body.photoUrl ?? null,
      consentAccepted: true,
      consentAcceptedAt: new Date(),
    })
    .returning({ id: helpRequestsTable.id });

  void (async () => {
    try {
      const settings = await getSettings();
      const to = settings.adminEmail || settings.email;
      if (!to) return;
      const text =
        `Новая заявка с сайта «${settings.orgName}»\n\n` +
        `Ребёнок: ${body.childName}\n` +
        `Возраст: ${body.age} лет\n` +
        `Диагноз: ${body.diagnosis}\n` +
        `Необходимая сумма: ${body.targetSum} ₽\n\n` +
        `Контакты родителей:\n${body.parentContacts}\n`;
      await sendMail({
        to,
        subject: `Новая заявка о помощи — ${body.childName}`,
        text,
      });
    } catch {
      /* email failures are logged inside sendMail */
    }
  })();

  res.json({ ok: true, id: inserted[0]?.id ?? null });
});

router.post("/contacts", async (req, res) => {
  const body = SubmitContactBody.parse(req.body);
  if (!body.consentAccepted) {
    res.status(400).json({ error: "Необходимо согласие на обработку персональных данных" });
    return;
  }

  const inserted = await db
    .insert(contactsTable)
    .values({
      name: body.name,
      email: body.email,
      message: body.message,
      consentAccepted: true,
      consentAcceptedAt: new Date(),
    })
    .returning({ id: contactsTable.id });
  res.json({ ok: true, id: inserted[0]?.id ?? null });
});

export default router;
