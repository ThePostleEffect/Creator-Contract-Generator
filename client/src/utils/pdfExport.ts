import { jsPDF } from "jspdf";
import type { CreatorContractForm } from "@shared/types/contracts";
import { capitalizeName, standardizeDate, capitalizeCityState } from "./textNormalization";

// Map contract types to readable titles
const contractTitles: Record<string, string> = {
  brand_sponsorship: "BRAND SPONSORSHIP AGREEMENT",
  ugc_production: "UGC PRODUCTION AGREEMENT",
  content_license: "CONTENT LICENSING AGREEMENT",
  whitelisting_rights: "WHITELISTING RIGHTS AGREEMENT",
  affiliate_promo: "AFFILIATE PROMOTION AGREEMENT",
  collab_single_project: "SINGLE PROJECT COLLABORATION AGREEMENT",
  co_creator_ongoing: "CO-CREATOR AGREEMENT",
  revenue_share_project: "REVENUE SHARE AGREEMENT",
  service_editor: "EDITOR SERVICE AGREEMENT",
  service_thumbnail_designer: "THUMBNAIL DESIGNER SERVICE AGREEMENT",
  service_clipper: "CLIPPER SERVICE AGREEMENT",
  service_channel_manager: "CHANNEL MANAGER SERVICE AGREEMENT",
  model_release: "MODEL RELEASE",
  guest_release: "GUEST RELEASE",
  location_release: "LOCATION RELEASE",
  contributor_content_release: "CONTRIBUTOR CONTENT RELEASE",
  talent_management: "TALENT MANAGEMENT AGREEMENT",
  nda_one_way: "NON-DISCLOSURE AGREEMENT",
  nda_mutual: "MUTUAL NON-DISCLOSURE AGREEMENT",
  joint_project_jv: "JOINT VENTURE AGREEMENT",
  giveaway_terms: "GIVEAWAY TERMS AND CONDITIONS",
  community_moderator_agreement: "COMMUNITY MODERATOR AGREEMENT",
};

interface PDFExportOptions {
  contract: string;
  formData: CreatorContractForm;
  logoUrl?: string;
}

interface ParsedSection {
  number?: string;
  title: string;
  content: string[];
}

/**
 * Check if text is a placeholder or empty
 */
function isPlaceholderOrEmpty(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  
  // Check for placeholder patterns
  if (/^\[.*\]$/.test(trimmed)) return true; // [Description...]
  if (/^_+$/.test(trimmed)) return true; // Just underscores
  if (trimmed === "N/A" || trimmed === "TBD") return true;
  
  return false;
}

/**
 * Parse contract text into clean sections
 */
function parseContractIntoSections(contractText: string): ParsedSection[] {
  const lines = contractText.split("\n");
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  
  // First, remove the title line if it exists (we'll add it separately in PDF)
  let startIndex = 0;
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Check if first line is the contract title (all caps, matches a known title)
    if (firstLine === firstLine.toUpperCase() && Object.values(contractTitles).includes(firstLine)) {
      startIndex = 1; // Skip the title line
    }
  }
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip completely empty lines between sections
    if (!trimmed && !currentSection) continue;
    
    // Check if this is a numbered section heading (e.g., "1. PARTIES" or "8. SIGNATURES")
    const sectionMatch = trimmed.match(/^(\d+)\.\s+([A-Z\s&]+)$/);
    if (sectionMatch) {
      const sectionTitle = sectionMatch[2].trim();
      
      // Skip SIGNATURES section entirely - PDF adds its own
      if (sectionTitle === "SIGNATURES") {
        currentSection = null;
        continue;
      }
      
      // Save previous section if it has content
      if (currentSection && currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        number: sectionMatch[1],
        title: sectionTitle,
        content: [],
      };
      continue;
    }
    
    // Check if this is an unnumbered section heading (e.g., "SIGNATURES" after "8. SIGNATURES")
    // This is a duplicate we want to skip
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !trimmed.match(/^\d/)) {
      // If this matches the current section title, it's a duplicate - skip it
      if (currentSection && trimmed === currentSection.title) {
        continue;
      }
    }
    
    // Add content to current section
    if (currentSection) {
      // Skip placeholder or empty content
      if (!isPlaceholderOrEmpty(trimmed)) {
        currentSection.content.push(trimmed);
      }
    }
  }
  
  // Save last section if it has content
  if (currentSection && currentSection.content.length > 0) {
    sections.push(currentSection);
  }
  
  // Filter out sections with no real content
  return sections.filter(section => section.content.length > 0);
}

export function exportContractAsPDF({ contract, formData, logoUrl }: PDFExportOptions): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: "letter", // 8.5 x 11 inches
  });

  // Page dimensions
  const pageWidth = 8.5;
  const pageHeight = 11;
  const margin = 1;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Typography
  const titleFontSize = 24;
  const headingFontSize = 15;
  const bodyFontSize = 11;
  const lineHeight = 1.4;

  // Helper: Check if we need a new page
  const checkPageBreak = (neededSpace: number): void => {
    if (yPosition + neededSpace > pageHeight - margin - 0.5) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Parse contract into clean sections
  const sections = parseContractIntoSections(contract);

  // Add title (only once, at the top)
  const title = contractTitles[formData.contractType] || "CONTRACT AGREEMENT";
  doc.setFontSize(titleFontSize);
  doc.setFont("times", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(title, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 0.4;

  // Horizontal divider
  doc.setLineWidth(0.01);
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 0.5;

  // Render each section
  for (const section of sections) {
    // Check if we need a new page before section
    checkPageBreak(0.6);
    
    // Add spacing before section
    yPosition += 0.25;

    // Render section heading
    doc.setFontSize(headingFontSize);
    doc.setFont("times", "bold");
    doc.setTextColor(0, 0, 0);
    
    const sectionHeading = section.number ? `${section.number}. ${section.title}` : section.title;
    doc.text(sectionHeading, margin, yPosition);
    yPosition += 0.3;

    // Render section content
    doc.setFontSize(bodyFontSize);
    doc.setFont("times", "normal");
    doc.setTextColor(40, 40, 40);

    for (const paragraph of section.content) {
      const wrappedText = doc.splitTextToSize(paragraph, contentWidth);
      const neededSpace = wrappedText.length * (bodyFontSize / 72) * lineHeight + 0.1;
      
      checkPageBreak(neededSpace);
      
      doc.text(wrappedText, margin, yPosition);
      yPosition += wrappedText.length * (bodyFontSize / 72) * lineHeight + 0.12;
    }
  }

  // Add professional signature block (only once, at the end)
  checkPageBreak(1.5);
  yPosition += 0.5;

  doc.setFontSize(headingFontSize);
  doc.setFont("times", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("SIGNATURES", margin, yPosition);
  yPosition += 0.4;

  doc.setFontSize(bodyFontSize);
  doc.setFont("times", "normal");
  doc.setTextColor(40, 40, 40);

  // Creator signature
  const creatorName = capitalizeName(formData.creatorName) || "[Creator Name]";
  const creatorLabel = formData.creatorRoleLabel || "Creator";
  
  doc.text("_".repeat(60), margin, yPosition);
  yPosition += 0.18;
  doc.setFont("times", "bold");
  doc.text(creatorName, margin, yPosition);
  yPosition += 0.15;
  doc.setFont("times", "normal");
  doc.setTextColor(119, 119, 119);
  doc.text(creatorLabel, margin, yPosition);
  yPosition += 0.25;
  doc.setTextColor(40, 40, 40);
  doc.text("Date: ___________________", margin, yPosition);
  yPosition += 0.5;

  // Counterparty signature
  const counterpartyName = capitalizeName(formData.counterpartyName) || "[Counterparty Name]";
  const counterpartyLabel = formData.counterpartyRoleLabel || "Client";
  
  doc.text("_".repeat(60), margin, yPosition);
  yPosition += 0.18;
  doc.setFont("times", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text(counterpartyName, margin, yPosition);
  yPosition += 0.15;
  doc.setFont("times", "normal");
  doc.setTextColor(119, 119, 119);
  doc.text(counterpartyLabel, margin, yPosition);
  yPosition += 0.25;
  doc.setTextColor(40, 40, 40);
  doc.text("Date: ___________________", margin, yPosition);

  // Add page numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont("times", "normal");
    doc.setTextColor(100, 100, 100);
    const pageText = `Page ${i} of ${totalPages}`;
    const textWidth = doc.getTextWidth(pageText);
    doc.text(pageText, (pageWidth - textWidth) / 2, pageHeight - 0.5);
  }

  // Save the PDF
  const fileName = `${formData.contractType.replace(/_/g, "-")}-${Date.now()}.pdf`;
  doc.save(fileName);
}
