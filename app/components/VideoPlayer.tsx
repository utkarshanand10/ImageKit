"use client";

import { Video } from "@imagekit/next";

interface VideoPlayerProps {
  videoUrl: string;
  controls?: boolean;
}

export default function VideoPlayer({ videoUrl, controls = true }: VideoPlayerProps) {
  return (
    <Video
      src={videoUrl}
      transformation={[
        {
          height: "1920",
          width: "1080",
        },
      ]}
      controls={controls}
      className="w-full h-full"
    />
  );
}
