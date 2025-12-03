# Creator Contract Generator - Project TODO

## Core Type System & Data Models
- [x] Define ContractCategory type (6 categories)
- [x] Define ContractType type (23 contract types)
- [x] Define ContractTone type (casual, neutral, formal)
- [x] Create CreatorContractForm interface with all fields
- [x] Create category-to-templates mapping

## Contract Generation Engine
- [x] Implement generateContract() pure function
- [x] Create brand deal contract templates
- [x] Create creator collaboration contract templates
- [x] Create service provider contract templates
- [x] Create release contract templates (model, guest, location, contributor)
- [x] Create NDA contract templates (one-way and mutual)
- [x] Create business operations templates (talent management, JV)
- [x] Create community templates (giveaway, moderator)
- [x] Implement tone variations (casual, neutral, formal)
- [x] Handle optional fields gracefully in templates

## Multi-Step Wizard UI
- [x] Create left sidebar with step progress indicator
- [x] Implement Step 1: Contract Setup (category, template, tone)
- [x] Implement Step 2: Basics (parties and project info)
- [x] Implement Step 3: Deliverables / Scope
- [x] Implement Step 4: Money (compensation, commission, revenue share)
- [x] Implement Step 5: Rights & Rules (usage, exclusivity, legal)
- [x] Implement Step 6: Review & Export
- [x] Add step validation and navigation controls
- [x] Show visual indicators for completed steps

## Live Preview Panel
- [x] Create toggle button for preview panel (top-right)
- [x] Implement scrollable preview area with monospaced font
- [x] Add section headings to preview
- [x] Make preview update in real-time on form changes

## Export & Output Features
- [x] Implement "Copy to clipboard" button
- [x] Implement "Download as .txt" button
- [x] Create print view with clean formatting
- [x] Add @media print CSS rules
- [x] Display legal disclaimer on all steps

## Preset System
- [x] Add "Load My Preset" button in Step 1
- [x] Add "Save My Preset" button in Step 1
- [x] Implement localStorage save/load for user defaults
- [x] Store: creatorName, creatorRoleLabel, creatorCityState, governingLawRegion, defaultCurrency

## Simple/Advanced Mode
- [x] Add Simple/Advanced mode toggle in Step 1
- [x] Hide complex fields in Simple Mode
- [x] Show all fields in Advanced Mode

## Role Label Overrides
- [x] Add creatorRoleLabel field in Step 2
- [x] Add counterpartyRoleLabel field in Step 2
- [x] Use dynamic labels throughout contract templates

## Quick-Fill Buttons
- [x] Add "Apply common brand-deal defaults" button
- [x] Add "Apply common editor-agreement defaults" button
- [x] Implement pre-fill logic for common scenarios

## Developer Tools
- [x] Create debug panel (DEV mode only)
- [x] Show current ContractCategory in debug panel
- [x] Show current ContractType in debug panel
- [x] Show current ContractTone in debug panel
- [x] Show full form JSON in debug panel
- [x] Ensure debug panel hidden in production

## Styling & Polish
- [x] Design light, modern single-page layout
- [x] Style with rounded cards and subtle shadows
- [x] Choose and apply accent color
- [x] Add hover effects on buttons
- [x] Ensure responsive design
- [x] Add legal disclaimer footer

## Testing & Quality
- [x] Test all 23 contract types
- [x] Test all 3 tone variations
- [x] Test Simple vs Advanced mode
- [x] Test preset save/load
- [x] Test export functions (copy, download, print)
- [x] Test form validation
- [x] Test live preview updates
- [ ] Cross-browser testing

## Bug Fixes & UX Improvements
- [x] Add close button to Live Contract Preview panel
- [x] Add close button to developer debug panel
- [x] Install PDF library (jspdf)
- [x] Implement professional PDF export with proper formatting
- [x] Add PDF section headings and styling
- [x] Add page numbers to PDF footer
- [x] Add signature blocks to PDF

## Professional PDF Export Upgrade
- [x] Implement text normalization (capitalize names, standardize dates, clean whitespace)
- [x] Add Letter/A4 page size with 1-inch margins
- [x] Implement professional typography (title 24px, headings 15px, body 11px)
- [x] Add centered title with horizontal divider
- [x] Implement section hierarchy with proper spacing (0.25in before sections, 0.15in after headings)
- [x] Add proper paragraph spacing and line height (1.4)
- [x] Create professional signature block with proper alignment and styling
- [x] Add page numbers in footer (Page X of Y)
- [x] Intelligently omit empty clauses instead of leaving blanks

## Feature Upgrade: Company Logo Upload
- [x] Add logo upload UI in settings or profile
- [x] Implement image upload to S3 storage
- [x] Store logo URL in user preferences (database schema)
- [x] Add logo to PDF header with proper sizing
- [x] Add logo preview in app

## Feature Upgrade: Contract Templates Library
- [x] Create database schema for saved templates
- [x] Add "Save as Template" functionality
- [x] Create templates library UI page
- [x] Implement template loading from library
- [x] Add template editing and deletion
- [x] Show template preview cards

## Feature Upgrade: Digital Signature Collection
- [x] Create database schema for signature requests
- [ ] Add "Request Signatures" button after contract generation
- [ ] Create signature collection page (public link)
- [ ] Implement canvas-based signature drawing
- [ ] Store signatures and link to contracts
- [ ] Add signature status tracking
- [ ] Email notification for signature requests
- [ ] Generate final signed PDF with embedded signatures

## Note: Digital Signature Feature
- [ ] HOLD OFF - E-signature feature postponed per user request

## Bug Fixes - Critical
- [x] Fix preferences.get query returning undefined when no preferences exist
- [x] Fix PNG signature error when adding logo to PDF (temporarily disabled until proper async CORS handling)

## PDF Quality & Validation Upgrade (REQUIRED)

### 1. Field Sanitization
- [x] Create text sanitization utility function
- [x] Convert informal words to professional equivalents
- [x] Remove emojis, slang, profanity
- [x] Auto-capitalize proper nouns (names, cities, states)
- [x] Trim whitespace from all fields
- [x] Set default governing law if invalid

### 2. Required Field Validation by Contract Type
- [x] Implement validateContract() function
- [x] Add validation for Revenue-Share contracts (sources, split, schedule, term, roles)
- [x] Add validation for Brand Deals/UGC (deliverables, platforms, payment, usage)
- [x] Add validation for Service Provider contracts (type, revisions, fee)
- [x] Add validation for NDAs (definition, obligations, duration)
- [x] Add validation for Releases (identification, rights granted)
- [x] Block PDF generation if required fields missing
- [x] Show clear error messages with missing fields

### 3. Professional PDF Formatting
- [x] Center logo above title (temporarily disabled for CORS fix)
- [x] Ensure title appears only once at top
- [x] Fix section heading spacing (0.25in before, 0.15in after)
- [x] Remove duplicate "SIGNATURES" headings
- [x] Ensure consistent paragraph spacing
- [x] Fix page numbers (Page X of Y)

### 4. Text Normalization
- [x] Standardize all dates to "Month DD, YYYY"
- [x] Fix city/state formatting ("Los Angeles, CA")
- [x] Auto-capitalize names

### 5. Intelligent Clause Removal
- [x] Remove empty optional sections completely
- [x] No blank lines or partial headings
- [x] Clean removal of bonus, exclusivity if not applicable

### 6. Professional Language Filter
- [x] Add soft filter for unprofessional terms
- [x] Show friendly validation message for flagged inputs

### 7. Pre-Generation Validation
- [x] Integrate validateContract() before PDF generation
- [x] Integrate validateContract() before text preview
- [x] Return clear list of validation errors to user

## PDF Generation Fixes (CRITICAL - MUST FIX PROPERLY)
- [x] Remove duplicate contract title (appears twice in PDF)
- [x] Filter out sections with placeholder text like "[Description...]"
- [x] Remove completely empty sections (6. TERM & TERMINATION, 7. MISCELLANEOUS with no content)
- [x] Remove duplicate "SIGNATURES" heading (appears as "8. SIGNATURES" and then "SIGNATURES" again)
- [x] Fix inconsistent spacing between sections
- [x] Ensure contract generator doesn't output placeholder text
- [x] Implement proper section filtering that checks for actual content, not just non-empty strings

## Critical Fix - Duplicate Signatures
- [x] Remove SIGNATURES section from contract generator output (PDF adds its own)
- [x] Update PDF parser to skip any SIGNATURES section from contract text

## Contract Generator Complete Overhaul (CRITICAL)
- [x] Rewrite Brand Sponsorship/UGC contract with full professional structure
- [x] Rewrite Service Provider contract with full professional structure
- [x] Rewrite Revenue Share/Collaboration contract with full professional structure
- [x] Rewrite Collaboration contract with full professional structure
- [x] Implement conditional clause logic (no empty headings, complete clauses or nothing)
- [x] Add proper clause depth (2-4 sentences per clause, meaningful content)
- [x] Implement all required sections for every contract type
- [x] Add mandatory legal disclaimer before signatures
- [x] Update signature format to match requirements
- [x] Extend professional structure to all 23 contract types
- [x] Remove all placeholder text and one-liners
- [x] Ensure professional tone (not overly legal, not casual)

## Universal Vague-to-Professional Expansion Logic (MANDATORY)
- [x] Create expandPlatforms() function to convert vague platform inputs
- [x] Create expandDeliverableType() function to add professional context
- [x] Create expandTimeline() function to structure deadline language
- [x] Create expandCompensation() function to add payment context
- [x] Create expandUsageRights() function to structure licensing language
- [x] Create expandExclusivity() function to add exclusivity clauses
- [x] Create sanitizeVagueInput() function to handle "idk", "tbd", "any", etc.
- [x] Apply expansion logic uniformly across all contract types
- [x] Integrate expansion logic into existing 4 rewritten contracts
- [x] Use expansion logic in all remaining 19 contract types

## Branding Integration
- [x] Copy CCF_LOGO.png to client/public/
- [x] Copy Hero_section_bg.png to client/public/
- [x] Add logo to sidebar/header
- [x] Add hero background to main content area
- [x] Update styling for visual flair

## UI Transparency Enhancement
- [x] Increase panel transparency to ~20% opacity (80% transparent)
- [x] Ensure text remains readable with stronger backdrop blur

## Enhanced Visual Effects
- [x] Add transparency to main content cards
- [x] Add text glow/shadow for better readability

## Sidebar Button Enhancement
- [x] Improve sidebar step button readability with better contrast and effects

## Preview Panel Enhancement
- [x] Change Live Contract Preview to clean white background for document-like appearance
