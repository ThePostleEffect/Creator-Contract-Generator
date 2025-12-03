import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreatorContractForm, ContentOwner, LicenseType } from "@shared/types/contracts";

interface Step5Props {
  formData: CreatorContractForm;
  updateFormData: (updates: Partial<CreatorContractForm>) => void;
  advancedMode: boolean;
}

export default function Step5RightsRules({ formData, updateFormData, advancedMode }: Step5Props) {
  const hideRights =
    formData.contractType === "nda_one_way" || formData.contractType === "nda_mutual";

  return (
    <div className="space-y-6">
      {!hideRights && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Rights & Usage</h3>
          
          <div className="space-y-2">
            <Label htmlFor="contentOwner">Content Ownership</Label>
            <Select
              value={formData.contentOwner || "creator"}
              onValueChange={(value) => updateFormData({ contentOwner: value as ContentOwner })}
            >
              <SelectTrigger id="contentOwner">
                <SelectValue placeholder="Select ownership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creator">Creator retains ownership</SelectItem>
                <SelectItem value="client">Client owns content</SelectItem>
                <SelectItem value="joint">Joint ownership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseType">License Type</Label>
            <Select
              value={formData.licenseType || "non_exclusive"}
              onValueChange={(value) => updateFormData({ licenseType: value as LicenseType })}
            >
              <SelectTrigger id="licenseType">
                <SelectValue placeholder="Select license type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exclusive">Exclusive</SelectItem>
                <SelectItem value="non_exclusive">Non-exclusive</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseDurationText">License Duration (Optional)</Label>
            <Input
              id="licenseDurationText"
              value={formData.licenseDurationText || ""}
              onChange={(e) => updateFormData({ licenseDurationText: e.target.value })}
              placeholder="e.g., 12 months, Perpetual, 2 years"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedUsesText">Allowed Uses (Optional)</Label>
            <Textarea
              id="allowedUsesText"
              value={formData.allowedUsesText || ""}
              onChange={(e) => updateFormData({ allowedUsesText: e.target.value })}
              placeholder="e.g., Social media, website, paid advertising"
              rows={3}
            />
          </div>

          {advancedMode && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label htmlFor="allowDerivatives" className="text-sm font-medium">
                  Allow derivative works?
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Can the client modify or create derivatives of the content?
                </p>
              </div>
              <Switch
                id="allowDerivatives"
                checked={formData.allowDerivatives || false}
                onCheckedChange={(checked) => updateFormData({ allowDerivatives: checked })}
              />
            </div>
          )}
        </div>
      )}

      {advancedMode && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground">Exclusivity</h3>
          
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <Label htmlFor="hasExclusivity" className="text-sm font-medium">
                Include exclusivity clause?
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Restrict working with competitors or similar projects
              </p>
            </div>
            <Switch
              id="hasExclusivity"
              checked={formData.hasExclusivity}
              onCheckedChange={(checked) => updateFormData({ hasExclusivity: checked })}
            />
          </div>

          {formData.hasExclusivity && (
            <>
              <div className="space-y-2">
                <Label htmlFor="exclusivityScope">Exclusivity Scope (Optional)</Label>
                <Textarea
                  id="exclusivityScope"
                  value={formData.exclusivityScope || ""}
                  onChange={(e) => updateFormData({ exclusivityScope: e.target.value })}
                  placeholder="e.g., Cannot work with competing brands in the same category"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exclusivityDuration">Exclusivity Duration (Optional)</Label>
                <Input
                  id="exclusivityDuration"
                  value={formData.exclusivityDuration || ""}
                  onChange={(e) => updateFormData({ exclusivityDuration: e.target.value })}
                  placeholder="e.g., 6 months, Duration of campaign"
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-foreground">Legal & Termination</h3>
        
        <div className="space-y-2">
          <Label htmlFor="terminationNoticePeriodText">Termination Notice Period (Optional)</Label>
          <Input
            id="terminationNoticePeriodText"
            value={formData.terminationNoticePeriodText || ""}
            onChange={(e) => updateFormData({ terminationNoticePeriodText: e.target.value })}
            placeholder="e.g., 30 days written notice, 2 weeks notice"
          />
        </div>

        {advancedMode && (
          <div className="space-y-2">
            <Label htmlFor="nonPaymentOrBreachConsequencesText">
              Breach Consequences (Optional)
            </Label>
            <Textarea
              id="nonPaymentOrBreachConsequencesText"
              value={formData.nonPaymentOrBreachConsequencesText || ""}
              onChange={(e) =>
                updateFormData({ nonPaymentOrBreachConsequencesText: e.target.value })
              }
              placeholder="What happens if either party breaches the agreement"
              rows={3}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="governingLawRegion">Governing Law / Jurisdiction (Optional)</Label>
          <Input
            id="governingLawRegion"
            value={formData.governingLawRegion || ""}
            onChange={(e) => updateFormData({ governingLawRegion: e.target.value })}
            placeholder="e.g., State of California, United Kingdom"
          />
        </div>

        {advancedMode && (
          <div className="space-y-2">
            <Label htmlFor="disputeResolutionText">Dispute Resolution (Optional)</Label>
            <Textarea
              id="disputeResolutionText"
              value={formData.disputeResolutionText || ""}
              onChange={(e) => updateFormData({ disputeResolutionText: e.target.value })}
              placeholder="e.g., Mediation followed by binding arbitration"
              rows={2}
            />
          </div>
        )}
      </div>

      {/* Giveaway-specific fields */}
      {formData.contractType === "giveaway_terms" && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground">Eligibility & Restrictions</h3>
          
          <div className="space-y-2">
            <Label htmlFor="territoryText">Geographic Restrictions (Optional)</Label>
            <Input
              id="territoryText"
              value={formData.territoryText || ""}
              onChange={(e) => updateFormData({ territoryText: e.target.value })}
              placeholder="e.g., Open to US residents only"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageRestrictionsText">Age Restrictions (Optional)</Label>
            <Input
              id="ageRestrictionsText"
              value={formData.ageRestrictionsText || ""}
              onChange={(e) => updateFormData({ ageRestrictionsText: e.target.value })}
              placeholder="e.g., Must be 18 or older"
            />
          </div>
        </div>
      )}

      {/* Moderator-specific fields */}
      {formData.contractType === "community_moderator_agreement" && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground">Moderator Duties</h3>
          
          <div className="space-y-2">
            <Label htmlFor="moderatorDutiesText">Duties & Responsibilities (Optional)</Label>
            <Textarea
              id="moderatorDutiesText"
              value={formData.moderatorDutiesText || ""}
              onChange={(e) => updateFormData({ moderatorDutiesText: e.target.value })}
              placeholder="e.g., Monitor chat, enforce community guidelines, report violations"
              rows={4}
            />
          </div>
        </div>
      )}
    </div>
  );
}
