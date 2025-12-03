import { Button } from "@/components/ui/button";
import { Copy, Download, Printer, FileText } from "lucide-react";
import { useState } from "react";
import { exportContractAsPDF } from "@/utils/pdfExport";
import type { CreatorContractForm } from "@shared/types/contracts";
import { trpc } from "@/lib/trpc";
import { validateContract } from "@shared/utils/validation";

interface Step6Props {
  contract: string;
  formData: CreatorContractForm;
}

export default function Step6Review({ contract, formData }: Step6Props) {
  const [copied, setCopied] = useState(false);
  const { data: preferences } = trpc.preferences.get.useQuery();
  
  const validationResult = validateContract(formData, formData.contractType);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contract);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy to clipboard");
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([contract], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contract-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    if (!validationResult.valid) {
      alert("Please complete all required fields before downloading PDF.");
      return;
    }
    
    try {
      exportContractAsPDF({ 
        contract, 
        formData,
        logoUrl: preferences?.logoUrl || undefined 
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handlePrintView = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Contract</title>
            <style>
              body {
                font-family: 'Georgia', 'Times New Roman', serif;
                font-size: 12pt;
                line-height: 1.6;
                max-width: 8.5in;
                margin: 0 auto;
                padding: 0.5in;
                color: black;
                background: white;
              }
              h1, h2, h3 {
                page-break-after: avoid;
              }
              p {
                orphans: 3;
                widows: 3;
              }
              pre {
                white-space: pre-wrap;
                font-family: 'Georgia', 'Times New Roman', serif;
                font-size: 12pt;
              }
              @media print {
                body {
                  padding: 0.5in;
                }
              }
            </style>
          </head>
          <body>
            <pre>${contract}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Your Contract is Ready!</h3>
        <p className="text-muted-foreground">
          Review your contract below and use the export options to save or share it.
        </p>

        {/* Export Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleCopyToClipboard} className="gap-2">
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
          <Button variant="outline" onClick={handleDownloadTxt} className="gap-2">
            <Download className="w-4 h-4" />
            Download as .txt
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
            <FileText className="w-4 h-4" />
            Download as PDF
          </Button>
          <Button variant="outline" onClick={handlePrintView} className="gap-2">
            <Printer className="w-4 h-4" />
            Print View
          </Button>
        </div>

        {/* Legal Disclaimer */}
        <div className="p-4 bg-muted rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> This is not legal advice; consider having a lawyer review
            this document before use. This generator produces template agreements only and does not
            constitute legal advice. Consider consulting a licensed attorney before using any
            contract.
          </p>
        </div>
      </div>

      {/* Contract Preview */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Contract Preview</Label>
        <div className="border rounded-lg p-6 bg-card max-h-[600px] overflow-y-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
            {contract}
          </pre>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
