import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import type { CreatorContractForm } from "@shared/types/contracts";
import { useState } from "react";
import { toast } from "sonner";

interface SaveTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreatorContractForm;
}

export default function SaveTemplateDialog({
  open,
  onOpenChange,
  formData,
}: SaveTemplateDialogProps) {
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const createMutation = trpc.templates.create.useMutation();

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    try {
      await createMutation.mutateAsync({
        templateName: templateName.trim(),
        description: templateDescription.trim() || undefined,
        formData: JSON.stringify(formData),
      });

      toast.success("Template saved successfully!");
      setTemplateName("");
      setTemplateDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error("Failed to save template");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            Save your current contract configuration for quick reuse
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Standard Brand Deal"
            />
          </div>

          <div>
            <Label htmlFor="template-description">Description (optional)</Label>
            <Textarea
              id="template-description"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Brief description of this template..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
