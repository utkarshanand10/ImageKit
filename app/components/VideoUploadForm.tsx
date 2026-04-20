"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
interface IKUploadResponse {
  fileId?: string;
  url: string;
  filePath: string;
  thumbnailUrl?: string;
}
import FileUpload from "./FileUpload";
import { apiClient } from "@/lib/api-client";
import { useNotification } from "./Notification";
import { Type, FileText, Settings, Layout, UploadCloud, Loader2, Check } from "lucide-react";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      controls: true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: 100
      }
    },
  });

  const videoUrl = watch("videoUrl");

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      showNotification("Please upload a video first", "error");
      return;
    }

    setLoading(true);
    try {
      await apiClient.createVideo(data);
      showNotification("Video published successfully!", "success");
      
      // Redirect to home page
      router.push("/");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (res: IKUploadResponse) => {
    setIsUploading(false);
    setValue("videoUrl", res.filePath, { shouldValidate: true });
    setValue("thumbnailUrl", res.thumbnailUrl || res.filePath, { shouldValidate: true });
    showNotification("Video ready to publish!", "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
    if (progress > 0 && progress < 100) {
      setIsUploading(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Title Field */}
      <div className="form-control group">
        <label className="label">
          <span className="label-text font-black text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
            <Type className="w-4 h-4" /> Video Title
          </span>
        </label>
        <input
          type="text"
          placeholder="Give your reel a catchy title"
          className={`input input-bordered w-full bg-base-200/30 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-2xl h-14 font-medium ${
            errors.title ? "input-error border-error/50" : ""
          }`}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-error text-xs mt-2 font-bold px-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="form-control group">
        <label className="label">
          <span className="label-text font-black text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Description
          </span>
        </label>
        <textarea
          placeholder="Tell people about your video..."
          className={`textarea textarea-bordered w-full bg-base-200/30 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-2xl min-h-[120px] py-4 text-base font-medium ${
            errors.description ? "textarea-error border-error/50" : ""
          }`}
          {...register("description", { required: "Description is required" })}
        ></textarea>
        {errors.description && (
          <p className="text-error text-xs mt-2 font-bold px-1">{errors.description.message}</p>
        )}
      </div>

      {/* Video Upload Section */}
      <div className="form-control p-8 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20 group hover:border-primary/40 transition-all">
        <label className="label mb-4 justify-center">
          <span className="label-text font-black text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-primary" /> Video Content
          </span>
        </label>
        
        <FileUpload
          fileType="video"
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
        />
        
        {videoUrl && (
          <div className="mt-6 flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-lg shadow-success/20">
              <Check className="w-5 h-5 text-success-content" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-success uppercase tracking-wider">Video Ready!</p>
              <p className="text-xs opacity-60 font-medium truncate max-w-[200px] md:max-w-xs">{videoUrl}</p>
            </div>
          </div>
        )}
        
        {uploadProgress > 0 && !videoUrl && (
          <div className="mt-8 space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-black uppercase tracking-wider opacity-60">Upload Progress</span>
              <span className="text-xs font-black text-primary">{uploadProgress}%</span>
            </div>
            <div className="h-3 w-full bg-base-300 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${uploadProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-base-200/30 rounded-3xl border border-base-300">
        <div className="form-control group">
          <label className="label">
            <span className="label-text font-black text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Video Quality
            </span>
          </label>
          <input
            type="number"
            min="1"
            max="100"
            className="input input-bordered bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl h-12 font-bold"
            {...register("transformation.quality", { valueAsNumber: true })}
          />
        </div>

        <div className="flex items-end pb-1">
          <label className="label cursor-pointer justify-start gap-4 p-3 bg-base-100/50 rounded-xl border border-base-300 w-full active:scale-95 transition-all">
            <Layout className="w-5 h-5 text-primary" />
            <span className="label-text font-bold text-sm tracking-tight">Show Controls</span>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-md"
              {...register("controls")}
            />
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`btn btn-primary w-full h-16 rounded-2xl shadow-xl shadow-primary/20 text-lg font-black tracking-tight transition-all active:scale-[0.98] ${
          loading || isUploading ? "opacity-70 pointer-events-none" : ""
        }`}
        disabled={loading || isUploading}
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Publishing Your Reel...</span>
          </div>
        ) : isUploading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Uploading Video...</span>
          </div>
        ) : (
          "Publish Video"
        )}
      </button>
    </form>
  );
}
