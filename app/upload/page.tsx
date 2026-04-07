"use client";

import VideoUploadForm from "../components/VideoUploadForm";

export default function VideoUploadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12 space-y-3">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-x">
          Share Your Creativity
        </h1>
        <p className="text-base-content/60 font-medium text-lg">
          Upload your reel and let the world see your talent.
        </p>
      </div>

      <div className="bg-base-100/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-base-200 ring-1 ring-base-200/50">
        <div className="max-w-2xl mx-auto">
          <VideoUploadForm />
        </div>
      </div>
    </div>
  );
}
