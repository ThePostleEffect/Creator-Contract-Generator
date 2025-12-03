import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreatorContractForm } from "@shared/types/contracts";

interface Step3Props {
  formData: CreatorContractForm;
  updateFormData: (updates: Partial<CreatorContractForm>) => void;
  advancedMode: boolean;
}

export default function Step3Deliverables({ formData, updateFormData, advancedMode }: Step3Props) {
  // Hide deliverables for certain contract types
  const hideDeliverables =
    formData.contractType === "nda_one_way" ||
    formData.contractType === "nda_mutual" ||
    formData.contractType.includes("_release");

  if (hideDeliverables) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Deliverables section not applicable for this contract type.</p>
        <p className="text-sm mt-2">Click Next to continue.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Deliverables</h3>
        
        <div className="space-y-2">
          <Label htmlFor="deliverableType">Deliverable Type (Optional)</Label>
          <Input
            id="deliverableType"
            value={formData.deliverableType || ""}
            onChange={(e) => updateFormData({ deliverableType: e.target.value })}
            placeholder="e.g., Instagram posts, YouTube videos, blog articles"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliverableCount">Number of Deliverables (Optional)</Label>
          <Input
            id="deliverableCount"
            type="number"
            min="1"
            value={formData.deliverableCount || ""}
            onChange={(e) =>
              updateFormData({ deliverableCount: e.target.value ? parseInt(e.target.value) : undefined })
            }
            placeholder="e.g., 3"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="platforms">Platforms (Optional)</Label>
          <Input
            id="platforms"
            value={formData.platforms || ""}
            onChange={(e) => updateFormData({ platforms: e.target.value })}
            placeholder="e.g., Instagram, TikTok, YouTube"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduleDescription">Schedule / Timeline (Optional)</Label>
          <Textarea
            id="scheduleDescription"
            value={formData.scheduleDescription || ""}
            onChange={(e) => updateFormData({ scheduleDescription: e.target.value })}
            placeholder="Describe the delivery schedule or timeline"
            rows={3}
          />
        </div>
      </div>

      {advancedMode && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground">Revisions</h3>
          
          <div className="space-y-2">
            <Label htmlFor="includedRevisions">Included Revisions (Optional)</Label>
            <Input
              id="includedRevisions"
              type="number"
              min="0"
              value={formData.includedRevisions || ""}
              onChange={(e) =>
                updateFormData({
                  includedRevisions: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="e.g., 2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extraRevisionFeeText">Extra Revision Fee (Optional)</Label>
            <Input
              id="extraRevisionFeeText"
              value={formData.extraRevisionFeeText || ""}
              onChange={(e) => updateFormData({ extraRevisionFeeText: e.target.value })}
              placeholder="e.g., $100 per additional revision"
            />
          </div>
        </div>
      )}

      {/* Release-specific fields */}
      {formData.contractType.includes("_release") && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground">Release Details</h3>
          
          <div className="space-y-2">
            <Label htmlFor="releaseeName">Releasee Name (Optional)</Label>
            <Input
              id="releaseeName"
              value={formData.releaseeName || ""}
              onChange={(e) => updateFormData({ releaseeName: e.target.value })}
              placeholder="Name of person granting rights"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="releaseeRole">Releasee Role (Optional)</Label>
            <Input
              id="releaseeRole"
              value={formData.releaseeRole || ""}
              onChange={(e) => updateFormData({ releaseeRole: e.target.value })}
              placeholder="e.g., Model, Guest, Location Owner"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descriptionOfAppearanceOrContent">
              Description of Appearance/Content (Optional)
            </Label>
            <Textarea
              id="descriptionOfAppearanceOrContent"
              value={formData.descriptionOfAppearanceOrContent || ""}
              onChange={(e) =>
                updateFormData({ descriptionOfAppearanceOrContent: e.target.value })
              }
              placeholder="Describe what is being released"
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}
