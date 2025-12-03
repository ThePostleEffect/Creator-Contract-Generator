import { describe, expect, it } from "vitest";
import {
  sanitizeText,
  capitalizeName,
  formatCityState,
  hasUnprofessionalLanguage,
  validateContract,
  sanitizeForm,
} from "./validation";
import type { CreatorContractForm } from "../types/contracts";

describe("Text Sanitization", () => {
  it("should remove emojis from text", () => {
    const result = sanitizeText("Hello 😊 World 🎉");
    expect(result).not.toContain("😊");
    expect(result).not.toContain("🎉");
  });

  it("should replace informal words", () => {
    expect(sanitizeText("yeah I agree")).toContain("yes");
    expect(sanitizeText("nah thanks")).toContain("no");
  });

  it("should capitalize names properly", () => {
    expect(capitalizeName("john doe")).toBe("John Doe");
    expect(capitalizeName("mary-jane smith")).toBe("Mary-Jane Smith");
  });

  it("should format city/state correctly", () => {
    expect(formatCityState("los angeles, ca")).toBe("Los Angeles, CA");
    expect(formatCityState("new york,ny")).toBe("New York, NY");
  });

  it("should detect unprofessional language", () => {
    expect(hasUnprofessionalLanguage("This is lol funny")).toBe(true);
    expect(hasUnprofessionalLanguage("Professional text")).toBe(false);
    expect(hasUnprofessionalLanguage("yeah sure")).toBe(true);
  });
});

describe("Contract Validation", () => {
  const baseForm: CreatorContractForm = {
    category: "brand",
    contractType: "brand_sponsorship",
    tone: "neutral",
    creatorName: "John Creator",
    creatorRoleLabel: "Content Creator",
    counterpartyName: "Brand Company",
    counterpartyRoleLabel: "Brand",
    hasCompensation: true,
    hasExclusivity: false,
    hasRevenueShare: false,
  };

  it("should validate brand sponsorship contract", () => {
    const form: CreatorContractForm = {
      ...baseForm,
      deliverableCount: 3,
      deliverableType: "Instagram Posts",
      platforms: "Instagram, TikTok",
      paymentSchedule: "Net 30",
      licenseDurationText: "12 months",
    };

    const result = validateContract(form, "brand_sponsorship");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail validation when required fields missing", () => {
    const form: CreatorContractForm = {
      ...baseForm,
      // Missing required fields for brand sponsorship
    };

    const result = validateContract(form, "brand_sponsorship");
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("should validate revenue share contract", () => {
    const form: CreatorContractForm = {
      ...baseForm,
      contractType: "revenue_share_project",
      hasRevenueShare: true,
      revenueSourcesText: "YouTube AdSense, Sponsorships",
      revenueSplitDescription: "50/50 split",
      paymentSchedule: "Monthly",
      endDateOrOngoing: "12 months",
      projectDescription: "Joint YouTube channel",
    };

    const result = validateContract(form, "revenue_share_project");
    expect(result.valid).toBe(true);
  });

  it("should validate service provider contract", () => {
    const form: CreatorContractForm = {
      ...baseForm,
      contractType: "service_editor",
      deliverableType: "Video editing",
      includedRevisions: 2,
      feeType: "per_deliverable",
      feeAmount: 500,
    };

    const result = validateContract(form, "service_editor");
    expect(result.valid).toBe(true);
  });

  it("should warn about unprofessional language", () => {
    const form: CreatorContractForm = {
      ...baseForm,
      projectTitle: "This is gonna be lol amazing",
    };

    const result = validateContract(form, "brand_sponsorship");
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

describe("Form Sanitization", () => {
  it("should sanitize entire form", () => {
    const form: CreatorContractForm = {
      category: "brand",
      contractType: "brand_sponsorship",
      tone: "neutral",
      creatorName: "john doe",
      creatorRoleLabel: "Creator",
      creatorCityState: "los angeles, ca",
      counterpartyName: "brand company",
      counterpartyRoleLabel: "Brand",
      projectTitle: "yeah this is cool",
      hasCompensation: true,
      hasExclusivity: false,
      hasRevenueShare: false,
    };

    const sanitized = sanitizeForm(form);

    expect(sanitized.creatorName).toBe("John Doe");
    expect(sanitized.counterpartyName).toBe("Brand Company");
    expect(sanitized.creatorCityState).toBe("Los Angeles, CA");
    expect(sanitized.projectTitle).toContain("yes");
  });
});
