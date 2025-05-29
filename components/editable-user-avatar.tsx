import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pencil, Trash2, Upload, AlertCircle, Loader2 } from "lucide-react";
import Cropper from "react-easy-crop";
import { toast } from "sonner";
import $api from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";

const avatarVariants = cva("relative w-full h-full rounded-lg group", {
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-16 w-16",
      xl: "h-20 w-20",
      "2xl": "h-24 w-24",
      "3xl": "h-32 w-32",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

interface EditableUserAvatarProps extends VariantProps<typeof avatarVariants> {
  name: string | undefined;
  image: string | undefined;
  className?: string;
  onDelete?: () => Promise<void>;
  loading?: boolean;
}

export function EditableUserAvatar({
  name,
  image,
  className,
  onDelete,
  loading = false,
  size = "md",
}: EditableUserAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const validateImage = (file: File | undefined): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file) {
      if (file.size > maxSize) {
        return "Image size must be less than 5MB";
      }
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        return "Only JPEG, PNG, GIF, and WebP images are allowed";
      }
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);
        toast("Invalid image", { description: validationError });
        return;
      }
      setError("");
      setIsProcessing(true);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
        setIsProcessing(false);
      });
      reader.addEventListener("error", () => {
        setError("Failed to load image");
        setIsProcessing(false);
        toast("Error", { description: "Failed to load the selected image" });
      });
      if (file) reader.readAsDataURL(file);
    }
  };

  const uploadAvatarMutation = $api.useMutation(
    "post",
    "/api/v1/users/avatar",
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/users/me", null],
          exact: true,
        });
        setIsDialogOpen(false);
        setImageSrc(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        toast("Profile picture updated", {
          description: "Your profile picture has been updated successfully.",
        });
      },
      onError: () => {
        toast.error("Failed to update profile picture", {
          description: "There was an error updating your profile picture.",
        });
      },
    }
  );

  const onCropComplete = (
    _croppedArea: CropArea,
    croppedAreaPixels: CropArea
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.crossOrigin = "anonymous";
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CropArea
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2d context");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Canvas is empty");
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsUploading(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedImage], "avatar.jpg", {
        type: "image/jpeg",
      });
      const formData = new FormData();
      formData.append("file", file);
      uploadAvatarMutation.mutate({ body: formData });
    } catch (error) {
      console.error("Error saving cropped image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      await onDelete();
      toast("Profile picture removed", {
        description: "Your profile picture has been removed successfully.",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting image:", error);
      toast("Delete failed", {
        description: "Failed to remove profile picture. Please try again.",
      });
    }
  };

  const resetDialog = () => {
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setError("");
    setIsProcessing(false);
  };

  return (
    <>
      <div
        className={cn(avatarVariants({ size }), className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <UserAvatar
          name={name}
          image={image}
          loading={loading}
          size={size}
          className={className}
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:text-white hover:bg-primary/20"
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit avatar</span>
            </Button>
            {onDelete && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:text-white hover:bg-destructive/20"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete avatar</span>
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetDialog();
        }}
      >
        <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update profile picture</DialogTitle>
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
                    Max size: 5MB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formats: JPEG, PNG, GIF, WebP
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
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
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    cropShape="round"
                    showGrid={false}
                    style={{
                      containerStyle: {
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      },
                    }}
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
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                  <Button
                    variant="outline"
                    loading={isUploading}
                    onClick={resetDialog}
                    className="w-full sm:w-auto"
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isUploading}
                    className="w-full sm:w-auto"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove profile picture?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your profile picture. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
