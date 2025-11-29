import { getMP4Formats, getVideoInfo } from "@/utils/actions-youtube";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { url } = await req.json();

    if(!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': process.env.RAPID_API_KEY,
		'x-rapidapi-host': 'yt-api.p.rapidapi.com'
	}
};

try{
  const response = await fetch(`https://yt-api.p.rapidapi.com/dl?id=${url}`, options);
  const data = await response.json()

  console.log("datZIOJDZOIJIDa", data)
  const videoInfo = getVideoInfo(data)
  const mp4Formats= getMP4Formats(data)
  return NextResponse.json({videoInfo, mp4Formats})
}catch(err){
  console.error(err);
  return NextResponse.json({ error: "Failed to fetch video data" }, { status: 500 });
}
}