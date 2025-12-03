import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Eye, EyeOff } from "lucide-react";
import ValidationAlert from "@/components/ValidationAlert";
import { validateContract, sanitizeForm } from "@shared/utils/validation";
import type {
  CreatorContractForm,
  ContractCategory,
  ContractType,
  ContractTone,
} from "@shared/types/contracts";
import { generateContract } from "@shared/utils/contractGenerator";
import Step1ContractSetup from "@/components/contract-steps/Step1ContractSetup";
import Step2Basics from "@/components/contract-steps/Step2Basics";
import Step3Deliverables from "@/components/contract-steps/Step3Deliverables";
import Step4Money from "@/components/contract-steps/Step4Money";
import Step5RightsRules from "@/components/contract-steps/Step5RightsRules";
import Step6Review from "@/components/contract-steps/Step6Review";

const STEPS = [
  { id: 1, title: "Contract Setup" },
  { id: 2, title: "Basics" },
  { id: 3, title: "Deliverables / Scope" },
  { id: 4, title: "Money" },
  { id: 5, title: "Rights & Rules" },
  { id: 6, title: "Review & Export" },
];

export default function ContractGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
   const [advancedMode, setAdvancedMode] = useState(false);
  const [formData, setFormData] = useState<CreatorContractForm>({
    // Default values will be overridden by loaded template if available
    category: "brand" as ContractCategory,
    contractType: "brand_sponsorship" as ContractType,
    tone: "neutral" as ContractTone,
    creatorName: "",
    creatorRoleLabel: "Creator",
    counterpartyName: "",
    counterpartyRoleLabel: "Client",
    hasCompensation: true,
    hasExclusivity: false,
    hasRevenueShare: false,
  });

  // Sanitize and validate form data
  const sanitizedFormData = useMemo(() => sanitizeForm(formData), [formData]);
  
  const validationResult = useMemo(() => {
    return validateContract(sanitizedFormData, sanitizedFormData.contractType);
  }, [sanitizedFormData]);

  const generatedContract = useMemo(() => {
    return generateContract(sanitizedFormData);
  }, [sanitizedFormData]);

  const updateFormData = (updates: Partial<CreatorContractForm>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Load template from localStorage if available
  useEffect(() => {
    const loadedTemplate = localStorage.getItem("loadedTemplate");
    if (loadedTemplate) {
      try {
        const templateData = JSON.parse(loadedTemplate) as CreatorContractForm;
        setFormData(templateData);
        localStorage.removeItem("loadedTemplate"); // Clear after loading
      } catch (error) {
        console.error("Failed to load template:", error);
      }
    }
  }, []);

  const canProceed = (step: number): boolean => {
    if (step === 1) {
      return !!(formData.category && formData.contractType && formData.tone);
    }
    if (step === 2) {
      return !!(formData.creatorName && formData.counterpartyName);
    }
    // Step 6 requires valid contract
    if (step === 6) {
      return validationResult.valid;
    }
    return true;
  };

  const handleNext = () => {
    if (canProceed(currentStep) && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1ContractSetup
            formData={formData}
            updateFormData={updateFormData}
            advancedMode={advancedMode}
            setAdvancedMode={setAdvancedMode}
          />
        );
      case 2:
        return <Step2Basics formData={formData} updateFormData={updateFormData} />;
      case 3:
        return (
          <Step3Deliverables
            formData={formData}
            updateFormData={updateFormData}
            advancedMode={advancedMode}
          />
        );
      case 4:
        return (
          <Step4Money
            formData={formData}
            updateFormData={updateFormData}
            advancedMode={advancedMode}
          />
        );
      case 5:
        return (
          <Step5RightsRules
            formData={formData}
            updateFormData={updateFormData}
            advancedMode={advancedMode}
          />        );
      case 6:
        return (
          <div className="space-y-4">
            <ValidationAlert 
              errors={validationResult.errors} 
              warnings={validationResult.warnings} 
            />
            <Step6Review contract={generatedContract} formData={sanitizedFormData} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <aside className="w-64 border-r bg-card/20 backdrop-blur-md p-6 flex flex-col">
          <div className="mb-6">
            <img src="/logo.png" alt="Creator Contract Forge" className="w-full h-auto mb-3" />
            <h1 className="text-lg font-bold text-center text-foreground">Contract Generator</h1>
          </div>
          <nav className="space-y-2 flex-1">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  if (step.id < currentStep || canProceed(step.id - 1)) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all shadow-lg ${
                  currentStep === step.id
                    ? "bg-primary/90 backdrop-blur-sm text-primary-foreground font-semibold shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    : step.id < currentStep
                      ? "bg-secondary/60 backdrop-blur-sm text-secondary-foreground hover:bg-secondary/80 shadow-md"
                      : "bg-card/40 backdrop-blur-sm text-foreground hover:bg-primary/60 hover:text-primary-foreground shadow-md"
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center text-sm font-semibold">
                    {step.id}
                  </span>
                )}
                <span className="text-sm font-medium">{step.title}</span>
              </button>
            ))}
          </nav>
          <div className="mt-6 pt-6 border-t text-xs text-muted-foreground">
            This generator produces template agreements only and does not constitute legal advice.
            Consider consulting a licensed attorney before using any contract.
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background/20 backdrop-blur-md">
          <div className="container max-w-4xl py-8">
            {/* Top Bar with Preview Toggle */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Step {currentStep}: {STEPS[currentStep - 1]?.title}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {currentStep === 6
                    ? "Review your contract and export"
                    : "Fill in the required information"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>

            {/* Step Content */}
            <Card className="mb-6">
              <CardContent className="pt-6">{renderStep()}</CardContent>
            </Card>

            {/* Navigation Buttons */}
            {currentStep < 6 && (
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button onClick={handleNext} disabled={!canProceed(currentStep)}>
                  Next
                </Button>
              </div>
            )}
          </div>
        </main>

        {/* Live Preview Panel */}
        {showPreview && (
          <aside className="w-96 border-l bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 z-10 flex items-center justify-between shadow-sm">
              <h3 className="font-semibold text-gray-900">Live Contract Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="h-8 w-8 p-0"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              <pre className="whitespace-pre-wrap font-mono text-xs text-gray-900 leading-relaxed">
                {generatedContract}
              </pre>
            </div>
          </aside>
        )}
      </div>

      {/* Developer Debug Panel (DEV only) */}
      {import.meta.env.DEV && (
        <details className="fixed bottom-4 right-4 bg-card border rounded-lg p-4 max-w-md shadow-lg">
          <summary className="cursor-pointer font-semibold text-sm mb-2 flex items-center justify-between">
            <span>🔧 Developer Debug Panel</span>
          </summary>
          <div className="text-xs space-y-2">
            <div>
              <strong>Category:</strong> {formData.category}
            </div>
            <div>
              <strong>Type:</strong> {formData.contractType}
            </div>
            <div>
              <strong>Tone:</strong> {formData.tone}
            </div>
            <div>
              <strong>Form Data:</strong>
              <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-48">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
