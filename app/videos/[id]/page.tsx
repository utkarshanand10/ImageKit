import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import VideoPlayer from "@/app/components/VideoPlayer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const video = await Video.findById(id).lean() as IVideo | null;

    if (!video) {
        return notFound();
    }

    return (
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="btn btn-ghost inline-flex items-center gap-2 mb-6 group hover:translate-x-[-4px] transition-transform font-black text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Video Player Section */}
            <div className="relative aspect-[9/16] w-full max-w-[400px] mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl bg-black">
              <VideoPlayer
                videoUrl={video.videoUrl}
                controls={video.controls}
              />
            </div>

            {/* Info Section */}
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge badge-primary font-black uppercase tracking-widest text-[10px] py-3">REEL</span>
                <span className="text-base-content/40 text-xs font-bold uppercase tracking-widest">
                  {new Date((video as any).createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h1 className="text-4xl font-black mb-4 tracking-tighter leading-none">
                {video.title}
              </h1>
              
              <div className="h-px w-12 bg-primary/30 mb-6"></div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-base-content/80 font-medium leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching video:", error);
    return notFound();
  }
}
