import { useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import Cropper, { Area } from "react-easy-crop";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  aspect?: number;
  cropShape?: "rect" | "round";
  accept?: string;
  maxSizeMB?: number;
  onSave: (file: File | Blob) => Promise<void>;
  trigger?: React.ReactNode;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onOpenChange,
  title = "Upload Image",
  aspect = 1,
  cropShape = "rect",
  accept = "image/jpeg,image/png,image/gif,image/webp",
  maxSizeMB = 5,
  onSave,
  trigger,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    setError(null);
  };

  const getCroppedImage = async () => {
    const image = await createImage(imageSrc!);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const { width, height, x, y } = croppedAreaPixels!;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    return new Promise<Blob>((resolve) =>
      canvas.toBlob((blob) => resolve(blob!), "image/webp")
    );
  };

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setIsUploading(true);
    try {
      const blob = await getCroppedImage();
      await onSave(blob);
      onOpenChange(false);
      resetDialog();
    } catch {
      setError("Failed to save image.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetDialog = () => {
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setError(null);
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm border rounded-md bg-destructive/10 text-destructive border-destructive/20">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-sm text-muted-foreground">
                Processing image...
              </p>
            </div>
          )}
          {!imageSrc && !isProcessing ? (
            <div className="relative flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed rounded-lg min-h-[200px]">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">Tap to select an image</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max size: {maxSizeMB}MB
                </p>
                <p className="text-xs text-muted-foreground">
                  Formats:{" "}
                  {accept.replaceAll("image/", "").replaceAll(",", ", ")}
                </p>
              </div>
              <input
                type="file"
                accept={accept}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          ) : imageSrc && !isProcessing ? (
            <>
              <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-lg bg-gray-100">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  cropShape={cropShape}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  showGrid={false}
                  style={{ containerStyle: { width: "100%", height: "100%" } }}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Zoom</span>
                  <span className="text-sm text-muted-foreground">
                    {zoom.toFixed(1)}x
                  </span>
                </div>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setZoom(value[0] || 1)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Button
                  variant="outline"
                  disabled={isUploading}
                  onClick={resetDialog}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} loading={isUploading}>
                  {isUploading ? "Saving..." : "Save"}
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.src = url;
  });
}

export default ImageUploadDialog;
