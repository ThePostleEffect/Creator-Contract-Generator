import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User preferences including logo and default settings
 */
export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  logoUrl: text("logoUrl"), // S3 URL to user's logo
  logoFileKey: text("logoFileKey"), // S3 file key for deletion
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

/**
 * Saved contract templates for quick reuse
 */
export const contractTemplates = mysqlTable("contractTemplates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  templateName: varchar("templateName", { length: 255 }).notNull(),
  description: text("description"),
  formData: text("formData").notNull(), // JSON string of CreatorContractForm
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContractTemplate = typeof contractTemplates.$inferSelect;
export type InsertContractTemplate = typeof contractTemplates.$inferInsert;

/**
 * Signature requests for contracts
 */
export const signatureRequests = mysqlTable("signatureRequests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Contract creator
  contractId: varchar("contractId", { length: 64 }).notNull().unique(), // Unique ID for this contract
  contractTitle: varchar("contractTitle", { length: 255 }).notNull(),
  contractText: text("contractText").notNull(),
  formData: text("formData").notNull(), // JSON string of CreatorContractForm
  
  // Signature status
  creatorSigned: int("creatorSigned").default(0).notNull(), // 0 = not signed, 1 = signed
  creatorSignatureUrl: text("creatorSignatureUrl"),
  creatorSignedAt: timestamp("creatorSignedAt"),
  
  counterpartySigned: int("counterpartySigned").default(0).notNull(),
  counterpartySignatureUrl: text("counterpartySignatureUrl"),
  counterpartySignedAt: timestamp("counterpartySignedAt"),
  
  status: mysqlEnum("status", ["pending", "partially_signed", "fully_signed"]).default("pending").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SignatureRequest = typeof signatureRequests.$inferSelect;
export type InsertSignatureRequest = typeof signatureRequests.$inferInsert;