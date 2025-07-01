"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/utils/uploadImage";
import Image from "next/image";

interface DirectImageUploaderProps {
  onUpload: (url: string) => void;
  onDelete: () => void;
  initialImage?: string;
}

export function DirectImageUploader({
  onUpload,
  onDelete,
  initialImage,
}: DirectImageUploaderProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setImage(imageUrl);
      onUpload(imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    setImage(null);
    onDelete();
  };

  return (
    <div className="w-64 h-64">
      <div
        className={`relative w-full h-full rounded-lg ${
          !image ? "border-2 border-dashed border-gray-300" : ""
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {!image ? (
          <label
            htmlFor="direct-image-upload"
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          >
            <ImageIcon className="w-12 h-12 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Upload Image</span>
            <input
              id="direct-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        ) : (
          <>
            <Image
              src={image}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-lg"
            />
            {!isMobile && (
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      document.getElementById("direct-image-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Replace
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
      {isMobile && image && (
        <div className="mt-2 flex justify-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              document.getElementById("direct-image-upload")?.click()
            }
          >
            <Upload className="w-4 h-4 mr-2" />
            Replace
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
