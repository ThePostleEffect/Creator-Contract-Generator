import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { FileText, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Templates() {
  const [, setLocation] = useLocation();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [formDataToSave, setFormDataToSave] = useState<CreatorContractForm | null>(null);

  const { data: templates, refetch } = trpc.templates.list.useQuery();
  const createMutation = trpc.templates.create.useMutation();
  const deleteMutation = trpc.templates.delete.useMutation();

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    if (!formDataToSave) {
      toast.error("No form data to save");
      return;
    }

    try {
      await createMutation.mutateAsync({
        templateName: templateName.trim(),
        description: templateDescription.trim() || undefined,
        formData: JSON.stringify(formDataToSave),
      });

      toast.success("Template saved successfully!");
      setShowSaveDialog(false);
      setTemplateName("");
      setTemplateDescription("");
      setFormDataToSave(null);
      refetch();
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error("Failed to save template");
    }
  };

  const handleDeleteTemplate = async (id: number, name: string) => {
    if (!confirm(`Delete template "${name}"?`)) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Template deleted");
      refetch();
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template");
    }
  };

  const handleLoadTemplate = (template: any) => {
    try {
      const formData = JSON.parse(template.formData) as CreatorContractForm;
      // Store in localStorage for the main page to pick up
      localStorage.setItem("loadedTemplate", JSON.stringify(formData));
      setLocation("/");
      toast.success(`Loaded template: ${template.templateName}`);
    } catch (error) {
      console.error("Failed to load template:", error);
      toast.error("Failed to load template");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Contract Templates</h1>
              <p className="text-muted-foreground mt-2">
                Save and reuse your frequently-used contract configurations
              </p>
            </div>
            <Button onClick={() => setLocation("/")}>
              Back to Generator
            </Button>
          </div>
        </div>

        {!templates || templates.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-4">
              Save your first template from the contract generator
            </p>
            <Button onClick={() => setLocation("/")}>
              Go to Generator
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card key={template.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {template.templateName}
                    </h3>
                    {template.description && (
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id, template.templateName)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  Created {new Date(template.createdAt).toLocaleDateString()}
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleLoadTemplate(template)}
                >
                  Load Template
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Save Template Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save as Template</DialogTitle>
              <DialogDescription>
                Give your template a name and optional description
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
                <Label htmlFor="template-description">
                  Description (optional)
                </Label>
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
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>Save Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
