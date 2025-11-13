"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/utils/uploadImage";
import clsx from "clsx";
import Image from "next/image";

interface FormImageUploaderProps {
  className?: string;
  onChange: (value: string | File | null) => void;
  value?: string | File | null;
  storeAsFile?: boolean;
  title?: string;
}

export function FormImageUploader({
  onChange,
  value,
  storeAsFile = false,
  className,
  title,
}: FormImageUploaderProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        if (storeAsFile) {
          onChange(file);
          setPreviewUrl(URL.createObjectURL(file));
        } else {
          const imageUrl = await uploadImage(file);
          onChange(imageUrl);
          setPreviewUrl(imageUrl);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = () => {
    onChange(null);
    setPreviewUrl(null);
  };

  const displayUrl = storeAsFile ? previewUrl : (value as string);

  return (
    <div className={clsx(className ?? "", "aspect-square")}>
      <div
        className={`relative w-full h-full rounded-lg ${
          !displayUrl ? "border-2 border-dashed border-gray-300" : ""
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {!displayUrl ? (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          >
            <ImageIcon className="w-12 h-12 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">
              {title ?? "Upload Image"}
            </span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        ) : (
          <>
            <Image
              src={displayUrl}
              style={{
                maxWidth: "100%",
                height: "100%",
              }}
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
                    icon={Upload}
                    iconPlacement="left"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    Replace
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    icon={Trash2}
                    iconPlacement="left"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
      {isMobile && displayUrl && (
        <div className="mt-2 flex justify-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => document.getElementById("image-upload")?.click()}
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
