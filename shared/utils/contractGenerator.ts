import type { CreatorContractForm, ContractTone } from "../types/contracts";
import {
  expandPlatforms,
  expandDeliverableType,
  expandTimeline,
  expandCompensation,
  expandUsageRights,
  expandExclusivity,
  sanitizeVagueInput,
} from "./inputExpansion";

// Helper functions
function formatCurrency(amount?: number, currency?: string): string {
  if (!amount) return "$0";
  const curr = currency || "USD";
  return `${curr} ${amount.toLocaleString()}`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "[DATE]";
  return dateStr;
}

// Mandatory legal disclaimer
const LEGAL_DISCLAIMER = `

DISCLAIMER

This contract template is provided for general informational purposes only and does not constitute legal advice. Parties should consider consulting with a licensed attorney for guidance tailored to their situation.
`;

// Main contract generation function
export function generateContract(form: CreatorContractForm): string {
  const { contractType } = form;

  // Route to appropriate template based on contract type
  
  // BRAND DEALS
  if (contractType === "brand_sponsorship" || contractType === "ugc_production") {
    return generateBrandDealContract(form);
  }
  if (contractType === "content_license") {
    return generateContentLicenseContract(form);
  }
  if (contractType === "whitelisting_rights") {
    return generateWhitelistingContract(form);
  }
  if (contractType === "affiliate_promo") {
    return generateAffiliateContract(form);
  }
  
  // CREATOR COLLABORATIONS
  if (contractType === "collab_single_project" || contractType === "co_creator_ongoing") {
    return generateCollabContract(form);
  }
  if (contractType === "revenue_share_project") {
    return generateRevenueShareContract(form);
  }
  
  // SERVICE PROVIDERS
  if (
    contractType === "service_editor" ||
    contractType === "service_thumbnail_designer" ||
    contractType === "service_clipper" ||
    contractType === "service_channel_manager"
  ) {
    return generateServiceProviderContract(form);
  }
  
  // RELEASES
  if (contractType === "model_release") {
    return generateModelReleaseContract(form);
  }
  if (contractType === "guest_release") {
    return generateGuestReleaseContract(form);
  }
  if (contractType === "location_release") {
    return generateLocationReleaseContract(form);
  }
  if (contractType === "contributor_content_release") {
    return generateContributorReleaseContract(form);
  }
  
  // NDAs
  if (contractType === "nda_one_way") {
    return generateOneWayNDAContract(form);
  }
  if (contractType === "nda_mutual") {
    return generateMutualNDAContract(form);
  }
  
  // BUSINESS OPERATIONS
  if (contractType === "talent_management") {
    return generateTalentManagementContract(form);
  }
  if (contractType === "joint_project_jv") {
    return generateJointVentureContract(form);
  }
  
  // COMMUNITY
  if (contractType === "giveaway_terms") {
    return generateGiveawayRulesContract(form);
  }
  if (contractType === "community_moderator_agreement") {
    return generateModeratorContract(form);
  }
  
  // Fallback
  return generateGenericContract(form);
}

/**
 * BRAND SPONSORSHIP / UGC PRODUCTION CONTRACT
 */
function generateBrandDealContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Creator",
    counterpartyName,
    counterpartyRoleLabel = "Brand",
    projectTitle,
    projectDescription,
    deliverableType,
    platforms,
    hasCompensation,
    feeAmount,
    currency,
    paymentSchedule,
    allowedUsesText,
    licenseDurationText,
    hasExclusivity,
    exclusivityScope,
    exclusivityDuration,
    terminationNoticePeriodText,
    governingLawRegion = "California",
  } = form;

  let contract = `BRAND SPONSORSHIP AGREEMENT\n\n`;

  // 1. PARTIES & PURPOSE
  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Brand Sponsorship Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `The purpose of this Agreement is to establish the terms under which ${creatorRoleLabel} will create and publish sponsored content on behalf of ${counterpartyRoleLabel}. `;
  contract += `Both parties agree to the terms outlined herein and acknowledge that this Agreement constitutes the entire understanding between them regarding this collaboration.\n\n`;

  // 2. SCOPE OF WORK & DELIVERABLES
  contract += `2. SCOPE OF WORK & DELIVERABLES\n\n`;
  if (projectTitle) {
    contract += `Project: ${projectTitle}. `;
  }
  if (projectDescription) {
    contract += `${projectDescription} `;
  }
  
  // Use expansion logic for deliverables
  const expandedDeliverables = expandDeliverableType(deliverableType, creatorRoleLabel, counterpartyRoleLabel);
  contract += `${expandedDeliverables} `;
  
  // Use expansion logic for platforms
  const expandedPlatforms = expandPlatforms(platforms);
  contract += `Content will be published ${expandedPlatforms}. `;
  
  contract += `${creatorRoleLabel} retains creative control over the content, subject to ${counterpartyRoleLabel}'s reasonable approval rights to ensure brand alignment. ${counterpartyRoleLabel} agrees to provide feedback within a reasonable timeframe to avoid delays in publication.\n\n`;

  // 3. COMPENSATION & PAYMENT TERMS
  contract += `3. COMPENSATION & PAYMENT TERMS\n\n`;
  const expandedCompensation = expandCompensation(hasCompensation, feeAmount, currency, creatorRoleLabel, counterpartyRoleLabel);
  contract += `${expandedCompensation} `;
  
  if (hasCompensation && feeAmount && paymentSchedule) {
    contract += `Payment schedule: ${paymentSchedule}. `;
  } else if (hasCompensation && feeAmount) {
    contract += `Payment shall be made within thirty (30) days of content delivery and approval. `;
  }
  
  if (hasCompensation) {
    contract += `All payments are non-refundable once the content has been delivered and approved. Late payments may incur interest charges or suspension of further deliverables until payment is received.\n\n`;
  } else {
    contract += `\n\n`;
  }

  // 4. RIGHTS, OWNERSHIP & USAGE
  contract += `4. RIGHTS, OWNERSHIP & USAGE\n\n`;
  contract += `${creatorRoleLabel} retains all intellectual property rights and ownership of the content created under this Agreement. `;
  
  // Use expansion logic for usage rights
  const expandedUsageRights = expandUsageRights(allowedUsesText, licenseDurationText, creatorRoleLabel, counterpartyRoleLabel);
  contract += `${expandedUsageRights} `;
  
  contract += `${creatorRoleLabel} may repurpose or reuse the content for their own portfolio, promotional materials, or other projects unless explicitly restricted by an exclusivity clause.\n\n`;

  // 5. EXCLUSIVITY (conditional)
  if (hasExclusivity) {
    contract += `5. EXCLUSIVITY\n\n`;
    const expandedExclusivity = expandExclusivity(hasExclusivity, exclusivityScope, exclusivityDuration, creatorRoleLabel, counterpartyRoleLabel);
    contract += `${expandedExclusivity}\n\n`;
  }

  // 6. TERM & TERMINATION
  const terminationSection = hasExclusivity ? "6" : "5";
  contract += `${terminationSection}. TERM & TERMINATION\n\n`;
  contract += `This Agreement begins upon execution by both parties and continues until all deliverables have been completed and approved. `;
  
  if (terminationNoticePeriodText) {
    contract += `Either party may terminate this Agreement with ${terminationNoticePeriodText} written notice. `;
  } else {
    contract += `Either party may terminate this Agreement with seven (7) days written notice. `;
  }
  
  contract += `In the event of termination, ${creatorRoleLabel} shall be compensated for any work completed up to the date of termination. ${counterpartyRoleLabel}'s usage rights to any completed content shall survive termination unless otherwise agreed.\n\n`;

  // 7. LIABILITY & INDEMNIFICATION
  const liabilitySection = hasExclusivity ? "7" : "6";
  contract += `${liabilitySection}. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `Each party agrees to indemnify and hold harmless the other party from any claims, damages, or liabilities arising from their own actions or content. `;
  contract += `${creatorRoleLabel} represents that all content created is original or properly licensed and does not infringe on any third-party rights. `;
  contract += `${counterpartyRoleLabel} represents that all product information and brand materials provided are accurate and authorized for use.\n\n`;

  // 8. GOVERNING LAW & DISPUTE RESOLUTION
  const governingSection = hasExclusivity ? "8" : "7";
  contract += `${governingSection}. GOVERNING LAW & DISPUTE RESOLUTION\n\n`;
  contract += `This Agreement shall be governed by and construed in accordance with the laws of ${governingLawRegion}, without regard to its conflict of law principles. `;
  contract += `Any disputes arising under this Agreement shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes may be resolved through mediation or binding arbitration as mutually agreed by both parties.\n\n`;

  // 9. MISCELLANEOUS
  const miscSection = hasExclusivity ? "9" : "8";
  contract += `${miscSection}. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements or understandings, whether written or oral. `;
  contract += `Any modifications to this Agreement must be made in writing and signed by both parties. `;
  contract += `If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force and effect.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * CONTENT LICENSING CONTRACT
 */
function generateContentLicenseContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Licensor",
    counterpartyName,
    counterpartyRoleLabel = "Licensee",
    projectDescription,
    allowedUsesText,
    licenseDurationText,
    hasCompensation,
    feeAmount,
    currency,
    paymentSchedule,
    terminationNoticePeriodText,
    governingLawRegion = "California",
  } = form;

  let contract = `CONTENT LICENSING AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Content Licensing Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `${creatorRoleLabel} owns certain content and grants ${counterpartyRoleLabel} a license to use that content according to the terms outlined herein. `;
  contract += `This Agreement establishes the scope of the license, permitted uses, compensation, and responsibilities of both parties.\n\n`;

  contract += `2. LICENSED CONTENT\n\n`;
  if (projectDescription) {
    contract += `The licensed content includes: ${projectDescription}. `;
  } else {
    contract += `The licensed content includes existing creative works owned by ${creatorRoleLabel} as mutually agreed upon by both parties. `;
  }
  contract += `${creatorRoleLabel} represents and warrants that they are the sole owner of the content and have the full right and authority to grant this license. ${creatorRoleLabel} further warrants that the content does not infringe on any third-party intellectual property rights.\n\n`;

  contract += `3. SCOPE OF LICENSE\n\n`;
  const expandedUsageRights = expandUsageRights(allowedUsesText, licenseDurationText, creatorRoleLabel, counterpartyRoleLabel);
  contract += `${expandedUsageRights} `;
  contract += `${counterpartyRoleLabel} may not sublicense, transfer, or assign this license without the prior written consent of ${creatorRoleLabel}. Any use of the content outside the scope of this license requires separate written authorization from ${creatorRoleLabel}.\n\n`;

  contract += `4. COMPENSATION & PAYMENT\n\n`;
  const expandedCompensation = expandCompensation(hasCompensation, feeAmount, currency, creatorRoleLabel, counterpartyRoleLabel);
  contract += `${expandedCompensation} `;
  if (hasCompensation && paymentSchedule) {
    contract += `Payment schedule: ${paymentSchedule}. `;
  } else if (hasCompensation && feeAmount) {
    contract += `Payment is due within thirty (30) days of execution of this Agreement. `;
  }
  if (hasCompensation) {
    contract += `Late payments may incur interest charges as permitted by law.\n\n`;
  } else {
    contract += `\n\n`;
  }

  contract += `5. TERM & TERMINATION\n\n`;
  contract += `This Agreement begins upon execution and continues for the duration specified in the license terms. `;
  if (terminationNoticePeriodText) {
    contract += `Either party may terminate this Agreement with ${terminationNoticePeriodText} written notice for material breach. `;
  } else {
    contract += `Either party may terminate this Agreement with thirty (30) days written notice for material breach. `;
  }
  contract += `Upon termination, ${counterpartyRoleLabel} shall immediately cease all use of the licensed content unless otherwise agreed in writing.\n\n`;

  contract += `6. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `${creatorRoleLabel} agrees to indemnify ${counterpartyRoleLabel} from claims arising from any breach of the warranties provided in this Agreement. `;
  contract += `${counterpartyRoleLabel} agrees to indemnify ${creatorRoleLabel} from claims arising from ${counterpartyRoleLabel}'s use of the content outside the scope of this license. `;
  contract += `Neither party shall be liable for indirect, incidental, or consequential damages.\n\n`;

  contract += `7. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Any disputes shall first be resolved through good-faith negotiation, and if unresolved, through mediation or arbitration as mutually agreed.\n\n`;

  contract += `8. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties. Any modifications must be made in writing and signed by both parties. If any provision is found unenforceable, the remaining provisions shall continue in effect.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * WHITELISTING RIGHTS CONTRACT
 */
function generateWhitelistingContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Creator",
    counterpartyName,
    counterpartyRoleLabel = "Brand",
    projectDescription,
    allowedUsesText,
    licenseDurationText,
    hasCompensation,
    feeAmount,
    currency,
    paymentSchedule,
    governingLawRegion = "California",
  } = form;

  let contract = `WHITELISTING RIGHTS AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Whitelisting Rights Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `${creatorRoleLabel} grants ${counterpartyRoleLabel} the right to use ${creatorRoleLabel}'s social media accounts and content for paid advertising purposes. `;
  contract += `This Agreement establishes the terms, compensation, and limitations of such whitelisting rights.\n\n`;

  contract += `2. SCOPE OF WHITELISTING RIGHTS\n\n`;
  if (projectDescription) {
    contract += `${projectDescription} `;
  } else {
    contract += `${counterpartyRoleLabel} is granted permission to run paid advertisements using ${creatorRoleLabel}'s social media accounts and existing content. `;
  }
  
  const expandedUsageRights = expandUsageRights(allowedUsesText, licenseDurationText, creatorRoleLabel, counterpartyRoleLabel);
  contract += `${expandedUsageRights} `;
  
  contract += `${creatorRoleLabel} retains the right to review and approve all advertisements before they are published. ${counterpartyRoleLabel} agrees to provide ${creatorRoleLabel} with reasonable notice and opportunity to review ad creative and targeting parameters.\n\n`;

  contract += `3. COMPENSATION\n\n`;
  const expandedCompensation = expandCompensation(hasCompensation, feeAmount, currency, creatorRoleLabel, counterpartyRoleLabel);
  contract += `${expandedCompensation} `;
  if (hasCompensation && paymentSchedule) {
    contract += `Payment schedule: ${paymentSchedule}. `;
  } else if (hasCompensation && feeAmount) {
    contract += `Payment is due monthly based on the duration of whitelisting access. `;
  }
  if (hasCompensation) {
    contract += `Payments are non-refundable once whitelisting access has been granted.\n\n`;
  } else {
    contract += `\n\n`;
  }

  contract += `4. CREATOR RIGHTS & CONTROL\n\n`;
  contract += `${creatorRoleLabel} retains full ownership and control of their social media accounts at all times. ${counterpartyRoleLabel} may not post organic content, change account settings, or access private messages without explicit written permission from ${creatorRoleLabel}. `;
  contract += `${creatorRoleLabel} reserves the right to revoke whitelisting access immediately if ${counterpartyRoleLabel} violates the terms of this Agreement or publishes content that damages ${creatorRoleLabel}'s reputation.\n\n`;

  contract += `5. TERM & TERMINATION\n\n`;
  contract += `This Agreement begins upon execution and continues for the duration specified in the whitelisting terms. Either party may terminate this Agreement with seven (7) days written notice. `;
  contract += `Upon termination, ${counterpartyRoleLabel} shall immediately cease all paid advertising using ${creatorRoleLabel}'s accounts and content.\n\n`;

  contract += `6. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `${counterpartyRoleLabel} agrees to indemnify ${creatorRoleLabel} from any claims arising from advertisements run under this Agreement. ${creatorRoleLabel} is not liable for the performance or results of any paid advertising campaigns.\n\n`;

  contract += `7. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall be resolved through good-faith negotiation, mediation, or arbitration as mutually agreed.\n\n`;

  contract += `8. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties. Modifications must be made in writing and signed by both parties.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * AFFILIATE PROMOTION CONTRACT
 */
function generateAffiliateContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Affiliate",
    counterpartyName,
    counterpartyRoleLabel = "Company",
    projectDescription,
    commissionStructure,
    paymentSchedule,
    hasExclusivity,
    exclusivityScope,
    exclusivityDuration,
    terminationNoticePeriodText,
    governingLawRegion = "California",
  } = form;

  let contract = `AFFILIATE PROMOTION AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Affiliate Promotion Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `${creatorRoleLabel} agrees to promote ${counterpartyRoleLabel}'s products or services in exchange for commission-based compensation as outlined herein. `;
  contract += `This Agreement establishes the terms of the affiliate relationship, commission structure, and responsibilities of both parties.\n\n`;

  contract += `2. AFFILIATE RESPONSIBILITIES\n\n`;
  if (projectDescription) {
    contract += `${projectDescription} `;
  } else {
    contract += `${creatorRoleLabel} agrees to promote ${counterpartyRoleLabel}'s products or services through their content, social media channels, or other marketing efforts. `;
  }
  contract += `${creatorRoleLabel} shall use their unique affiliate link or code provided by ${counterpartyRoleLabel} to track sales and conversions. ${creatorRoleLabel} agrees to comply with all applicable advertising disclosure requirements and clearly disclose the affiliate relationship to their audience.\n\n`;

  contract += `3. COMMISSION STRUCTURE\n\n`;
  if (commissionStructure) {
    contract += `Commission structure: ${commissionStructure}. `;
  } else {
    contract += `${creatorRoleLabel} will earn a commission on qualifying sales generated through their unique affiliate link. The commission rate and qualifying criteria shall be as mutually agreed upon by both parties. `;
  }
  contract += `Commissions are calculated based on completed sales after any returns, refunds, or chargebacks. ${counterpartyRoleLabel} reserves the right to withhold commissions on fraudulent or suspicious transactions.\n\n`;

  contract += `4. PAYMENT TERMS\n\n`;
  if (paymentSchedule) {
    contract += `Payment schedule: ${paymentSchedule}. `;
  } else {
    contract += `Commissions shall be paid monthly, within thirty (30) days following the end of each month. `;
  }
  contract += `${counterpartyRoleLabel} will provide ${creatorRoleLabel} with regular reports detailing sales, conversions, and earned commissions. Payments may be subject to a minimum threshold as agreed upon by both parties.\n\n`;

  if (hasExclusivity) {
    contract += `5. EXCLUSIVITY\n\n`;
    const expandedExclusivity = expandExclusivity(hasExclusivity, exclusivityScope, exclusivityDuration, creatorRoleLabel, counterpartyRoleLabel);
    contract += `${expandedExclusivity}\n\n`;
  }

  const terminationSection = hasExclusivity ? "6" : "5";
  contract += `${terminationSection}. TERM & TERMINATION\n\n`;
  contract += `This Agreement begins upon execution and continues until terminated by either party. `;
  if (terminationNoticePeriodText) {
    contract += `Either party may terminate this Agreement with ${terminationNoticePeriodText} written notice. `;
  } else {
    contract += `Either party may terminate this Agreement with thirty (30) days written notice. `;
  }
  contract += `Upon termination, ${creatorRoleLabel} shall receive payment for all commissions earned up to the termination date.\n\n`;

  const liabilitySection = hasExclusivity ? "7" : "6";
  contract += `${liabilitySection}. LIABILITY & COMPLIANCE\n\n`;
  contract += `${creatorRoleLabel} is an independent contractor and not an employee of ${counterpartyRoleLabel}. ${creatorRoleLabel} agrees to comply with all applicable laws and regulations, including FTC disclosure requirements. `;
  contract += `${counterpartyRoleLabel} is not liable for any claims arising from ${creatorRoleLabel}'s promotional activities beyond the scope of this Agreement.\n\n`;

  const governingSection = hasExclusivity ? "8" : "7";
  contract += `${governingSection}. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall be resolved through good-faith negotiation, mediation, or arbitration.\n\n`;

  const miscSection = hasExclusivity ? "9" : "8";
  contract += `${miscSection}. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties. Modifications must be made in writing and signed by both parties.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * SERVICE PROVIDER CONTRACT
 */
function generateServiceProviderContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Service Provider",
    counterpartyName,
    counterpartyRoleLabel = "Client",
    projectTitle,
    projectDescription,
    includedRevisions,
    hasCompensation,
    feeAmount,
    feeType,
    currency,
    paymentSchedule,
    terminationNoticePeriodText,
    governingLawRegion = "California",
  } = form;

  let contract = `SERVICE PROVIDER AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Service Provider Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `${creatorRoleLabel} agrees to provide professional services to ${counterpartyRoleLabel} as an independent contractor. `;
  contract += `This Agreement establishes the scope of services, compensation terms, and responsibilities of both parties.\n\n`;

  contract += `2. SCOPE OF SERVICES\n\n`;
  if (projectTitle) {
    contract += `Project: ${projectTitle}. `;
  }
  const expandedServices = expandDeliverableType(projectDescription, creatorRoleLabel, counterpartyRoleLabel);
  contract += `${expandedServices} `;
  
  contract += `${creatorRoleLabel} agrees to perform services in a professional and timely manner, adhering to industry standards and ${counterpartyRoleLabel}'s reasonable specifications. ${counterpartyRoleLabel} agrees to provide all necessary materials, access, and information required for ${creatorRoleLabel} to complete the services.\n\n`;

  contract += `3. COMPENSATION & PAYMENT TERMS\n\n`;
  if (hasCompensation && feeAmount) {
    if (feeType === "flat") {
      contract += `${counterpartyRoleLabel} agrees to pay ${creatorRoleLabel} a flat fee of ${formatCurrency(feeAmount, currency)} for the services outlined in this Agreement. `;
    } else if (feeType === "hourly") {
      contract += `${counterpartyRoleLabel} agrees to pay ${creatorRoleLabel} an hourly rate of ${formatCurrency(feeAmount, currency)} per hour for services rendered. `;
    } else if (feeType === "per_deliverable") {
      contract += `${counterpartyRoleLabel} agrees to pay ${creatorRoleLabel} ${formatCurrency(feeAmount, currency)} per deliverable as outlined in this Agreement. `;
    } else {
      contract += `${counterpartyRoleLabel} agrees to compensate ${creatorRoleLabel} ${formatCurrency(feeAmount, currency)} for services rendered. `;
    }
    
    if (paymentSchedule) {
      contract += `Payment schedule: ${paymentSchedule}. `;
    } else {
      contract += `Payment is due within fifteen (15) days of invoice submission. `;
    }
    
    contract += `Late payments may incur a fee of 1.5% per month or the maximum allowed by law. ${creatorRoleLabel} reserves the right to suspend services until outstanding invoices are paid in full.\n\n`;
  } else {
    const expandedComp = expandCompensation(hasCompensation, feeAmount, currency, creatorRoleLabel, counterpartyRoleLabel);
    contract += `${expandedComp}\n\n`;
  }

  if (includedRevisions !== undefined) {
    contract += `4. REVISIONS & CHANGES\n\n`;
    if (includedRevisions === 0) {
      contract += `This Agreement does not include revisions. All deliverables are provided as-is, and any requested changes will be subject to additional fees as agreed upon by both parties. `;
    } else if (includedRevisions === -1) {
      contract += `This Agreement includes unlimited revisions within the scope of the original project. ${counterpartyRoleLabel} may request changes to deliverables, and ${creatorRoleLabel} will accommodate reasonable revision requests. `;
    } else {
      contract += `This Agreement includes up to ${includedRevisions} rounds of revisions. Additional revisions beyond this limit may be subject to additional fees as agreed upon by both parties. `;
    }
    contract += `Revisions must be requested within a reasonable timeframe and must not fundamentally alter the scope of the original project.\n\n`;
  }

  const ownershipSection = includedRevisions !== undefined ? "5" : "4";
  contract += `${ownershipSection}. OWNERSHIP & RIGHTS\n\n`;
  contract += `Upon full payment, ${counterpartyRoleLabel} shall own all rights, title, and interest in the final deliverables created under this Agreement. `;
  contract += `${creatorRoleLabel} retains the right to use the work in their portfolio and promotional materials unless otherwise agreed. `;
  contract += `${creatorRoleLabel} represents that all work is original or properly licensed and does not infringe on any third-party intellectual property rights.\n\n`;

  const terminationSection = includedRevisions !== undefined ? "6" : "5";
  contract += `${terminationSection}. TERM & TERMINATION\n\n`;
  contract += `This Agreement begins upon execution and continues until all services have been completed and payment has been made. `;
  
  if (terminationNoticePeriodText) {
    contract += `Either party may terminate this Agreement with ${terminationNoticePeriodText} written notice. `;
  } else {
    contract += `Either party may terminate this Agreement with seven (7) days written notice. `;
  }
  
  contract += `In the event of termination, ${creatorRoleLabel} shall be compensated for all work completed up to the termination date. ${counterpartyRoleLabel} shall have the right to use any completed work upon payment.\n\n`;

  const liabilitySection = includedRevisions !== undefined ? "7" : "6";
  contract += `${liabilitySection}. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `${creatorRoleLabel}'s liability under this Agreement is limited to the total amount paid by ${counterpartyRoleLabel} for the services. `;
  contract += `${creatorRoleLabel} is not liable for any indirect, incidental, or consequential damages arising from the services provided. `;
  contract += `Each party agrees to indemnify the other from claims arising from their own actions or breach of this Agreement.\n\n`;

  const governingSection = includedRevisions !== undefined ? "8" : "7";
  contract += `${governingSection}. GOVERNING LAW & DISPUTE RESOLUTION\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Any disputes shall first be resolved through good-faith negotiation. If unresolved, disputes may be submitted to mediation or arbitration as mutually agreed.\n\n`;

  const miscSection = includedRevisions !== undefined ? "9" : "8";
  contract += `${miscSection}. MISCELLANEOUS\n\n`;
  contract += `${creatorRoleLabel} is an independent contractor and not an employee of ${counterpartyRoleLabel}. This Agreement constitutes the entire understanding between the parties. Any modifications must be made in writing and signed by both parties.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * REVENUE SHARE CONTRACT
 */
function generateRevenueShareContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Creator",
    counterpartyName,
    counterpartyRoleLabel = "Partner",
    projectTitle,
    projectDescription,
    revenueSplitDescription,
    revenueSourcesText,
    paymentSchedule,
    hasExclusivity,
    exclusivityScope,
    exclusivityDuration,
    terminationNoticePeriodText,
    governingLawRegion = "California",
  } = form;

  let contract = `REVENUE SHARE AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Revenue Share Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `The parties agree to collaborate on a revenue-generating project and share profits according to the terms outlined herein. `;
  contract += `This Agreement establishes each party's responsibilities, revenue split, and the terms governing the partnership.\n\n`;

  contract += `2. PROJECT SCOPE & RESPONSIBILITIES\n\n`;
  if (projectTitle) {
    contract += `Project: ${projectTitle}. `;
  }
  if (projectDescription) {
    contract += `${projectDescription} `;  } else {
    contract += `The parties agree to collaborate on a joint project as mutually defined. `;
  }
  
  contract += `Each party agrees to contribute their respective skills, resources, and efforts to the success of the project. Specific responsibilities shall be determined by mutual agreement and may evolve as the project progresses. Both parties commit to acting in good faith and maintaining open communication throughout the collaboration.\n\n`;

  contract += `3. REVENUE SHARE & PAYMENT TERMS\n\n`;
  if (revenueSplitDescription) {
    contract += `Revenue split: ${revenueSplitDescription}. `;
  } else {
    contract += `Revenue shall be split equally (50/50) between ${creatorRoleLabel} and ${counterpartyRoleLabel} unless otherwise agreed in writing. `;
  }
  
  if (revenueSourcesText) {
    contract += `Revenue sources include: ${revenueSourcesText}. `;
  } else {
    contract += `Revenue includes all income generated from the project, including but not limited to sales, sponsorships, advertising, and licensing fees. `;
  }
  
  contract += `Net revenue is defined as gross revenue minus reasonable business expenses directly related to the project, including platform fees, production costs, and marketing expenses. `;
  
  if (paymentSchedule) {
    contract += `Revenue distributions shall be made according to the following schedule: ${paymentSchedule}. `;
  } else {
    contract += `Revenue distributions shall be made monthly, within fifteen (15) days following the end of each month. `;
  }
  
  contract += `Each party shall have the right to review financial records related to the project upon reasonable notice.\n\n`;

  contract += `4. OWNERSHIP & INTELLECTUAL PROPERTY\n\n`;
  contract += `All intellectual property created as part of this collaboration shall be jointly owned by ${creatorRoleLabel} and ${counterpartyRoleLabel} unless otherwise agreed in writing. `;
  contract += `Neither party may license, sell, or transfer their ownership interest without the written consent of the other party. `;
  contract += `Each party retains ownership of any pre-existing intellectual property they contribute to the project and grants the partnership a license to use such property for the duration of this Agreement.\n\n`;

  if (hasExclusivity) {
    contract += `5. EXCLUSIVITY\n\n`;
    const expandedExclusivity = expandExclusivity(hasExclusivity, exclusivityScope, exclusivityDuration, creatorRoleLabel, counterpartyRoleLabel);
    contract += `${expandedExclusivity}\n\n`;
  }

  const terminationSection = hasExclusivity ? "6" : "5";
  contract += `${terminationSection}. TERM & TERMINATION\n\n`;
  contract += `This Agreement begins upon execution and continues until terminated by either party. `;
  
  if (terminationNoticePeriodText) {
    contract += `Either party may terminate this Agreement with ${terminationNoticePeriodText} written notice. `;
  } else {
    contract += `Either party may terminate this Agreement with thirty (30) days written notice. `;
  }
  
  contract += `Upon termination, both parties shall continue to receive their respective share of revenue from any content or products created during the term of this Agreement. The parties agree to work together in good faith to wind down the partnership and settle any outstanding financial obligations.\n\n`;

  const liabilitySection = hasExclusivity ? "7" : "6";
  contract += `${liabilitySection}. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `Each party agrees to indemnify and hold harmless the other party from any claims, damages, or liabilities arising from their own actions or content contributed to the project. `;
  contract += `Neither party shall be liable for indirect, incidental, or consequential damages arising from this Agreement. `;
  contract += `Both parties represent that they have the authority to enter into this Agreement and that their contributions do not infringe on any third-party rights.\n\n`;

  const governingSection = hasExclusivity ? "8" : "7";
  contract += `${governingSection}. GOVERNING LAW & DISPUTE RESOLUTION\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Any disputes arising under this Agreement shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes may be submitted to mediation or binding arbitration as mutually agreed by both parties.\n\n`;

  const miscSection = hasExclusivity ? "9" : "8";
  contract += `${miscSection}. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements. Any modifications must be made in writing and signed by both parties. If any provision is found unenforceable, the remaining provisions shall continue in full force and effect.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * COLLABORATION CONTRACT
 */
function generateCollabContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Creator",
    counterpartyName,
    counterpartyRoleLabel = "Collaborator",
    projectTitle,
    projectDescription,
    scheduleDescription,
    contentOwner,
    hasCompensation,
    feeAmount,
    currency,
    paymentSchedule,
    terminationNoticePeriodText,
    governingLawRegion = "California",
  } = form;

  let contract = `COLLABORATION AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Collaboration Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `The parties agree to collaborate on a creative project and establish the terms governing their partnership, including responsibilities, ownership, and compensation. `;
  contract += `This Agreement ensures both parties understand their roles and obligations throughout the collaboration.\n\n`;

  contract += `2. PROJECT SCOPE\n\n`;
  if (projectTitle) {
    contract += `Project: ${projectTitle}. `;
  }
  if (projectDescription) {
    contract += `${projectDescription} `;
  } else {
    contract += `The parties agree to collaborate on a creative project as mutually defined. `;
  }
  contract += `Both parties commit to contributing their skills, creativity, and resources to ensure the project's success. The scope of work may be adjusted by mutual written agreement as the project evolves.\n\n`;

  contract += `3. RESPONSIBILITIES\n\n`;
  if (scheduleDescription) {
    contract += `${scheduleDescription} `;  } else {
    contract += `Each party's responsibilities shall be mutually agreed upon and may include content creation, editing, promotion, and other tasks necessary for project completion. `;  }
  contract += `Both parties agree to communicate openly, meet deadlines, and act in good faith throughout the collaboration. If either party is unable to fulfill their responsibilities, they agree to notify the other party promptly to discuss adjustments.\n\n`;

  contract += `4. CONTENT OWNERSHIP\n\n`;
  if (contentOwner === "joint") {
    contract += `All content created as part of this collaboration shall be jointly owned by ${creatorRoleLabel} and ${counterpartyRoleLabel}. Neither party may use, license, or distribute the content without the other party's written consent. `;
  } else if (contentOwner === "creator") {
    contract += `${creatorRoleLabel} shall retain full ownership of all content created under this Agreement. ${counterpartyRoleLabel} is granted a non-exclusive license to use the content for mutually agreed purposes. `;
  } else if (contentOwner === "client") {
    contract += `${counterpartyRoleLabel} shall own all rights to the content created under this Agreement. ${creatorRoleLabel} grants ${counterpartyRoleLabel} full ownership upon project completion. `;
  } else {
    contract += `Content ownership shall be jointly held by both parties unless otherwise agreed in writing. `;
  }
  contract += `Each party retains the right to use the content for portfolio and promotional purposes unless restricted by mutual agreement.\n\n`;

  contract += `5. COMPENSATION\n\n`;
  const expandedCompensation = expandCompensation(hasCompensation, feeAmount, currency, creatorRoleLabel, counterpartyRoleLabel);
  contract += `${expandedCompensation} `;
  if (hasCompensation && paymentSchedule) {
    contract += `Payment schedule: ${paymentSchedule}. `;
  } else if (hasCompensation && feeAmount) {
    contract += `Payment shall be made upon project completion and approval. `;
  }
  if (hasCompensation) {
    contract += `All payments are non-refundable once work has been completed and delivered.\n\n`;
  } else {
    contract += `\n\n`;
  }

  contract += `6. TERM & TERMINATION\n\n`;
  contract += `This Agreement begins upon execution and continues until the project is completed or terminated by either party. `;
  if (terminationNoticePeriodText) {
    contract += `Either party may terminate this Agreement with ${terminationNoticePeriodText} written notice. `;
  } else {
    contract += `Either party may terminate this Agreement with seven (7) days written notice. `;
  }
  contract += `Upon termination, both parties shall retain rights to any work they individually created, and jointly created work shall remain jointly owned unless otherwise agreed.\n\n`;

  contract += `7. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `Each party agrees to indemnify the other from claims arising from their own actions or content. Both parties represent that their contributions are original or properly licensed and do not infringe on third-party rights. Neither party shall be liable for indirect or consequential damages arising from this Agreement.\n\n`;

  contract += `8. GOVERNING LAW & DISPUTE RESOLUTION\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall first be resolved through good-faith negotiation. If unresolved, disputes may be submitted to mediation or arbitration as mutually agreed.\n\n`;

  contract += `9. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties. Any modifications must be made in writing and signed by both parties. If any provision is found unenforceable, the remaining provisions shall continue in effect.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

// Continuing in next part due to length...
/**
 * MODEL RELEASE CONTRACT
 */
function generateModelReleaseContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Photographer",
    counterpartyName: releasee = "Model",
    projectDescription,
    allowedUsesText,
    hasCompensation,
    feeAmount,
    currency,
    governingLawRegion = "California",
  } = form;

  let contract = `MODEL RELEASE AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Model Release Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${releasee} ("Model"). `;
  contract += `Model grants ${creatorRoleLabel} the right to use photographs, videos, or other media featuring Model's likeness for the purposes outlined herein. `;
  contract += `This Agreement establishes the scope of permitted uses, compensation, and rights of both parties.\n\n`;

  contract += `2. GRANT OF RIGHTS\n\n`;
  if (projectDescription) {
    contract += `Media description: ${projectDescription}. `;
  } else {
    contract += `Model grants ${creatorRoleLabel} the right to use all photographs, videos, and other media captured during the session. `;
  }
  
  const expandedUsageRights = expandUsageRights(allowedUsesText, undefined, "Model", creatorRoleLabel);
  contract += `${expandedUsageRights} `;
  
  contract += `Model waives any right to inspect or approve the finished media or any written copy that may be used in connection with the media. Model releases ${creatorRoleLabel} from any claims arising from the use of the media in accordance with this Agreement.\n\n`;

  contract += `3. COMPENSATION\n\n`;
  const expandedCompensation = expandCompensation(hasCompensation, feeAmount, currency, "Model", creatorRoleLabel);
  contract += `${expandedCompensation}\n\n`;

  contract += `4. WARRANTIES & REPRESENTATIONS\n\n`;
  contract += `Model represents that they are of legal age and have the full right and authority to enter into this Agreement. Model warrants that the grant of rights does not conflict with any existing agreements or obligations. `;
  contract += `${creatorRoleLabel} represents that the media will be used in a lawful and professional manner.\n\n`;

  contract += `5. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `Model agrees to indemnify ${creatorRoleLabel} from any claims arising from Model's breach of this Agreement. ${creatorRoleLabel} agrees to indemnify Model from claims arising from ${creatorRoleLabel}'s unlawful or defamatory use of the media.\n\n`;

  contract += `6. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall be resolved through good-faith negotiation, mediation, or arbitration.\n\n`;

  contract += `7. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties. Modifications must be made in writing and signed by both parties. This release is binding upon Model's heirs, legal representatives, and assigns.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * GUEST APPEARANCE RELEASE CONTRACT
 */
function generateGuestReleaseContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Creator",
    counterpartyName: guestName = "Guest",
    projectDescription,
    allowedUsesText,
    hasCompensation,
    feeAmount,
    currency,
    governingLawRegion = "California",
  } = form;

  let contract = `GUEST APPEARANCE RELEASE AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Guest Appearance Release Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${guestName} ("Guest"). `;
  contract += `Guest grants ${creatorRoleLabel} the right to use Guest's appearance, voice, likeness, and contributions in ${creatorRoleLabel}'s content. `;
  contract += `This Agreement establishes the scope of permitted uses, compensation, and rights of both parties.\n\n`;

  contract += `2. GRANT OF RIGHTS\n\n`;
  if (projectDescription) {
    contract += `Content description: ${projectDescription}. `;
  } else {
    contract += `Guest grants ${creatorRoleLabel} the right to use all content featuring Guest's appearance, voice, and contributions. `;
  }
  
  const expandedUsageRights = expandUsageRights(allowedUsesText, undefined, "Guest", creatorRoleLabel);
  contract += `${expandedUsageRights} `;
  
  contract += `Guest waives any right to inspect or approve the final content before publication. Guest releases ${creatorRoleLabel} from any claims arising from the use of Guest's appearance in accordance with this Agreement.\n\n`;

  contract += `3. COMPENSATION\n\n`;
  const expandedCompensation = expandCompensation(hasCompensation, feeAmount, currency, "Guest", creatorRoleLabel);
  contract += `${expandedCompensation}\n\n`;

  contract += `4. WARRANTIES & REPRESENTATIONS\n\n`;
  contract += `Guest represents that they have the full right and authority to enter into this Agreement and that their appearance does not violate any existing agreements. `;
  contract += `${creatorRoleLabel} represents that the content will be used in a lawful and professional manner and will not be used in a defamatory or misleading context.\n\n`;

  contract += `5. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `Guest agrees to indemnify ${creatorRoleLabel} from claims arising from Guest's breach of this Agreement or any content provided by Guest. ${creatorRoleLabel} agrees to indemnify Guest from claims arising from ${creatorRoleLabel}'s unlawful use of the content.\n\n`;

  contract += `6. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall be resolved through good-faith negotiation, mediation, or arbitration.\n\n`;

  contract += `7. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties. Modifications must be made in writing and signed by both parties.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * LOCATION RELEASE CONTRACT
 */
function generateLocationReleaseContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Creator",
    counterpartyName: propertyOwner = "Property Owner",
    projectDescription,
    allowedUsesText,
    hasCompensation,
    feeAmount,
    currency,
    governingLawRegion = "California",
  } = form;

  let contract = `LOCATION RELEASE AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Location Release Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${propertyOwner} ("Property Owner"). `;
  contract += `Property Owner grants ${creatorRoleLabel} permission to use their property for filming, photography, or content creation purposes. `;
  contract += `This Agreement establishes the terms of use, compensation, and responsibilities of both parties.\n\n`;

  contract += `2. GRANT OF PERMISSION\n\n`;
  if (projectDescription) {
    contract += `Location description: ${projectDescription}. `;
  } else {
    contract += `Property Owner grants ${creatorRoleLabel} permission to access and use the property for content creation purposes. `;
  }
  
  const expandedUsageRights = expandUsageRights(allowedUsesText, undefined, "Property Owner", creatorRoleLabel);
  contract += `${expandedUsageRights} `;
  
  contract += `Property Owner waives any right to inspect or approve the final content featuring the property. Property Owner releases ${creatorRoleLabel} from any claims arising from the use of the property in accordance with this Agreement.\n\n`;

  contract += `3. COMPENSATION\n\n`;
  const expandedCompensation = expandCompensation(hasCompensation, feeAmount, currency, "Property Owner", creatorRoleLabel);
  contract += `${expandedCompensation}\n\n`;

  contract += `4. CREATOR RESPONSIBILITIES\n\n`;
  contract += `${creatorRoleLabel} agrees to use the property in a respectful manner and to restore the property to its original condition upon completion of filming. ${creatorRoleLabel} shall be responsible for any damage caused to the property during the production. `;
  contract += `${creatorRoleLabel} agrees to comply with all applicable laws and regulations while on the property and to obtain any necessary permits or licenses.\n\n`;

  contract += `5. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `${creatorRoleLabel} agrees to indemnify Property Owner from any claims, damages, or liabilities arising from ${creatorRoleLabel}'s use of the property. Property Owner is not liable for any injuries or damages sustained by ${creatorRoleLabel} or their crew while on the property, except in cases of Property Owner's gross negligence.\n\n`;

  contract += `6. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall be resolved through good-faith negotiation, mediation, or arbitration.\n\n`;

  contract += `7. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties. Modifications must be made in writing and signed by both parties.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * CONTRIBUTOR RELEASE CONTRACT
 */
function generateContributorReleaseContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Creator",
    counterpartyName: contributorName = "Contributor",
    projectDescription,
    allowedUsesText,
    hasCompensation,
    feeAmount,
    currency,
    governingLawRegion = "California",
  } = form;

  let contract = `CONTRIBUTOR RELEASE AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Contributor Release Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${contributorName} ("Contributor"). `;
  contract += `Contributor grants ${creatorRoleLabel} the right to use Contributor's submissions, ideas, or contributions in ${creatorRoleLabel}'s content. `;
  contract += `This Agreement establishes the scope of permitted uses, compensation, and rights of both parties.\n\n`;

  contract += `2. GRANT OF RIGHTS\n\n`;
  if (projectDescription) {
    contract += `Contribution description: ${projectDescription}. `;
  } else {
    contract += `Contributor grants ${creatorRoleLabel} the right to use all submissions, ideas, feedback, or other contributions provided by Contributor. `;
  }
  
  const expandedUsageRights = expandUsageRights(allowedUsesText, undefined, "Contributor", creatorRoleLabel);
  contract += `${expandedUsageRights} `;
  
  contract += `Contributor waives any right to inspect or approve the final content incorporating their contributions. Contributor releases ${creatorRoleLabel} from any claims arising from the use of the contributions in accordance with this Agreement.\n\n`;

  contract += `3. COMPENSATION\n\n`;
  const expandedCompensation = expandCompensation(hasCompensation, feeAmount, currency, "Contributor", creatorRoleLabel);
  contract += `${expandedCompensation}\n\n`;

  contract += `4. WARRANTIES & REPRESENTATIONS\n\n`;
  contract += `Contributor represents that all contributions are original or properly licensed and do not infringe on any third-party rights. Contributor warrants that they have the full right and authority to grant the rights outlined in this Agreement. `;
  contract += `${creatorRoleLabel} represents that the contributions will be used in a lawful and professional manner.\n\n`;

  contract += `5. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `Contributor agrees to indemnify ${creatorRoleLabel} from any claims arising from Contributor's breach of the warranties provided in this Agreement. ${creatorRoleLabel} agrees to indemnify Contributor from claims arising from ${creatorRoleLabel}'s unlawful use of the contributions.\n\n`;

  contract += `6. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall be resolved through good-faith negotiation, mediation, or arbitration.\n\n`;

  contract += `7. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties. Modifications must be made in writing and signed by both parties.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * ONE-WAY NDA CONTRACT
 */
function generateOneWayNDAContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Disclosing Party",
    counterpartyName,
    counterpartyRoleLabel = "Receiving Party",
    projectDescription,
    licenseDurationText,
    terminationNoticePeriodText,
    governingLawRegion = "California",
  } = form;

  let contract = `NON-DISCLOSURE AGREEMENT (ONE-WAY)\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Non-Disclosure Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `${creatorRoleLabel} may disclose certain confidential information to ${counterpartyRoleLabel}, and this Agreement establishes the terms governing the protection and use of such confidential information.\n\n`;

  contract += `2. DEFINITION OF CONFIDENTIAL INFORMATION\n\n`;
  if (projectDescription) {
    contract += `Confidential information includes: ${projectDescription}. `;
  } else {
    contract += `Confidential information includes all non-public information disclosed by ${creatorRoleLabel} to ${counterpartyRoleLabel}, whether orally, in writing, or in any other form. `;
  }
  contract += `Confidential information includes, but is not limited to, business plans, financial information, customer data, trade secrets, proprietary processes, and any other information marked as confidential or that a reasonable person would understand to be confidential.\n\n`;

  contract += `3. OBLIGATIONS OF RECEIVING PARTY\n\n`;
  contract += `${counterpartyRoleLabel} agrees to hold all confidential information in strict confidence and not to disclose it to any third party without the prior written consent of ${creatorRoleLabel}. `;
  contract += `${counterpartyRoleLabel} shall use the confidential information solely for the purpose of evaluating or engaging in a business relationship with ${creatorRoleLabel}. `;
  contract += `${counterpartyRoleLabel} shall take reasonable measures to protect the confidential information, using at least the same degree of care as ${counterpartyRoleLabel} uses to protect their own confidential information.\n\n`;

  contract += `4. EXCEPTIONS\n\n`;
  contract += `The obligations of confidentiality do not apply to information that: (a) is or becomes publicly available through no breach of this Agreement; (b) was rightfully in ${counterpartyRoleLabel}'s possession prior to disclosure by ${creatorRoleLabel}; (c) is independently developed by ${counterpartyRoleLabel} without use of the confidential information; or (d) is required to be disclosed by law or court order, provided ${counterpartyRoleLabel} gives ${creatorRoleLabel} prompt notice of such requirement.\n\n`;

  contract += `5. TERM & TERMINATION\n\n`;
  if (licenseDurationText) {
    contract += `This Agreement shall remain in effect for ${licenseDurationText}. `;
  } else {
    contract += `This Agreement shall remain in effect for a period of three (3) years from the date of execution. `;
  }
  
  if (terminationNoticePeriodText) {
    contract += `Either party may terminate this Agreement with ${terminationNoticePeriodText} written notice. `;
  }
  
  contract += `The obligations of confidentiality shall survive termination of this Agreement and continue for the duration specified herein.\n\n`;

  contract += `6. REMEDIES\n\n`;
  contract += `${counterpartyRoleLabel} acknowledges that any breach of this Agreement may cause irreparable harm to ${creatorRoleLabel} for which monetary damages may be inadequate. ${creatorRoleLabel} shall be entitled to seek injunctive relief in addition to any other remedies available at law or in equity.\n\n`;

  contract += `7. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall be resolved through good-faith negotiation, mediation, or arbitration.\n\n`;

  contract += `8. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties regarding confidentiality. Modifications must be made in writing and signed by both parties. If any provision is found unenforceable, the remaining provisions shall continue in effect.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * MUTUAL NDA CONTRACT
 */
function generateMutualNDAContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Party A",
    counterpartyName,
    counterpartyRoleLabel = "Party B",
    projectDescription,
    licenseDurationText,
    terminationNoticePeriodText,
    governingLawRegion = "California",
  } = form;

  let contract = `MUTUAL NON-DISCLOSURE AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Mutual Non-Disclosure Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `Both parties may disclose confidential information to each other, and this Agreement establishes the terms governing the protection and use of such confidential information.\n\n`;

  contract += `2. DEFINITION OF CONFIDENTIAL INFORMATION\n\n`;
  if (projectDescription) {
    contract += `Confidential information includes: ${projectDescription}. `;
  } else {
    contract += `Confidential information includes all non-public information disclosed by either party to the other, whether orally, in writing, or in any other form. `;
  }
  contract += `Confidential information includes, but is not limited to, business plans, financial information, customer data, trade secrets, proprietary processes, and any other information marked as confidential or that a reasonable person would understand to be confidential.\n\n`;

  contract += `3. MUTUAL OBLIGATIONS\n\n`;
  contract += `Each party agrees to hold all confidential information received from the other party in strict confidence and not to disclose it to any third party without the prior written consent of the disclosing party. `;
  contract += `Each party shall use the confidential information solely for the purpose of evaluating or engaging in a business relationship. `;
  contract += `Each party shall take reasonable measures to protect the confidential information, using at least the same degree of care as they use to protect their own confidential information.\n\n`;

  contract += `4. EXCEPTIONS\n\n`;
  contract += `The obligations of confidentiality do not apply to information that: (a) is or becomes publicly available through no breach of this Agreement; (b) was rightfully in the receiving party's possession prior to disclosure; (c) is independently developed by the receiving party without use of the confidential information; or (d) is required to be disclosed by law or court order, provided the receiving party gives the disclosing party prompt notice of such requirement.\n\n`;

  contract += `5. TERM & TERMINATION\n\n`;
  if (licenseDurationText) {
    contract += `This Agreement shall remain in effect for ${licenseDurationText}. `;
  } else {
    contract += `This Agreement shall remain in effect for a period of three (3) years from the date of execution. `;
  }
  
  if (terminationNoticePeriodText) {
    contract += `Either party may terminate this Agreement with ${terminationNoticePeriodText} written notice. `;
  }
  
  contract += `The obligations of confidentiality shall survive termination of this Agreement and continue for the duration specified herein.\n\n`;

  contract += `6. REMEDIES\n\n`;
  contract += `Each party acknowledges that any breach of this Agreement may cause irreparable harm to the other party for which monetary damages may be inadequate. Either party shall be entitled to seek injunctive relief in addition to any other remedies available at law or in equity.\n\n`;

  contract += `7. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall be resolved through good-faith negotiation, mediation, or arbitration.\n\n`;

  contract += `8. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties regarding confidentiality. Modifications must be made in writing and signed by both parties. If any provision is found unenforceable, the remaining provisions shall continue in effect.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * TALENT MANAGEMENT CONTRACT
 */
function generateTalentManagementContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Talent",
    counterpartyName,
    counterpartyRoleLabel = "Manager",
    projectDescription,
    commissionStructure,
    paymentSchedule,
    hasExclusivity,
    exclusivityScope,
    exclusivityDuration,
    terminationNoticePeriodText,
    governingLawRegion = "California",
  } = form;

  let contract = `TALENT MANAGEMENT AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Talent Management Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `${creatorRoleLabel} engages ${counterpartyRoleLabel} to provide professional management services, including career guidance, business development, and representation. `;
  contract += `This Agreement establishes the scope of services, compensation, and responsibilities of both parties.\n\n`;

  contract += `2. SCOPE OF MANAGEMENT SERVICES\n\n`;
  if (projectDescription) {
    contract += `${projectDescription} `;
  } else {
    contract += `${counterpartyRoleLabel} agrees to provide professional management services to ${creatorRoleLabel}, including but not limited to career guidance, contract negotiation, business development, brand partnerships, and strategic planning. `;
  }
  contract += `${counterpartyRoleLabel} shall use reasonable efforts to advance ${creatorRoleLabel}'s career and secure opportunities consistent with ${creatorRoleLabel}'s goals and brand. ${counterpartyRoleLabel} shall act in ${creatorRoleLabel}'s best interests and maintain professional standards in all dealings.\n\n`;

  contract += `3. COMPENSATION & COMMISSION\n\n`;
  if (commissionStructure) {
    contract += `Commission structure: ${commissionStructure}. `;
  } else {
    contract += `${counterpartyRoleLabel} shall receive a commission on all income earned by ${creatorRoleLabel} during the term of this Agreement. The commission rate shall be as mutually agreed upon by both parties. `;
  }
  contract += `Commissions are calculated based on gross income before expenses unless otherwise agreed. ${counterpartyRoleLabel} is not entitled to commissions on income earned from opportunities secured by ${creatorRoleLabel} independently, unless ${counterpartyRoleLabel} provided substantial assistance.\n\n`;

  contract += `4. PAYMENT TERMS\n\n`;
  if (paymentSchedule) {
    contract += `Payment schedule: ${paymentSchedule}. `;
  } else {
    contract += `Commissions shall be paid monthly, within fifteen (15) days following the end of each month. `;
  }
  contract += `${counterpartyRoleLabel} shall provide ${creatorRoleLabel} with regular reports detailing income, commissions, and expenses. ${creatorRoleLabel} retains the right to audit ${counterpartyRoleLabel}'s records upon reasonable notice.\n\n`;

  if (hasExclusivity) {
    contract += `5. EXCLUSIVITY\n\n`;
    const expandedExclusivity = expandExclusivity(hasExclusivity, exclusivityScope, exclusivityDuration, creatorRoleLabel, counterpartyRoleLabel);
    contract += `${expandedExclusivity}\n\n`;
  }

  const terminationSection = hasExclusivity ? "6" : "5";
  contract += `${terminationSection}. TERM & TERMINATION\n\n`;
  contract += `This Agreement begins upon execution and continues until terminated by either party. `;
  if (terminationNoticePeriodText) {
    contract += `Either party may terminate this Agreement with ${terminationNoticePeriodText} written notice. `;
  } else {
    contract += `Either party may terminate this Agreement with ninety (90) days written notice. `;
  }
  contract += `Upon termination, ${counterpartyRoleLabel} shall continue to receive commissions on deals negotiated during the term of this Agreement, subject to a sunset period as mutually agreed.\n\n`;

  const liabilitySection = hasExclusivity ? "7" : "6";
  contract += `${liabilitySection}. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `${counterpartyRoleLabel} is an independent contractor and not an employee of ${creatorRoleLabel}. Each party agrees to indemnify the other from claims arising from their own actions or breach of this Agreement. `;
  contract += `${counterpartyRoleLabel} is not liable for the success or failure of ${creatorRoleLabel}'s career, but agrees to use reasonable efforts to advance ${creatorRoleLabel}'s interests.\n\n`;

  const governingSection = hasExclusivity ? "8" : "7";
  contract += `${governingSection}. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall be resolved through good-faith negotiation, mediation, or arbitration.\n\n`;

  const miscSection = hasExclusivity ? "9" : "8";
  contract += `${miscSection}. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties. Modifications must be made in writing and signed by both parties.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * JOINT VENTURE CONTRACT
 */
function generateJointVentureContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Party A",
    counterpartyName,
    counterpartyRoleLabel = "Party B",
    projectTitle,
    projectDescription,
    revenueSplitDescription,
    revenueSourcesText,
    paymentSchedule,
    terminationNoticePeriodText,
    governingLawRegion = "California",
  } = form;

  let contract = `JOINT VENTURE AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Joint Venture Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `The parties agree to collaborate on a joint business venture and share profits, losses, and responsibilities according to the terms outlined herein. `;
  contract += `This Agreement establishes the structure, governance, and financial terms of the joint venture.\n\n`;

  contract += `2. VENTURE SCOPE & OBJECTIVES\n\n`;
  if (projectTitle) {
    contract += `Venture name: ${projectTitle}. `;
  }
  if (projectDescription) {
    contract += `${projectDescription} `;
  } else {
    contract += `The parties agree to collaborate on a joint business venture as mutually defined. `;
  }
  contract += `The venture's objectives, target market, and strategic goals shall be determined by mutual agreement. Both parties commit to contributing their respective skills, resources, and expertise to ensure the venture's success.\n\n`;

  contract += `3. CONTRIBUTIONS & RESPONSIBILITIES\n\n`;
  contract += `Each party agrees to contribute resources, capital, expertise, or services as mutually agreed upon. Specific contributions and responsibilities shall be documented in writing and may be adjusted by mutual consent as the venture evolves. `;
  contract += `Both parties agree to act in good faith, maintain open communication, and make decisions collaboratively in the best interests of the joint venture.\n\n`;

  contract += `4. PROFIT & LOSS SHARING\n\n`;
  if (revenueSplitDescription) {
    contract += `Profit and loss split: ${revenueSplitDescription}. `;
  } else {
    contract += `Profits and losses shall be split equally (50/50) between ${creatorRoleLabel} and ${counterpartyRoleLabel} unless otherwise agreed in writing. `;
  }
  
  if (revenueSourcesText) {
    contract += `Revenue sources include: ${revenueSourcesText}. `;
  } else {
    contract += `Revenue includes all income generated from the joint venture, including sales, licensing fees, and other business activities. `;
  }
  
  contract += `Net profit is defined as gross revenue minus reasonable business expenses directly related to the venture. `;
  
  if (paymentSchedule) {
    contract += `Profit distributions shall be made according to the following schedule: ${paymentSchedule}. `;
  } else {
    contract += `Profit distributions shall be made quarterly, within fifteen (15) days following the end of each quarter. `;
  }
  
  contract += `Each party shall have the right to review financial records related to the venture upon reasonable notice.\n\n`;

  contract += `5. DECISION MAKING & GOVERNANCE\n\n`;
  contract += `Major decisions affecting the joint venture shall require unanimous consent of both parties. Major decisions include, but are not limited to, significant capital expenditures, changes to the business model, hiring key personnel, and entering into material contracts. `;
  contract += `Day-to-day operational decisions may be made by either party within the scope of their responsibilities, provided such decisions do not materially affect the venture's direction or financial position.\n\n`;

  contract += `6. INTELLECTUAL PROPERTY\n\n`;
  contract += `All intellectual property created as part of the joint venture shall be jointly owned by ${creatorRoleLabel} and ${counterpartyRoleLabel} unless otherwise agreed in writing. `;
  contract += `Neither party may license, sell, or transfer their ownership interest without the written consent of the other party. Each party retains ownership of any pre-existing intellectual property they contribute to the venture.\n\n`;

  contract += `7. TERM & TERMINATION\n\n`;
  contract += `This Agreement begins upon execution and continues until terminated by either party or until the venture's objectives have been achieved. `;
  if (terminationNoticePeriodText) {
    contract += `Either party may terminate this Agreement with ${terminationNoticePeriodText} written notice. `;
  } else {
    contract += `Either party may terminate this Agreement with ninety (90) days written notice. `;
  }
  contract += `Upon termination, the parties agree to work together in good faith to wind down the venture, settle outstanding obligations, and distribute remaining assets according to the profit-sharing ratio.\n\n`;

  contract += `8. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `Each party agrees to indemnify the other from claims arising from their own actions or breach of this Agreement. Neither party shall be liable for indirect, incidental, or consequential damages arising from this Agreement. `;
  contract += `Both parties represent that they have the authority to enter into this Agreement and that their contributions do not infringe on any third-party rights.\n\n`;

  contract += `9. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall be resolved through good-faith negotiation, mediation, or binding arbitration.\n\n`;

  contract += `10. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties. Modifications must be made in writing and signed by both parties. If any provision is found unenforceable, the remaining provisions shall continue in effect.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * GIVEAWAY RULES CONTRACT
 */
function generateGiveawayRulesContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Sponsor",
    projectDescription,
    startDate,
    endDateOrOngoing,
    governingLawRegion = "California",
  } = form;

  let contract = `GIVEAWAY OFFICIAL RULES\n\n`;

  contract += `1. SPONSOR & ELIGIBILITY\n\n`;
  contract += `This giveaway (the "Giveaway") is sponsored by ${creatorName} ("${creatorRoleLabel}"). `;
  contract += `The Giveaway is open to legal residents who are 18 years of age or older at the time of entry. Employees of ${creatorRoleLabel} and their immediate family members are not eligible to participate. `;
  contract += `Void where prohibited by law. By entering, participants agree to be bound by these Official Rules and the decisions of ${creatorRoleLabel}, which are final and binding.\n\n`;

  contract += `2. GIVEAWAY PERIOD\n\n`;
  if (startDate && endDateOrOngoing) {
    contract += `The Giveaway begins on ${formatDate(startDate)} and ends on ${formatDate(endDateOrOngoing)}. `;
  } else if (startDate) {
    contract += `The Giveaway begins on ${formatDate(startDate)} and continues until ${creatorRoleLabel} announces the end date. `;
  } else {
    contract += `The Giveaway period shall be announced by ${creatorRoleLabel} and will run for a specified duration. `;
  }
  contract += `All entries must be received by the end of the Giveaway period to be eligible. ${creatorRoleLabel} reserves the right to extend, modify, or terminate the Giveaway at any time without prior notice.\n\n`;

  contract += `3. HOW TO ENTER\n\n`;
  if (projectDescription) {
    contract += `${projectDescription} `;
  } else {
    contract += `To enter the Giveaway, participants must follow the entry instructions provided by ${creatorRoleLabel}. Entry methods may include, but are not limited to, commenting on a post, sharing content, subscribing to a channel, or submitting a form. `;
  }
  contract += `Limit one entry per person unless otherwise specified. Multiple entries from the same person using different accounts or identities will be disqualified. ${creatorRoleLabel} is not responsible for lost, late, incomplete, or misdirected entries.\n\n`;

  contract += `4. WINNER SELECTION & NOTIFICATION\n\n`;
  contract += `Winner(s) will be selected randomly from all eligible entries received during the Giveaway period. The selection will be conducted by ${creatorRoleLabel} or a designated representative. `;
  contract += `Winner(s) will be notified via the contact information provided at the time of entry. Winner(s) must respond within seven (7) days of notification to claim their prize. Failure to respond within this timeframe may result in forfeiture of the prize and selection of an alternate winner.\n\n`;

  contract += `5. PRIZE & DELIVERY\n\n`;
  contract += `The prize(s) will be as described by ${creatorRoleLabel} at the time of the Giveaway announcement. Prizes are awarded "as is" with no warranty or guarantee, express or implied. `;
  contract += `${creatorRoleLabel} is not responsible for any taxes, fees, or other costs associated with prize acceptance or use. Winner(s) are solely responsible for all applicable taxes. `;
  contract += `Prizes are non-transferable and may not be substituted or exchanged for cash. ${creatorRoleLabel} reserves the right to substitute a prize of equal or greater value if the advertised prize becomes unavailable.\n\n`;

  contract += `6. GENERAL CONDITIONS\n\n`;
  contract += `By entering, participants agree to release and hold harmless ${creatorRoleLabel} from any liability, loss, or damage arising from participation in the Giveaway or acceptance of any prize. `;
  contract += `${creatorRoleLabel} reserves the right to disqualify any participant who violates these Official Rules, tampers with the entry process, or acts in an unsportsmanlike or disruptive manner. `;
  contract += `Winner(s) may be required to sign an affidavit of eligibility and liability release. ${creatorRoleLabel} may use winner names and likenesses for promotional purposes without additional compensation.\n\n`;

  contract += `7. PRIVACY & DATA USE\n\n`;
  contract += `Personal information collected during the Giveaway will be used solely for the purpose of administering the Giveaway and notifying winners. ${creatorRoleLabel} will not sell or share participant information with third parties except as required by law.\n\n`;

  contract += `8. GOVERNING LAW\n\n`;
  contract += `This Giveaway and these Official Rules shall be governed by the laws of ${governingLawRegion}. Any disputes arising from the Giveaway shall be resolved in accordance with the laws of ${governingLawRegion}.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * MODERATOR AGREEMENT CONTRACT
 */
function generateModeratorContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Creator",
    counterpartyName,
    counterpartyRoleLabel = "Moderator",
    projectDescription,
    hasCompensation,
    feeAmount,
    currency,
    paymentSchedule,
    terminationNoticePeriodText,
    governingLawRegion = "California",
  } = form;

  let contract = `COMMUNITY MODERATOR AGREEMENT\n\n`;

  contract += `1. PARTIES & PURPOSE\n\n`;
  contract += `This Community Moderator Agreement (the "Agreement") is entered into between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}"). `;
  contract += `${creatorRoleLabel} engages ${counterpartyRoleLabel} to provide community moderation services for ${creatorRoleLabel}'s online community, social media channels, or other platforms. `;
  contract += `This Agreement establishes the scope of responsibilities, compensation, and terms governing the moderator relationship.\n\n`;

  contract += `2. MODERATOR RESPONSIBILITIES\n\n`;
  if (projectDescription) {
    contract += `${projectDescription} `;
  } else {
    contract += `${counterpartyRoleLabel} agrees to moderate ${creatorRoleLabel}'s online community by enforcing community guidelines, responding to member inquiries, removing inappropriate content, and maintaining a positive and respectful environment. `;
  }
  contract += `${counterpartyRoleLabel} shall use reasonable judgment in applying community guidelines and shall escalate complex or sensitive issues to ${creatorRoleLabel} for guidance. ${counterpartyRoleLabel} agrees to act professionally, impartially, and in accordance with ${creatorRoleLabel}'s values and brand standards.\n\n`;

  contract += `3. COMPENSATION\n\n`;
  const expandedCompensation = expandCompensation(hasCompensation, feeAmount, currency, counterpartyRoleLabel, creatorRoleLabel);
  contract += `${expandedCompensation} `;
  if (hasCompensation && paymentSchedule) {
    contract += `Payment schedule: ${paymentSchedule}. `;
  } else if (hasCompensation && feeAmount) {
    contract += `Payment shall be made monthly based on hours worked or a flat monthly fee as agreed. `;
  }
  if (hasCompensation) {
    contract += `${counterpartyRoleLabel} shall submit invoices or time reports as required by ${creatorRoleLabel}.\n\n`;
  } else {
    contract += `\n\n`;
  }

  contract += `4. CONFIDENTIALITY & CONDUCT\n\n`;
  contract += `${counterpartyRoleLabel} agrees to maintain the confidentiality of all non-public information accessed during the course of moderation duties, including member data, private communications, and business information. `;
  contract += `${counterpartyRoleLabel} shall not use their moderator position for personal gain, favoritism, or any purpose other than fulfilling their responsibilities under this Agreement. `;
  contract += `${counterpartyRoleLabel} agrees to comply with all applicable laws and platform terms of service while performing moderation duties.\n\n`;

  contract += `5. TERM & TERMINATION\n\n`;
  contract += `This Agreement begins upon execution and continues until terminated by either party. `;
  if (terminationNoticePeriodText) {
    contract += `Either party may terminate this Agreement with ${terminationNoticePeriodText} written notice. `;
  } else {
    contract += `Either party may terminate this Agreement with seven (7) days written notice. `;
  }
  contract += `${creatorRoleLabel} reserves the right to terminate this Agreement immediately for cause, including but not limited to breach of confidentiality, abuse of moderator privileges, or conduct that damages ${creatorRoleLabel}'s reputation.\n\n`;

  contract += `6. LIABILITY & INDEMNIFICATION\n\n`;
  contract += `${counterpartyRoleLabel} is an independent contractor and not an employee of ${creatorRoleLabel}. ${counterpartyRoleLabel} agrees to indemnify ${creatorRoleLabel} from claims arising from ${counterpartyRoleLabel}'s actions or breach of this Agreement. `;
  contract += `${creatorRoleLabel} is not liable for any claims arising from ${counterpartyRoleLabel}'s moderation decisions made in good faith and in accordance with community guidelines.\n\n`;

  contract += `7. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}. Disputes shall be resolved through good-faith negotiation, mediation, or arbitration.\n\n`;

  contract += `8. MISCELLANEOUS\n\n`;
  contract += `This Agreement constitutes the entire understanding between the parties. Modifications must be made in writing and signed by both parties.\n\n`;

  contract += LEGAL_DISCLAIMER;
  return contract;
}

/**
 * GENERIC CONTRACT FALLBACK
 */
function generateGenericContract(form: CreatorContractForm): string {
  const {
    creatorName,
    creatorRoleLabel = "Creator",
    counterpartyName,
    counterpartyRoleLabel = "Client",
    governingLawRegion = "California",
  } = form;

  let contract = `CONTRACT AGREEMENT\n\n`;
  contract += `1. PARTIES\n\n`;
  contract += `This agreement is made between ${creatorName} ("${creatorRoleLabel}") and ${counterpartyName} ("${counterpartyRoleLabel}").\n\n`;
  contract += `2. TERMS\n\n`;
  contract += `The parties agree to the terms as mutually discussed and agreed upon.\n\n`;
  contract += `3. GOVERNING LAW\n\n`;
  contract += `This Agreement shall be governed by the laws of ${governingLawRegion}.\n\n`;
  contract += LEGAL_DISCLAIMER;
  
  return contract;
}
