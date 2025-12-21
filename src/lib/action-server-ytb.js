"use server";

import { getVideoId } from "@/utils/actions-youtube";

function parseISO8601Duration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

export async function getVideoDuration(videoUrl) {
  try {
    const videoId = getVideoId(videoUrl);
    if (!videoId) return 0;

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoId}&key=${process.env.YTB_API_KEY_V3}`
    );

    const data = await res.json();
    if (!data.items || data.items.length === 0) return 0;

    const durationRaw = data.items[0].contentDetails.duration;
    return {
      seconds: parseISO8601Duration(durationRaw),
      title: data.items[0].snippet.title,
      thumbnail: data.items[0].snippet.thumbnails.maxres?.url || data.items[0].snippet.thumbnails.high?.url
    };
  } catch (error) {
    console.error("Error fetching video duration:", error);
    return null;
  }
}

