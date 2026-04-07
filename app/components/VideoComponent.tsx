"use client";
import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="hover:scale-[1.02] transition-transform duration-300">
      <div className="relative group w-full">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-2xl overflow-hidden relative w-full border border-base-content/5 shadow-sm"
            style={{ aspectRatio: "9/16" }}
          >
            <IKVideo
              path={video.videoUrl}
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              controls={video.controls}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>

      <div className="mt-3 px-2">
        <Link
          href={`/videos/${video._id}`}
          className="hover:text-primary transition-colors"
        >
          <h2 className="text-base font-bold line-clamp-1">{video.title}</h2>
        </Link>

        <p className="text-xs text-base-content/60 line-clamp-1 mt-1">
          {video.description}
        </p>
      </div>
    </div>
  );
}
