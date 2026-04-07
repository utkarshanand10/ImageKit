"use client";

import { IKVideo } from "imagekitio-next";

interface VideoPlayerProps {
  videoUrl: string;
  controls?: boolean;
}

export default function VideoPlayer({ videoUrl, controls = true }: VideoPlayerProps) {
  return (
    <IKVideo
      path={videoUrl}
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
