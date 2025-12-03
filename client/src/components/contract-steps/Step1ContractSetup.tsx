import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import LogoUpload from "@/components/LogoUpload";
import SaveTemplateDialog from "@/components/SaveTemplateDialog";
import { FileText, Save } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import type { CreatorContractForm, ContractCategory, ContractType, ContractTone } from "@shared/types/contracts";
import { CATEGORY_TEMPLATES } from "@shared/types/contracts";

interface Step1Props {
  formData: CreatorContractForm;
  updateFormData: (updates: Partial<CreatorContractForm>) => void;
  advancedMode: boolean;
  setAdvancedMode: (value: boolean) => void;
}

export default function Step1ContractSetup({
  formData,
  updateFormData,
  advancedMode,
  setAdvancedMode,
}: Step1Props) {
  const [, setLocation] = useLocation();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const handleCategoryChange = (category: ContractCategory) => {
    updateFormData({ category });
    // Reset contract type when category changes
    const firstTemplate = CATEGORY_TEMPLATES[category]?.templates[0];
    if (firstTemplate) {
      updateFormData({ contractType: firstTemplate.value });
    }
  };

  const handleLoadPreset = () => {
    try {
      const preset = localStorage.getItem("creatorContractPreset");
      if (preset) {
        const parsed = JSON.parse(preset);
        updateFormData({
          creatorName: parsed.creatorName || "",
          creatorRoleLabel: parsed.creatorRoleLabel || "Creator",
          creatorCityState: parsed.creatorCityState || "",
          governingLawRegion: parsed.governingLawRegion || "",
          currency: parsed.defaultCurrency || "USD",
        });
      }
    } catch (error) {
      console.error("Failed to load preset:", error);
    }
  };

  const handleSavePreset = () => {
    try {
      const preset = {
        creatorName: formData.creatorName,
        creatorRoleLabel: formData.creatorRoleLabel,
        creatorCityState: formData.creatorCityState,
        governingLawRegion: formData.governingLawRegion,
        defaultCurrency: formData.currency,
      };
      localStorage.setItem("creatorContractPreset", JSON.stringify(preset));
      alert("Preset saved successfully!");
    } catch (error) {
      console.error("Failed to save preset:", error);
    }
  };

  const currentCategory = CATEGORY_TEMPLATES[formData.category];

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <LogoUpload />

      {/* Mode Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div>
          <Label htmlFor="mode-toggle" className="text-sm font-medium">
            Advanced Mode
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Show all fields including complex options
          </p>
        </div>
        <Switch
          id="mode-toggle"
          checked={advancedMode}
          onCheckedChange={setAdvancedMode}
        />
      </div>

      {/* Preset Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={handleLoadPreset}>
          Load My Preset
        </Button>
        <Button variant="outline" size="sm" onClick={handleSavePreset}>
          Save My Preset
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)}>
          <Save className="w-4 h-4 mr-2" />
          Save as Template
        </Button>
        <Button variant="outline" size="sm" onClick={() => setLocation("/templates")}>
          <FileText className="w-4 h-4 mr-2" />
          My Templates
        </Button>
      </div>

      {/* Save Template Dialog */}
      <SaveTemplateDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        formData={formData}
      />

      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category">Contract Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleCategoryChange(value as ContractCategory)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CATEGORY_TEMPLATES).map(([key, cat]) => (
              <SelectItem key={key} value={key}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Template Selection */}
      <div className="space-y-2">
        <Label htmlFor="template">Contract Template</Label>
        <Select
          value={formData.contractType}
          onValueChange={(value) => updateFormData({ contractType: value as ContractType })}
        >
          <SelectTrigger id="template">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {currentCategory?.templates.map((template) => (
              <SelectItem key={template.value} value={template.value}>
                {template.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tone Selection */}
      <div className="space-y-2">
        <Label htmlFor="tone">Contract Tone</Label>
        <Select
          value={formData.tone}
          onValueChange={(value) => updateFormData({ tone: value as ContractTone })}
        >
          <SelectTrigger id="tone">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="casual">Casual - Friendly, uses "you", light contractions</SelectItem>
            <SelectItem value="neutral">Neutral - Standard business tone</SelectItem>
            <SelectItem value="formal">Formal - Legal-style, no contractions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Selected: <strong>{currentCategory?.label}</strong> →{" "}
          <strong>
            {currentCategory?.templates.find((t) => t.value === formData.contractType)?.label}
          </strong>
        </p>
      </div>
    </div>
  );
}
