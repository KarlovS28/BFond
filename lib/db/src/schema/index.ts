import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const childrenTable = pgTable("children", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  surname: text("surname").notNull(),
  age: integer("age").notNull(),
  diagnosis: text("diagnosis").notNull(),
  story: text("story").notNull().default(""),
  photoUrl: text("photo_url").notNull().default(""),
  targetSum: integer("target_sum").notNull().default(0),
  collectedSum: integer("collected_sum").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  isUrgent: boolean("is_urgent").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const storiesTable = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  photoUrl: text("photo_url").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reportsTable = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const volunteersTable = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  city: text("city").notNull(),
  helpType: text("help_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const materialHelpTable = pgTable("material_help", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  items: text("items").notNull(),
  preferredDate: text("preferred_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const helpRequestsTable = pgTable("help_requests", {
  id: serial("id").primaryKey(),
  childName: text("child_name").notNull(),
  age: integer("age").notNull(),
  diagnosis: text("diagnosis").notNull(),
  targetSum: integer("target_sum").notNull(),
  parentContacts: text("parent_contacts").notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactsTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const visitsTable = pgTable("visits", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  path: text("path").notNull().default("/"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const donationClicksTable = pgTable("donation_clicks", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  amount: integer("amount"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminUsersTable = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminSessionsTable = pgTable("admin_sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
