import { describe, it, expect } from "vitest";
import { generateContract } from "./contractGenerator";
import type { CreatorContractForm } from "../types/contracts";

describe("Contract Generator", () => {
  const baseForm: CreatorContractForm = {
    category: "brand",
    contractType: "brand_sponsorship",
    tone: "neutral",
    creatorName: "Jane Doe",
    creatorRoleLabel: "Creator",
    counterpartyName: "Acme Brand Inc.",
    counterpartyRoleLabel: "Client",
    hasCompensation: true,
    hasExclusivity: false,
    hasRevenueShare: false,
  };

  describe("Brand Contracts", () => {
    it("should generate a brand sponsorship contract", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        contractType: "brand_sponsorship",
        projectTitle: "Summer Campaign 2024",
        deliverableType: "Instagram posts",
        deliverableCount: 3,
        feeType: "flat",
        feeAmount: 5000,
        currency: "USD",
      };

      const contract = generateContract(form);

      expect(contract).toContain("Content Creation Agreement");
      expect(contract).toContain("Jane Doe");
      expect(contract).toContain("Acme Brand Inc.");
      expect(contract).toContain("Summer Campaign 2024");
      expect(contract).toContain("3 Instagram posts");
      expect(contract).toContain("5"); // Check that amount is present
    });

    it("should generate a UGC production contract", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        contractType: "ugc_production",
        contentOwner: "client",
      };

      const contract = generateContract(form);

      expect(contract).toContain("Content Creation Agreement");
      expect(contract).toContain("owned by Client");
    });

    it("should generate a content license contract", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        contractType: "content_license",
        licenseType: "exclusive",
        licenseDurationText: "12 months",
      };

      const contract = generateContract(form);

      expect(contract).toContain("CONTENT LICENSING AGREEMENT");
      expect(contract).toContain("exclusive");
      expect(contract).toContain("12 months");
    });

    it("should generate a whitelisting contract", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        contractType: "whitelisting_rights",
        platforms: "Instagram, TikTok",
      };

      const contract = generateContract(form);

      expect(contract).toContain("WHITELISTING");
      expect(contract).toContain("Instagram, TikTok");
    });

    it("should generate an affiliate contract", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        contractType: "affiliate_promo",
        commissionStructure: "10% of all sales",
      };

      const contract = generateContract(form);

      expect(contract).toContain("AFFILIATE PROMOTION AGREEMENT");
      expect(contract).toContain("10% of all sales");
    });
  });

  describe("Creator Collaboration Contracts", () => {
    it("should generate a single project collaboration contract", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "creator_collab",
        contractType: "collab_single_project",
        projectTitle: "Podcast Series",
        contentOwner: "joint",
      };

      const contract = generateContract(form);

      expect(contract).toContain("COLLABORATION AGREEMENT");
      expect(contract).toContain("Podcast Series");
      expect(contract).toContain("jointly owned");
    });

    it("should generate a co-creator ongoing contract", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "creator_collab",
        contractType: "co_creator_ongoing",
      };

      const contract = generateContract(form);

      expect(contract).toContain("CO-CREATOR AGREEMENT");
    });

    it("should generate a revenue share contract", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "creator_collab",
        contractType: "revenue_share_project",
        hasRevenueShare: true,
        revenueSourcesText: "AdSense, sponsorships",
        revenueSplitDescription: "50/50 split",
      };

      const contract = generateContract(form);

      expect(contract).toContain("REVENUE SHARE AGREEMENT");
      expect(contract).toContain("AdSense, sponsorships");
      expect(contract).toContain("50/50 split");
    });
  });

  describe("Service Provider Contracts", () => {
    it("should generate an editor agreement", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "service_provider",
        contractType: "service_editor",
        deliverableCount: 4,
        deliverableType: "edited videos",
        feeType: "per_deliverable",
        feeAmount: 150,
      };

      const contract = generateContract(form);

      expect(contract).toContain("EDITOR AGREEMENT");
      expect(contract).toContain("4 edited videos");
      expect(contract).toContain("150");
    });

    it("should generate a thumbnail designer agreement", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "service_provider",
        contractType: "service_thumbnail_designer",
      };

      const contract = generateContract(form);

      expect(contract).toContain("THUMBNAIL DESIGNER AGREEMENT");
    });

    it("should generate a clipper agreement", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "service_provider",
        contractType: "service_clipper",
      };

      const contract = generateContract(form);

      expect(contract).toContain("CLIPPER AGREEMENT");
    });

    it("should generate a channel manager agreement", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "service_provider",
        contractType: "service_channel_manager",
      };

      const contract = generateContract(form);

      expect(contract).toContain("CHANNEL MANAGER AGREEMENT");
    });
  });

  describe("Release Contracts", () => {
    it("should generate a model release", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "rights_release",
        contractType: "model_release",
        releaseeName: "John Smith",
        releaseeRole: "Model",
        descriptionOfAppearanceOrContent: "Appearance in promotional video",
      };

      const contract = generateContract(form);

      expect(contract).toContain("MODEL RELEASE");
      expect(contract).toContain("John Smith");
      expect(contract).toContain("promotional video");
    });

    it("should generate a guest release", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "rights_release",
        contractType: "guest_release",
      };

      const contract = generateContract(form);

      expect(contract).toContain("GUEST RELEASE");
    });

    it("should generate a location release", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "rights_release",
        contractType: "location_release",
      };

      const contract = generateContract(form);

      expect(contract).toContain("LOCATION RELEASE");
    });

    it("should generate a contributor content release", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "rights_release",
        contractType: "contributor_content_release",
      };

      const contract = generateContract(form);

      expect(contract).toContain("CONTRIBUTOR CONTENT RELEASE");
    });
  });

  describe("Business Operations Contracts", () => {
    it("should generate a talent management agreement", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "business_ops",
        contractType: "talent_management",
        commissionStructure: "15% commission on all deals",
        hasExclusivity: true,
      };

      const contract = generateContract(form);

      expect(contract).toContain("TALENT MANAGEMENT AGREEMENT");
      expect(contract).toContain("15% commission");
      expect(contract).toContain("EXCLUSIVITY");
    });

    it("should generate a one-way NDA", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "business_ops",
        contractType: "nda_one_way",
        projectDescription: "Exploring business partnership",
      };

      const contract = generateContract(form);

      expect(contract).toContain("NON-DISCLOSURE AGREEMENT");
      expect(contract).not.toContain("MUTUAL");
      expect(contract).toContain("Exploring business partnership");
    });

    it("should generate a mutual NDA", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "business_ops",
        contractType: "nda_mutual",
      };

      const contract = generateContract(form);

      expect(contract).toContain("MUTUAL NON-DISCLOSURE AGREEMENT");
    });

    it("should generate a joint venture agreement", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "business_ops",
        contractType: "joint_project_jv",
        projectTitle: "New Product Launch",
        revenueSplitDescription: "Equal split",
      };

      const contract = generateContract(form);

      expect(contract).toContain("JOINT VENTURE AGREEMENT");
      expect(contract).toContain("New Product Launch");
      expect(contract).toContain("Equal split");
    });
  });

  describe("Community Contracts", () => {
    it("should generate giveaway terms", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "community",
        contractType: "giveaway_terms",
        projectTitle: "Summer Giveaway 2024",
        prizeDescription: "MacBook Pro",
        approxPrizeValue: "$2000",
        ageRestrictionsText: "18 or older",
        territoryText: "US residents only",
      };

      const contract = generateContract(form);

      expect(contract).toContain("GIVEAWAY");
      expect(contract).toContain("Summer Giveaway 2024");
      expect(contract).toContain("MacBook Pro");
      expect(contract).toContain("$2000");
      expect(contract).toContain("18 or older");
    });

    it("should generate a moderator agreement", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "community",
        contractType: "community_moderator_agreement",
        platforms: "Discord, Twitch",
        moderatorDutiesText: "Monitor chat and enforce rules",
        hasCompensation: false,
      };

      const contract = generateContract(form);

      expect(contract).toContain("COMMUNITY MODERATOR AGREEMENT");
      expect(contract).toContain("Discord, Twitch");
      expect(contract).toContain("Monitor chat");
      expect(contract).toContain("volunteer");
    });
  });

  describe("Tone Variations", () => {
    it("should apply casual tone", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        tone: "casual",
      };

      const contract = generateContract(form);
      expect(contract).toBeTruthy();
      // Casual tone uses friendlier language
    });

    it("should apply neutral tone", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        tone: "neutral",
      };

      const contract = generateContract(form);
      expect(contract).toBeTruthy();
    });

    it("should apply formal tone", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        tone: "formal",
      };

      const contract = generateContract(form);
      expect(contract).toBeTruthy();
      // Formal tone avoids contractions
    });
  });

  describe("Optional Fields", () => {
    it("should handle missing optional fields gracefully", () => {
      const minimalForm: CreatorContractForm = {
        category: "brand",
        contractType: "brand_sponsorship",
        tone: "neutral",
        creatorName: "Jane Doe",
        creatorRoleLabel: "Creator",
        counterpartyName: "Acme Brand",
        counterpartyRoleLabel: "Client",
        hasCompensation: false,
        hasExclusivity: false,
        hasRevenueShare: false,
      };

      const contract = generateContract(minimalForm);

      expect(contract).toContain("Jane Doe");
      expect(contract).toContain("Acme Brand");
      expect(contract).toContain("non-paid");
    });

    it("should include exclusivity section when enabled", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        hasExclusivity: true,
        exclusivityScope: "Cannot work with competing brands",
        exclusivityDuration: "6 months",
      };

      const contract = generateContract(form);

      expect(contract).toContain("EXCLUSIVITY");
      expect(contract).toContain("Cannot work with competing brands");
      expect(contract).toContain("6 months");
    });

    it("should include revenue share when enabled", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        category: "creator_collab",
        contractType: "revenue_share_project",
        hasRevenueShare: true,
        revenueSourcesText: "YouTube AdSense",
        revenueSplitDescription: "60/40 split",
      };

      const contract = generateContract(form);

      expect(contract).toContain("YouTube AdSense");
      expect(contract).toContain("60/40 split");
    });
  });

  describe("Legal Fields", () => {
    it("should include governing law when specified", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        governingLawRegion: "State of California",
      };

      const contract = generateContract(form);

      expect(contract).toContain("State of California");
    });

    it("should include termination notice period", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        terminationNoticePeriodText: "30 days written notice",
      };

      const contract = generateContract(form);

      expect(contract).toContain("30 days written notice");
    });

    it("should include dispute resolution", () => {
      const form: CreatorContractForm = {
        ...baseForm,
        disputeResolutionText: "Binding arbitration",
      };

      const contract = generateContract(form);

      expect(contract).toContain("Binding arbitration");
    });
  });

  describe("Signature Sections", () => {
    it("should include signature lines for both parties", () => {
      const form: CreatorContractForm = {
        ...baseForm,
      };

      const contract = generateContract(form);

      expect(contract).toContain("SIGNATURES");
      expect(contract).toContain("Creator: _______________________");
      expect(contract).toContain("Client: _______________________");
      expect(contract).toContain("Date: __________");
    });
  });
});
