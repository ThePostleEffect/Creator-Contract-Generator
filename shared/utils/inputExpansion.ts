import type { CreatorContractForm } from "../types/contracts";

/**
 * Universal Input Expansion Logic
 * Converts vague user inputs into complete, professional contractual language
 */

/**
 * Expand vague platform inputs into professional language
 */
export function expandPlatforms(platforms?: string): string {
  if (!platforms) {
    return "across any social media platforms where the Creator currently publishes content or may publish content in the future, including but not limited to YouTube, TikTok, Instagram, Facebook, and similar digital platforms";
  }

  const lower = platforms.toLowerCase().trim();
  
  // Check for vague inputs
  if (
    lower === "any" ||
    lower === "all" ||
    lower === "social media" ||
    lower === "sm" ||
    lower === "everywhere"
  ) {
    return "across any social media platforms where the Creator currently publishes content or may publish content in the future, including but not limited to YouTube, TikTok, Instagram, Facebook, and similar digital platforms";
  }

  // If specific platforms mentioned, keep them but add professional context
  return `on ${platforms}`;
}

/**
 * Expand vague deliverable type inputs into professional language
 */
export function expandDeliverableType(deliverableType?: string, creatorRole: string = "Creator", clientRole: string = "Client"): string {
  if (!deliverableType) {
    return `${creatorRole} will produce deliverables as mutually agreed upon by both parties. Deliverables will be created in a format appropriate for online publication, edited to ${creatorRole}'s standard quality, and aligned with ${clientRole}'s brand objectives.`;
  }

  const lower = deliverableType.toLowerCase().trim();

  // Check for vague inputs
  if (
    lower === "any" ||
    lower === "tbd" ||
    lower === "idk" ||
    lower === "whatever" ||
    lower === "na"
  ) {
    return `${creatorRole} will produce deliverables as mutually agreed upon by both parties. Deliverables will be created in a format appropriate for online publication, edited to ${creatorRole}'s standard quality, and aligned with ${clientRole}'s brand objectives.`;
  }

  // Expand short inputs with professional context
  return `${creatorRole} will produce the following deliverables: ${deliverableType}. Deliverables will be created in a format appropriate for online publication, edited to ${creatorRole}'s standard quality, and aligned with ${clientRole}'s brand objectives.`;
}

/**
 * Expand timeline/deadline inputs into structured language
 */
export function expandTimeline(timeline?: string, forCreator: boolean = true, creatorRole: string = "Creator", clientRole: string = "Client"): string {
  if (!timeline) {
    if (forCreator) {
      return `${creatorRole} will deliver the agreed-upon content within a reasonable timeframe unless otherwise mutually extended in writing.`;
    } else {
      return `${clientRole} shall provide feedback within a reasonable timeframe. Failure to respond will be deemed automatic approval.`;
    }
  }

  const lower = timeline.toLowerCase().trim();

  // Sanitize vague inputs
  if (lower === "asap" || lower === "soon" || lower === "quick" || lower === "fast") {
    timeline = "7 days";
  } else if (lower === "idk" || lower === "tbd" || lower === "na") {
    if (forCreator) {
      return `${creatorRole} will deliver the agreed-upon content within a reasonable timeframe unless otherwise mutually extended in writing.`;
    } else {
      return `${clientRole} shall provide feedback within a reasonable timeframe. Failure to respond will be deemed automatic approval.`;
    }
  }

  if (forCreator) {
    return `${creatorRole} will deliver the agreed-upon content within ${timeline} unless otherwise mutually extended in writing.`;
  } else {
    return `${clientRole} shall provide feedback within ${timeline} of receiving the deliverable. Failure to respond within this timeframe will be deemed automatic approval.`;
  }
}

/**
 * Expand compensation inputs into professional language
 */
export function expandCompensation(
  hasCompensation: boolean,
  feeAmount?: number,
  currency?: string,
  creatorRole: string = "Creator",
  clientRole: string = "Client"
): string {
  if (!hasCompensation) {
    return `This is an unpaid collaboration in which ${creatorRole} provides content in exchange for non-monetary value such as exposure, product, or mutual benefit.`;
  }

  if (!feeAmount || feeAmount === 0) {
    return `${clientRole} agrees to compensate ${creatorRole} for the services described herein. Payment shall be made through the specified method and within the agreed-upon timeline.`;
  }

  const curr = currency || "USD";
  const formattedAmount = `${curr} ${feeAmount.toLocaleString()}`;

  return `${clientRole} agrees to pay ${creatorRole} a total fee of ${formattedAmount} for the services described herein. Payment shall be made through the specified method and within the agreed-upon timeline.`;
}

/**
 * Expand usage rights inputs into structured licensing language
 */
export function expandUsageRights(
  usageRights?: string,
  licenseDuration?: string,
  creatorRole: string = "Creator",
  clientRole: string = "Client"
): string {
  if (!usageRights) {
    usageRights = "non-exclusive, worldwide license for marketing and promotional purposes";
  }

  const lower = usageRights.toLowerCase().trim();

  // Expand vague inputs
  if (
    lower === "perpetual" ||
    lower === "any" ||
    lower === "full rights" ||
    lower === "all rights" ||
    lower === "everything"
  ) {
    usageRights = "non-exclusive, worldwide, perpetual license to use the content for marketing and promotional purposes across any digital platform";
  } else if (lower === "exclusive") {
    usageRights = "exclusive, worldwide license to use the content for marketing and promotional purposes";
  } else if (lower === "limited") {
    usageRights = "limited, non-exclusive license to use the content for specified purposes only";
  }

  let clause = `${clientRole} is granted a ${usageRights}.`;

  if (licenseDuration) {
    const durationLower = licenseDuration.toLowerCase().trim();
    if (durationLower !== "perpetual" && durationLower !== "forever" && durationLower !== "unlimited") {
      clause += ` This license is valid for ${licenseDuration}.`;
    }
  }

  clause += ` ${creatorRole} retains all underlying intellectual property rights and ownership of the content.`;

  return clause;
}

/**
 * Expand exclusivity inputs into professional clause
 */
export function expandExclusivity(
  hasExclusivity: boolean,
  exclusivityScope?: string,
  exclusivityDuration?: string,
  creatorRole: string = "Creator",
  clientRole: string = "Client"
): string {
  if (!hasExclusivity) {
    return "";
  }

  if (!exclusivityScope || exclusivityScope.toLowerCase().trim() === "standard") {
    exclusivityScope = `${creatorRole} agrees not to enter into any paid partnerships with direct competitors of ${clientRole} for the duration of the exclusivity period`;
  }

  let clause = `${exclusivityScope}.`;

  if (exclusivityDuration) {
    clause += ` This exclusivity provision is in effect for ${exclusivityDuration}.`;
  } else {
    clause += ` This exclusivity provision is in effect for the duration of this Agreement.`;
  }

  clause += ` This restriction applies only to direct competitors and does not prevent ${creatorRole} from pursuing other business opportunities outside the scope of this project.`;

  return clause;
}

/**
 * Sanitize vague inputs - convert to professional equivalent or return empty
 */
export function sanitizeVagueInput(input?: string): string {
  if (!input) return "";

  const lower = input.toLowerCase().trim();

  // Vague/placeholder inputs that should be treated as empty
  const vagueTerms = [
    "idk",
    "i don't know",
    "same as usual",
    "whatever",
    "any",
    "na",
    "n/a",
    "tbd",
    "to be determined",
    "none",
    "nothing",
    "no",
    "nope",
    "nah",
  ];

  if (vagueTerms.includes(lower)) {
    return "";
  }

  return input.trim();
}

/**
 * Apply all expansion logic to a contract form
 * Returns an enhanced form with expanded professional language
 */
export function applyExpansionLogic(form: CreatorContractForm): CreatorContractForm {
  const creatorRole = form.creatorRoleLabel || "Creator";
  const clientRole = form.counterpartyRoleLabel || "Client";

  return {
    ...form,
    // Sanitize vague inputs
    projectDescription: sanitizeVagueInput(form.projectDescription),
    deliverableType: sanitizeVagueInput(form.deliverableType),
    scheduleDescription: sanitizeVagueInput(form.scheduleDescription),
    allowedUsesText: sanitizeVagueInput(form.allowedUsesText),
    exclusivityScope: sanitizeVagueInput(form.exclusivityScope),
    
    // Keep original values - expansion happens in contract generator
    // This function just sanitizes; expansion is done contextually in each contract type
  };
}
