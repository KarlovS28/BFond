import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export type Settings = {
  orgName: string;
  slogan: string;
  mission: string;
  legalAddress: string;
  email: string;
  phone: string;
  adminEmail: string;
  donationLink: string;
  requisites: string;
  logoUrl: string;
  logoSize: number;
  paymentQrUrl: string;
  socials: {
    telegram: string;
    vk: string;
    whatsapp: string;
    max: string;
    instagram: string;
  };
  documents: { title: string; url: string }[];
};

export const DEFAULT_SETTINGS: Settings = {
  orgName: "Мечты добрых сердец",
  slogan: "Помогаем детям, которые верят в чудо",
  mission:
    "Мы — благотворительный фонд, который помогает детям с тяжёлыми диагнозами получить лечение, реабилитацию и поддержку. Каждое доброе сердце приближает чудо.",
  legalAddress: "Краснодар, ул. Дунаевского 1, оф. 7",
  email: "mectydobryhserdec@gmail.com",
  phone: "+7 (XXX) XXX-XX-XX",
  adminEmail: "mectydobryhserdec@gmail.com",
  donationLink: "https://www.tinkoff.ru/cf/charity",
  requisites:
    "Получатель: БФ «Мечты добрых сердец»\nИНН: 0000000000\nКПП: 000000000\nР/с: 00000000000000000000\nБанк: ПАО Сбербанк\nК/с: 00000000000000000000\nБИК: 000000000\nНазначение платежа: Благотворительное пожертвование",
  logoUrl: "",
  logoSize: 56,
  paymentQrUrl: "",
  socials: {
    telegram: "https://t.me/",
    vk: "https://vk.com/",
    whatsapp: "https://wa.me/",
    max: "https://max.ru/",
    instagram: "https://instagram.com/",
  },
  documents: [
    { title: "ОГРН", url: "" },
    { title: "Устав", url: "" },
    { title: "Свидетельство", url: "" },
  ],
};

export async function getSettings(): Promise<Settings> {
  const rows = await db.select().from(settingsTable).where(eq(settingsTable.id, 1)).limit(1);
  if (rows.length === 0) {
    await db.insert(settingsTable).values({ id: 1, data: DEFAULT_SETTINGS });
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...(rows[0].data as Partial<Settings>) } as Settings;
}

export async function updateSettings(input: Settings): Promise<Settings> {
  const merged = { ...DEFAULT_SETTINGS, ...input };
  const existing = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.id, 1))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(settingsTable).values({ id: 1, data: merged });
  } else {
    await db
      .update(settingsTable)
      .set({ data: merged, updatedAt: new Date() })
      .where(eq(settingsTable.id, 1));
  }
  return merged;
}
