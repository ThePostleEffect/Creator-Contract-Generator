import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function LogoUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const { data: preferences, refetch } = trpc.preferences.get.useQuery();
  const uploadLogoMutation = trpc.preferences.uploadLogo.useMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;

        try {
          await uploadLogoMutation.mutateAsync({
            imageData,
            mimeType: file.type,
          });

          toast.success("Logo uploaded successfully!");
          refetch();
        } catch (error) {
          console.error("Upload error:", error);
          toast.error("Failed to upload logo");
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read file");
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File processing error:", error);
      toast.error("Failed to process file");
      setUploading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Company Logo</h3>
            <p className="text-xs text-muted-foreground">
              Add your logo to PDF contracts
            </p>
          </div>
        </div>

        {preferences?.logoUrl ? (
          <div className="flex items-center gap-3">
            <img
              src={preferences.logoUrl}
              alt="Company logo"
              className="h-16 w-16 object-contain border rounded"
            />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Logo uploaded</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Change
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Logo"}
          </Button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Card>
  );
}
