import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  userPreferences, 
  contractTemplates, 
  signatureRequests,
  type UserPreference,
  type ContractTemplate,
  type SignatureRequest,
  type InsertUserPreference,
  type InsertContractTemplate,
  type InsertSignatureRequest
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== User Preferences =====

export async function getUserPreferences(userId: number): Promise<UserPreference | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertUserPreferences(prefs: InsertUserPreference): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userPreferences).values(prefs).onDuplicateKeyUpdate({
    set: {
      logoUrl: prefs.logoUrl,
      logoFileKey: prefs.logoFileKey,
      updatedAt: new Date(),
    },
  });
}

// ===== Contract Templates =====

export async function getContractTemplates(userId: number): Promise<ContractTemplate[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contractTemplates).where(eq(contractTemplates.userId, userId));
}

export async function getContractTemplateById(id: number, userId: number): Promise<ContractTemplate | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(contractTemplates)
    .where(eq(contractTemplates.id, id))
    .limit(1);
  
  if (result.length === 0) return undefined;
  
  // Verify ownership
  if (result[0].userId !== userId) return undefined;
  
  return result[0];
}

export async function createContractTemplate(template: InsertContractTemplate): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contractTemplates).values(template);
  return Number((result as any).insertId || 0);
}

export async function deleteContractTemplate(id: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  // Verify ownership before deleting
  const template = await getContractTemplateById(id, userId);
  if (!template) return false;

  await db.delete(contractTemplates).where(eq(contractTemplates.id, id));
  return true;
}

// ===== Signature Requests =====

export async function getSignatureRequestsByUserId(userId: number): Promise<SignatureRequest[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(signatureRequests).where(eq(signatureRequests.userId, userId));
}

export async function getSignatureRequestByContractId(contractId: string): Promise<SignatureRequest | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(signatureRequests)
    .where(eq(signatureRequests.contractId, contractId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function createSignatureRequest(request: InsertSignatureRequest): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(signatureRequests).values(request);
  return request.contractId;
}

export async function updateSignatureRequest(
  contractId: string,
  updates: Partial<SignatureRequest>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(signatureRequests)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(signatureRequests.contractId, contractId));
}
