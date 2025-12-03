import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreatorContractForm } from "@shared/types/contracts";

interface Step2Props {
  formData: CreatorContractForm;
  updateFormData: (updates: Partial<CreatorContractForm>) => void;
}

export default function Step2Basics({ formData, updateFormData }: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Your Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="creatorName">Your Name *</Label>
          <Input
            id="creatorName"
            value={formData.creatorName}
            onChange={(e) => updateFormData({ creatorName: e.target.value })}
            placeholder="e.g., Jane Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="creatorRoleLabel">Your Role Label</Label>
          <Input
            id="creatorRoleLabel"
            value={formData.creatorRoleLabel}
            onChange={(e) => updateFormData({ creatorRoleLabel: e.target.value })}
            placeholder="e.g., Creator, Host, Artist"
          />
          <p className="text-xs text-muted-foreground">
            How you'll be referred to in the contract
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="creatorCityState">Your Location (Optional)</Label>
          <Input
            id="creatorCityState"
            value={formData.creatorCityState || ""}
            onChange={(e) => updateFormData({ creatorCityState: e.target.value })}
            placeholder="e.g., Los Angeles, CA"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-foreground">Other Party Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="counterpartyName">Their Name *</Label>
          <Input
            id="counterpartyName"
            value={formData.counterpartyName}
            onChange={(e) => updateFormData({ counterpartyName: e.target.value })}
            placeholder="e.g., Acme Brand Inc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="counterpartyRoleLabel">Their Role Label</Label>
          <Input
            id="counterpartyRoleLabel"
            value={formData.counterpartyRoleLabel}
            onChange={(e) => updateFormData({ counterpartyRoleLabel: e.target.value })}
            placeholder="e.g., Client, Brand, Manager"
          />
          <p className="text-xs text-muted-foreground">
            How they'll be referred to in the contract
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-foreground">Project Details</h3>
        
        <div className="space-y-2">
          <Label htmlFor="projectTitle">Project Title (Optional)</Label>
          <Input
            id="projectTitle"
            value={formData.projectTitle || ""}
            onChange={(e) => updateFormData({ projectTitle: e.target.value })}
            placeholder="e.g., Summer Campaign 2024"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectDescription">Project Description (Optional)</Label>
          <Textarea
            id="projectDescription"
            value={formData.projectDescription || ""}
            onChange={(e) => updateFormData({ projectDescription: e.target.value })}
            placeholder="Brief description of the project or collaboration"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date (Optional)</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate || ""}
              onChange={(e) => updateFormData({ startDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDateOrOngoing">End Date or "Ongoing" (Optional)</Label>
            <Input
              id="endDateOrOngoing"
              value={formData.endDateOrOngoing || ""}
              onChange={(e) => updateFormData({ endDateOrOngoing: e.target.value })}
              placeholder="e.g., 2024-12-31 or Ongoing"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
