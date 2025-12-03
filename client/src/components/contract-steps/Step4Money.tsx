import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreatorContractForm, FeeType } from "@shared/types/contracts";

interface Step4Props {
  formData: CreatorContractForm;
  updateFormData: (updates: Partial<CreatorContractForm>) => void;
  advancedMode: boolean;
}

export default function Step4Money({ formData, updateFormData, advancedMode }: Step4Props) {
  const applyBrandDealDefaults = () => {
    updateFormData({
      hasCompensation: true,
      currency: "USD",
      feeType: "flat",
      feeAmount: 5000,
      paymentSchedule: "Net 30 days after deliverable approval",
    });
  };

  const applyEditorDefaults = () => {
    updateFormData({
      hasCompensation: true,
      currency: "USD",
      feeType: "per_deliverable",
      feeAmount: 150,
      paymentSchedule: "Upon delivery of each video",
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick-Fill Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={applyBrandDealDefaults}>
          Apply common brand-deal defaults
        </Button>
        <Button variant="outline" size="sm" onClick={applyEditorDefaults}>
          Apply common editor-agreement defaults
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <Label htmlFor="hasCompensation" className="text-sm font-medium">
              Is there compensation?
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Toggle off for volunteer or free agreements
            </p>
          </div>
          <Switch
            id="hasCompensation"
            checked={formData.hasCompensation}
            onCheckedChange={(checked) => updateFormData({ hasCompensation: checked })}
          />
        </div>

        {formData.hasCompensation && (
          <>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency (Optional)</Label>
              <Input
                id="currency"
                value={formData.currency || ""}
                onChange={(e) => updateFormData({ currency: e.target.value })}
                placeholder="e.g., USD, EUR, GBP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feeType">Fee Type</Label>
              <Select
                value={formData.feeType || "flat"}
                onValueChange={(value) => updateFormData({ feeType: value as FeeType })}
              >
                <SelectTrigger id="feeType">
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat fee</SelectItem>
                  <SelectItem value="per_deliverable">Per deliverable</SelectItem>
                  <SelectItem value="hourly">Hourly rate</SelectItem>
                  <SelectItem value="commission">Commission-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.feeType !== "commission" && (
              <div className="space-y-2">
                <Label htmlFor="feeAmount">Amount (Optional)</Label>
                <Input
                  id="feeAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.feeAmount || ""}
                  onChange={(e) =>
                    updateFormData({
                      feeAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="e.g., 5000"
                />
              </div>
            )}

            {formData.feeType === "commission" && (
              <div className="space-y-2">
                <Label htmlFor="commissionStructure">Commission Structure (Optional)</Label>
                <Textarea
                  id="commissionStructure"
                  value={formData.commissionStructure || ""}
                  onChange={(e) => updateFormData({ commissionStructure: e.target.value })}
                  placeholder="e.g., 10% of all sales generated through affiliate link"
                  rows={3}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="paymentSchedule">Payment Schedule (Optional)</Label>
              <Input
                id="paymentSchedule"
                value={formData.paymentSchedule || ""}
                onChange={(e) => updateFormData({ paymentSchedule: e.target.value })}
                placeholder="e.g., Net 30 days, Upon completion, Monthly"
              />
            </div>

            {advancedMode && (
              <div className="space-y-2">
                <Label htmlFor="bonusDetails">Bonus Details (Optional)</Label>
                <Textarea
                  id="bonusDetails"
                  value={formData.bonusDetails || ""}
                  onChange={(e) => updateFormData({ bonusDetails: e.target.value })}
                  placeholder="e.g., $500 bonus if video reaches 100k views"
                  rows={2}
                />
              </div>
            )}
          </>
        )}
      </div>

      {advancedMode && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground">Revenue Share</h3>
          
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <Label htmlFor="hasRevenueShare" className="text-sm font-medium">
                Include revenue sharing?
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                For collaborative projects with shared income
              </p>
            </div>
            <Switch
              id="hasRevenueShare"
              checked={formData.hasRevenueShare}
              onCheckedChange={(checked) => updateFormData({ hasRevenueShare: checked })}
            />
          </div>

          {formData.hasRevenueShare && (
            <>
              <div className="space-y-2">
                <Label htmlFor="revenueSourcesText">Revenue Sources (Optional)</Label>
                <Input
                  id="revenueSourcesText"
                  value={formData.revenueSourcesText || ""}
                  onChange={(e) => updateFormData({ revenueSourcesText: e.target.value })}
                  placeholder="e.g., AdSense, sponsorships, merchandise"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenueSplitDescription">Revenue Split (Optional)</Label>
                <Input
                  id="revenueSplitDescription"
                  value={formData.revenueSplitDescription || ""}
                  onChange={(e) => updateFormData({ revenueSplitDescription: e.target.value })}
                  placeholder="e.g., Creator A 60%, Creator B 40%"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Giveaway-specific fields */}
      {formData.contractType === "giveaway_terms" && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground">Prize Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="prizeDescription">Prize Description (Optional)</Label>
            <Textarea
              id="prizeDescription"
              value={formData.prizeDescription || ""}
              onChange={(e) => updateFormData({ prizeDescription: e.target.value })}
              placeholder="Describe the prize"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="approxPrizeValue">Approximate Prize Value (Optional)</Label>
            <Input
              id="approxPrizeValue"
              value={formData.approxPrizeValue || ""}
              onChange={(e) => updateFormData({ approxPrizeValue: e.target.value })}
              placeholder="e.g., $500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="giveawayStartDate">Giveaway Start Date (Optional)</Label>
              <Input
                id="giveawayStartDate"
                type="date"
                value={formData.giveawayStartDate || ""}
                onChange={(e) => updateFormData({ giveawayStartDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="giveawayEndDate">Giveaway End Date (Optional)</Label>
              <Input
                id="giveawayEndDate"
                type="date"
                value={formData.giveawayEndDate || ""}
                onChange={(e) => updateFormData({ giveawayEndDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="winnerSelectionMethod">Winner Selection Method (Optional)</Label>
            <Input
              id="winnerSelectionMethod"
              value={formData.winnerSelectionMethod || ""}
              onChange={(e) => updateFormData({ winnerSelectionMethod: e.target.value })}
              placeholder="e.g., Random draw, Judged selection"
            />
          </div>
        </div>
      )}

      {/* Moderator-specific fields */}
      {formData.contractType === "community_moderator_agreement" && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground">Moderator Compensation</h3>
          
          <div className="space-y-2">
            <Label htmlFor="moderatorPerksOrCompensationText">
              Perks or Compensation (Optional)
            </Label>
            <Textarea
              id="moderatorPerksOrCompensationText"
              value={formData.moderatorPerksOrCompensationText || ""}
              onChange={(e) =>
                updateFormData({ moderatorPerksOrCompensationText: e.target.value })
              }
              placeholder="e.g., Early access to content, exclusive Discord role"
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}
