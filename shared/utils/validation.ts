import type { CreatorContractForm, ContractType } from "../types/contracts";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ===== TEXT SANITIZATION =====

const INFORMAL_WORDS: Record<string, string> = {
  nah: "no",
  nope: "no",
  yeah: "yes",
  yep: "yes",
  idk: "",
  "i don't know": "",
  maybe: "",
  "maybe later": "",
  probably: "",
  "i guess": "",
  dunno: "",
  gonna: "going to",
  wanna: "want to",
  gotta: "have to",
  kinda: "kind of",
  sorta: "sort of",
};

const SLANG_PATTERNS = [
  /\blol\b/gi,
  /\blmao\b/gi,
  /\bomg\b/gi,
  /\bwtf\b/gi,
  /\btbh\b/gi,
  /\bimo\b/gi,
  /\bfyi\b/gi,
  /\basap\b/gi,
  /\bbrb\b/gi,
  /\bbtw\b/gi,
];

const EMOJI_PATTERN = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g;

/**
 * Sanitize text by removing slang, emojis, and informal language
 */
export function sanitizeText(text: string | undefined): string {
  if (!text) return "";

  let sanitized = text.trim();

  // Remove emojis
  sanitized = sanitized.replace(EMOJI_PATTERN, "");

  // Replace informal words
  Object.entries(INFORMAL_WORDS).forEach(([informal, formal]) => {
    const regex = new RegExp(`\\b${informal}\\b`, "gi");
    sanitized = sanitized.replace(regex, formal);
  });

  // Flag slang patterns (for now, just remove them)
  SLANG_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  // Clean up multiple spaces
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  return sanitized;
}

/**
 * Capitalize proper nouns (names, cities)
 */
export function capitalizeName(name: string | undefined): string {
  if (!name) return "";

  return name
    .trim()
    .split(" ")
    .map((word) => {
      if (word.length === 0) return "";
      // Handle hyphenated names
      if (word.includes("-")) {
        return word
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join("-");
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Format city/state properly
 */
export function formatCityState(cityState: string | undefined): string {
  if (!cityState) return "";

  const sanitized = sanitizeText(cityState);
  const parts = sanitized.split(",").map((p) => p.trim());

  if (parts.length === 2) {
    const city = capitalizeName(parts[0]);
    const state = parts[1].toUpperCase();
    return `${city}, ${state}`;
  }

  return capitalizeName(sanitized);
}

/**
 * Check if text contains unprofessional language
 */
export function hasUnprofessionalLanguage(text: string | undefined): boolean {
  if (!text) return false;

  const lower = text.toLowerCase();

  // Check for emojis
  if (EMOJI_PATTERN.test(text)) return true;

  // Check for slang
  for (const pattern of SLANG_PATTERNS) {
    if (pattern.test(text)) return true;
  }

  // Check for informal words
  for (const informal of Object.keys(INFORMAL_WORDS)) {
    const regex = new RegExp(`\\b${informal}\\b`, "i");
    if (regex.test(lower)) return true;
  }

  return false;
}

// ===== CONTRACT-TYPE VALIDATION =====

/**
 * Validate revenue-share contracts
 */
function validateRevenueShare(form: CreatorContractForm): string[] {
  const errors: string[] = [];

  if (!form.revenueSourcesText?.trim()) {
    errors.push("Revenue sources must be specified");
  }

  if (!form.revenueSplitDescription?.trim()) {
    errors.push("Revenue split details must be specified");
  }

  if (!form.paymentSchedule?.trim()) {
    errors.push("Payment schedule must be specified");
  }

  if (!form.endDateOrOngoing?.trim()) {
    errors.push("Contract term/duration must be specified");
  }

  if (!form.projectDescription?.trim() && !form.scheduleDescription?.trim()) {
    errors.push("Roles and responsibilities must be defined");
  }

  return errors;
}

/**
 * Validate brand deal / UGC / whitelisting contracts
 */
function validateBrandDeal(form: CreatorContractForm): string[] {
  const errors: string[] = [];

  if (!form.deliverableCount || form.deliverableCount <= 0) {
    errors.push("Deliverable count must be specified");
  }

  if (!form.deliverableType?.trim()) {
    errors.push("Deliverable type must be specified");
  }

  if (!form.platforms?.trim()) {
    errors.push("Platforms must be specified");
  }

  if (!form.paymentSchedule?.trim()) {
    errors.push("Payment schedule must be specified");
  }

  if (!form.licenseDurationText?.trim()) {
    errors.push("Usage duration must be specified");
  }

  return errors;
}

/**
 * Validate service provider contracts
 */
function validateServiceProvider(form: CreatorContractForm): string[] {
  const errors: string[] = [];

  if (!form.deliverableType?.trim()) {
    errors.push("Deliverable type must be specified");
  }

  if (form.includedRevisions === undefined || form.includedRevisions < 0) {
    errors.push("Revision count must be specified");
  }

  if (!form.feeType?.trim()) {
    errors.push("Fee type must be specified");
  }

  if (!form.feeAmount || form.feeAmount <= 0) {
    errors.push("Fee amount must be specified");
  }

  return errors;
}

/**
 * Validate NDA contracts
 */
function validateNDA(form: CreatorContractForm): string[] {
  const errors: string[] = [];

  if (!form.projectDescription?.trim()) {
    errors.push("Definition of confidential information must be specified");
  }

  if (!form.endDateOrOngoing?.trim()) {
    errors.push("NDA duration must be specified");
  }

  return errors;
}

/**
 * Validate release contracts
 */
function validateRelease(form: CreatorContractForm): string[] {
  const errors: string[] = [];

  if (!form.releaseeName?.trim() && !form.descriptionOfAppearanceOrContent?.trim()) {
    errors.push("Identification of person/property/content must be specified");
  }

  if (!form.allowedUsesText?.trim()) {
    errors.push("Rights granted must be specified");
  }

  return errors;
}

/**
 * Main validation function
 */
export function validateContract(
  form: CreatorContractForm,
  type: ContractType
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic required fields for all contracts
  if (!form.creatorName?.trim()) {
    errors.push("Creator name is required");
  }

  if (!form.counterpartyName?.trim()) {
    errors.push("Counterparty name is required");
  }

  // Check for unprofessional language in key fields
  const fieldsToCheck = [
    { field: form.creatorName, name: "Creator name" },
    { field: form.counterpartyName, name: "Counterparty name" },
    { field: form.projectTitle, name: "Project title" },
    { field: form.projectDescription, name: "Project description" },
    { field: form.scheduleDescription, name: "Schedule description" },
  ];

  fieldsToCheck.forEach(({ field, name }) => {
    if (field && hasUnprofessionalLanguage(field)) {
      warnings.push(`${name} contains informal language. Please use professional terms.`);
    }
  });

  // Contract-type-specific validation
  switch (type) {
    case "revenue_share_project":
      errors.push(...validateRevenueShare(form));
      break;

    case "brand_sponsorship":
    case "ugc_production":
    case "whitelisting_rights":
      errors.push(...validateBrandDeal(form));
      break;

    case "service_editor":
    case "service_thumbnail_designer":
    case "service_clipper":
    case "service_channel_manager":
      errors.push(...validateServiceProvider(form));
      break;

    case "nda_one_way":
    case "nda_mutual":
      errors.push(...validateNDA(form));
      break;

    case "model_release":
    case "guest_release":
    case "location_release":
    case "contributor_content_release":
      errors.push(...validateRelease(form));
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Sanitize entire form before contract generation
 */
export function sanitizeForm(form: CreatorContractForm): CreatorContractForm {
  return {
    ...form,
    creatorName: capitalizeName(sanitizeText(form.creatorName)),
    counterpartyName: capitalizeName(sanitizeText(form.counterpartyName)),
    creatorCityState: formatCityState(form.creatorCityState),
    projectTitle: sanitizeText(form.projectTitle),
    projectDescription: sanitizeText(form.projectDescription),
    scheduleDescription: sanitizeText(form.scheduleDescription),
    platforms: sanitizeText(form.platforms),
    paymentSchedule: sanitizeText(form.paymentSchedule),
    governingLawRegion: form.governingLawRegion?.trim() || form.creatorCityState?.split(",")[1]?.trim() || "California",
    revenueSourcesText: sanitizeText(form.revenueSourcesText),
    revenueSplitDescription: sanitizeText(form.revenueSplitDescription),
    deliverableType: sanitizeText(form.deliverableType),
    allowedUsesText: sanitizeText(form.allowedUsesText),
    licenseDurationText: sanitizeText(form.licenseDurationText),
    releaseeName: capitalizeName(sanitizeText(form.releaseeName)),
    descriptionOfAppearanceOrContent: sanitizeText(form.descriptionOfAppearanceOrContent),
  };
}
