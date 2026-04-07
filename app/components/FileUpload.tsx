"use client";

import { IKUpload } from "imagekitio-next";
import { useState } from "react";
import { useNotification } from "./Notification";
import { AlertCircle, Loader2 } from "lucide-react";

interface IKUploadResponse {
  fileId: string;
  url: string;
  filePath: string;
  thumbnailUrl?: string;
}

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const onError = (err: { message: string }) => {
    console.error("Upload Error:", err);
    const msg = err?.message || "Upload failed. Please check your keys.";
    setError(msg);
    showNotification(msg, "error");
    setUploading(false);
  };

  const handleSuccess = (res: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(res);
    showNotification("Upload successful!", "success");
  };

  const handleStart = () => {
    setUploading(true);
    setError(null);
  };

  const handleProgress = (event: { loaded: number; total: number }) => {
    if (onProgress && event.loaded && event.total) {
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    }
  };

  const authenticator = async () => {
    try {
      const response = await fetch("/api/auth/imagekit-auth");
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication request failed: ${errorText}`);
      }

      const data = await response.json();
      const { signature, token, expire } = data.authenticationParameters;
      return { signature, token, expire };
    } catch (error) {
      console.error("Authenticator error:", error);
      throw new Error("Authentication request failed");
    }
  };

  return (
    <div className="space-y-4">
      <IKUpload
        fileName={fileType === "video" ? "video.mp4" : "image.jpg"}
        useUniqueFileName={true}
        validateFile={(file) => {
          const isValid = fileType === "video" ? file.type.startsWith("video/") : file.type.startsWith("image/");
          if (!isValid) showNotification("Invalid file type", "error");
          return isValid;
        }}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadProgress={handleProgress}
        onUploadStart={handleStart}
        authenticator={authenticator}
        className="file-input file-input-bordered w-full bg-base-100/50 border-base-300 focus:border-primary transition-all cursor-pointer rounded-xl file:bg-primary file:text-primary-content file:border-none file:px-6 file:font-black file:uppercase file:text-xs file:tracking-widest file:hover:bg-primary/90 file:transition-all disabled:opacity-50"
        folder={fileType === "video" ? "/videos" : "/images"}
      />

      {uploading && (
        <div className="flex items-center justify-center gap-3 p-4 bg-primary/5 rounded-2xl text-primary animate-pulse border border-primary/10">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-black text-xs uppercase tracking-widest">Uploading to ImageKit...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-xs font-bold leading-tight">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
