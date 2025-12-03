export type ContractCategory =
  | "brand"
  | "creator_collab"
  | "service_provider"
  | "rights_release"
  | "business_ops"
  | "community";

export type ContractType =
  // brand
  | "brand_sponsorship"
  | "ugc_production"
  | "content_license"
  | "whitelisting_rights"
  | "affiliate_promo"
  // creator ↔ creator
  | "collab_single_project"
  | "co_creator_ongoing"
  | "revenue_share_project"
  // services
  | "service_editor"
  | "service_thumbnail_designer"
  | "service_clipper"
  | "service_channel_manager"
  // rights / releases
  | "model_release"
  | "guest_release"
  | "location_release"
  | "contributor_content_release"
  // business / ops
  | "talent_management"
  | "nda_one_way"
  | "nda_mutual"
  | "joint_project_jv"
  // community / audience
  | "giveaway_terms"
  | "community_moderator_agreement";

export type ContractTone = "casual" | "neutral" | "formal";

export type FeeType = "flat" | "per_deliverable" | "hourly" | "commission";
export type ContentOwner = "creator" | "client" | "joint";
export type LicenseType = "exclusive" | "non_exclusive" | "limited";

export interface CreatorContractForm {
  // Contract setup
  category: ContractCategory;
  contractType: ContractType;
  tone: ContractTone;
  
  // Parties
  creatorName: string;
  creatorRoleLabel: string;
  creatorCityState?: string;
  counterpartyName: string;
  counterpartyRoleLabel: string;
  
  // Project / Scope
  projectTitle?: string;
  projectDescription?: string;
  startDate?: string;
  endDateOrOngoing?: string;
  deliverableType?: string;
  deliverableCount?: number;
  platforms?: string;
  scheduleDescription?: string;
  
  // Compensation
  hasCompensation: boolean;
  currency?: string;
  feeType?: FeeType;
  feeAmount?: number;
  commissionStructure?: string;
  paymentSchedule?: string;
  bonusDetails?: string;
  
  // Rights & usage
  contentOwner?: ContentOwner;
  licenseType?: LicenseType;
  licenseDurationText?: string;
  allowedUsesText?: string;
  allowDerivatives?: boolean;
  
  // Revisions
  includedRevisions?: number;
  extraRevisionFeeText?: string;
  
  // Exclusivity
  hasExclusivity: boolean;
  exclusivityScope?: string;
  exclusivityDuration?: string;
  
  // Revenue share
  hasRevenueShare: boolean;
  revenueSourcesText?: string;
  revenueSplitDescription?: string;
  
  // Releases-specific
  releaseeName?: string;
  releaseeRole?: string;
  descriptionOfAppearanceOrContent?: string;
  
  // Giveaway-specific
  territoryText?: string;
  ageRestrictionsText?: string;
  giveawayStartDate?: string;
  giveawayEndDate?: string;
  prizeDescription?: string;
  winnerSelectionMethod?: string;
  approxPrizeValue?: string;
  
  // Moderator-specific
  moderatorDutiesText?: string;
  moderatorPerksOrCompensationText?: string;
  
  // Legal / termination
  terminationNoticePeriodText?: string;
  nonPaymentOrBreachConsequencesText?: string;
  governingLawRegion?: string;
  disputeResolutionText?: string;
}

export interface CategoryTemplate {
  label: string;
  templates: {
    value: ContractType;
    label: string;
  }[];
}

export const CATEGORY_TEMPLATES: Record<ContractCategory, CategoryTemplate> = {
  brand: {
    label: "Work with a brand",
    templates: [
      { value: "brand_sponsorship", label: "Sponsored content / brand deal" },
      { value: "ugc_production", label: "UGC / brand-owned content production" },
      { value: "content_license", label: "Content licensing (existing content)" },
      { value: "whitelisting_rights", label: "Whitelisting / paid media rights" },
      { value: "affiliate_promo", label: "Affiliate / performance-based promotion" },
    ],
  },
  creator_collab: {
    label: "Work with another creator",
    templates: [
      { value: "collab_single_project", label: "Single-project collaboration" },
      { value: "co_creator_ongoing", label: "Ongoing co-creator / co-host agreement" },
      { value: "revenue_share_project", label: "Revenue-share agreement for a project/channel" },
    ],
  },
  service_provider: {
    label: "Hire or manage a team member",
    templates: [
      { value: "service_editor", label: "Editor agreement" },
      { value: "service_thumbnail_designer", label: "Thumbnail / graphic designer agreement" },
      { value: "service_clipper", label: "Short-form clipper / repurposing agreement" },
      { value: "service_channel_manager", label: "Channel manager / VA / social media manager agreement" },
    ],
  },
  rights_release: {
    label: "Releases & permissions",
    templates: [
      { value: "model_release", label: "Model / talent release" },
      { value: "guest_release", label: "Guest / interview release" },
      { value: "location_release", label: "Location release" },
      { value: "contributor_content_release", label: "Contributor content release (fan/community submissions)" },
    ],
  },
  business_ops: {
    label: "Business & legal basics",
    templates: [
      { value: "talent_management", label: "Talent management / agent agreement" },
      { value: "nda_one_way", label: "NDA (one-way)" },
      { value: "nda_mutual", label: "NDA (mutual)" },
      { value: "joint_project_jv", label: "Joint project / joint venture agreement" },
    ],
  },
  community: {
    label: "Audience & community",
    templates: [
      { value: "giveaway_terms", label: "Giveaway / contest terms" },
      { value: "community_moderator_agreement", label: "Community moderator / staff agreement" },
    ],
  },
};

export interface UserPreset {
  creatorName: string;
  creatorRoleLabel: string;
  creatorCityState?: string;
  governingLawRegion?: string;
  defaultCurrency?: string;
}
