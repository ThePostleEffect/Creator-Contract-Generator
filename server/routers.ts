import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { randomBytes } from "crypto";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User preferences (logo upload)
  preferences: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const prefs = await db.getUserPreferences(ctx.user.id);
      return prefs || null; // Return null instead of undefined
    }),
    
    uploadLogo: protectedProcedure
      .input(z.object({
        imageData: z.string(), // base64 encoded image
        mimeType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Convert base64 to buffer
        const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        
        // Generate unique file key
        const ext = input.mimeType.split("/")[1] || "png";
        const randomSuffix = randomBytes(8).toString("hex");
        const fileKey = `logos/${ctx.user.id}-${randomSuffix}.${ext}`;
        
        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        
        // Save to database
        await db.upsertUserPreferences({
          userId: ctx.user.id,
          logoUrl: url,
          logoFileKey: fileKey,
        });
        
        return { url };
      }),
  }),
  
  // Contract templates
  templates: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getContractTemplates(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getContractTemplateById(input.id, ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        templateName: z.string(),
        description: z.string().optional(),
        formData: z.string(), // JSON string
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createContractTemplate({
          userId: ctx.user.id,
          templateName: input.templateName,
          description: input.description,
          formData: input.formData,
        });
        return { id };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const success = await db.deleteContractTemplate(input.id, ctx.user.id);
        return { success };
      }),
  }),
  
  // Signature requests
  signatures: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getSignatureRequestsByUserId(ctx.user.id);
    }),
    
    get: publicProcedure
      .input(z.object({ contractId: z.string() }))
      .query(async ({ input }) => {
        return await db.getSignatureRequestByContractId(input.contractId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        contractId: z.string(),
        contractTitle: z.string(),
        contractText: z.string(),
        formData: z.string(), // JSON string
      }))
      .mutation(async ({ ctx, input }) => {
        const contractId = await db.createSignatureRequest({
          userId: ctx.user.id,
          contractId: input.contractId,
          contractTitle: input.contractTitle,
          contractText: input.contractText,
          formData: input.formData,
        });
        return { contractId };
      }),
    
    sign: publicProcedure
      .input(z.object({
        contractId: z.string(),
        signatureData: z.string(), // base64 encoded signature image
        signerType: z.enum(["creator", "counterparty"]),
      }))
      .mutation(async ({ input }) => {
        // Convert base64 to buffer
        const base64Data = input.signatureData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        
        // Generate unique file key
        const randomSuffix = randomBytes(8).toString("hex");
        const fileKey = `signatures/${input.contractId}-${input.signerType}-${randomSuffix}.png`;
        
        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, "image/png");
        
        // Update signature request
        const request = await db.getSignatureRequestByContractId(input.contractId);
        if (!request) throw new Error("Contract not found");
        
        const updates: any = {};
        
        if (input.signerType === "creator") {
          updates.creatorSigned = 1;
          updates.creatorSignatureUrl = url;
          updates.creatorSignedAt = new Date();
        } else {
          updates.counterpartySigned = 1;
          updates.counterpartySignatureUrl = url;
          updates.counterpartySignedAt = new Date();
        }
        
        // Update status
        const creatorSigned = input.signerType === "creator" ? 1 : request.creatorSigned;
        const counterpartySigned = input.signerType === "counterparty" ? 1 : request.counterpartySigned;
        
        if (creatorSigned && counterpartySigned) {
          updates.status = "fully_signed";
        } else if (creatorSigned || counterpartySigned) {
          updates.status = "partially_signed";
        }
        
        await db.updateSignatureRequest(input.contractId, updates);
        
        return { success: true, signatureUrl: url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
