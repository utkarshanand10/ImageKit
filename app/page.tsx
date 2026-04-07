import { connectToDatabase } from "@/lib/db";
import VideoFeed from "./components/VideoFeed";
import Video, { IVideo } from "@/models/Video";

export default async function Home() {
  let videos: IVideo[] = [];
  try {
    await connectToDatabase();
    const result = await Video.find({}).sort({ createdAt: -1 }).lean();
    videos = JSON.parse(JSON.stringify(result)) as IVideo[];
  } catch (error) {
    console.error("Error fetching videos:", error);
  }

  return (
    <main className="container mx-auto px-4 py-4">
      <VideoFeed videos={videos} />
    </main>
  );
}
