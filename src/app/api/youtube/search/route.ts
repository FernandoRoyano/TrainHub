import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
}

export async function GET(request: NextRequest) {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: "YouTube API key not configured" },
      { status: 500 }
    );
  }

  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.trim().length < 2) {
    return NextResponse.json({ videos: [] });
  }

  try {
    const params = new URLSearchParams({
      key: YOUTUBE_API_KEY,
      part: "snippet",
      q: `${query.trim()} ejercicio fitness`,
      type: "video",
      maxResults: "12",
      videoEmbeddable: "true",
      relevanceLanguage: "es",
      safeSearch: "strict",
    });

    const res = await fetch(`${BASE_URL}/search?${params}`, {
      next: { revalidate: 86400 }, // cache 24h
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || "YouTube API error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const items: YouTubeSearchItem[] = data.items ?? [];

    const videos = items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      publishedAt: item.snippet.publishedAt,
    }));

    return NextResponse.json({ videos });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from YouTube" },
      { status: 500 }
    );
  }
}
