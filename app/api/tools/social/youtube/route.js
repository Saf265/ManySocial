import { getMP4Formats, getVideoInfo } from "@/utils/actions-youtube";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { url } = await req.json();

    if(!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': process.env.RAPID_API_KEY,
		'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com'
	}
};

try{
  const response = await fetch(`https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${url}&urlAccess=normal&videos=auto&audios=auto`, options);
  const data = await response.json()

  const videoInfo = getVideoInfo(data)
  const mp4Formats = getMP4Formats(data)
  
  // Return MP4 formats directly (URLs expire quickly, can't merge server-side)
  const formatsWithAudio = mp4Formats.map(f => ({
    ...f,
    hasAudio: false,
    note: 'Audio must be downloaded separately or merged client-side'
  }));
  
  return NextResponse.json({videoInfo, mp4Formats: formatsWithAudio})
}catch(err){
  console.error(err);
  return NextResponse.json({ error: "Failed to fetch video data" }, { status: 500 });
}
}