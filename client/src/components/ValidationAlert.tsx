import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle } from "lucide-react";

interface ValidationAlertProps {
  errors: string[];
  warnings: string[];
}

export default function ValidationAlert({ errors, warnings }: ValidationAlertProps) {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <div className="space-y-3">
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Contract Incomplete</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Please complete the following required fields:</p>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Professional Language Recommended</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm">
                  {warning}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
