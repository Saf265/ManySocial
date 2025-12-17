import { db } from "@/db/drizzle";
import { VideosGenerated } from "@/db/drizzle/schema";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


// async function getVideo(genId) {
//   const url = new URL('https://api.aimlapi.com/v2/video/generations');
//   url.searchParams.append('generation_id', genId);

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${process.env.AI_ML_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching video:', error);
//     return null;
//   }
// }

export async function POST(request) {
    const { prompt, model, duration, aspectRatio, image } = await request.json();

    if (!prompt || !model || !duration || !aspectRatio) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // convertie la duration (ex: "4s") en int (4)
    const durationInt = parseInt(duration.replace("s", ""));

  const response = await fetch('https://api.aimlapi.com/v2/video/generations', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.AI_ML_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "model": model,
      "prompt": prompt,
      "duration": durationInt,
      "aspect_ratio":model === "minimax/hailuo-02" ? null: aspectRatio,
      "imageUrl": model === "minimax/hailuo-02" ? null : image,
      "prompt_optimizer": false,
      "first_frame_image": model === "minimax/hailuo-02" ? image: null,
    }),
  });

  // ex response:{
//   "id": "60ac7c34-3224-4b14-8e7d-0aa0db708325",
//   "status": "completed",
//   "video": {
//     "url": "https://cdn.aimlapi.com/generations/hedgehog/1759866285599-0cdfb138-c03a-49d4-a601-4f6413e27b15.mp4",
//     "duration": 8
//   },
//   "duration": 8,
//   "error": null,
//   "meta": {
//     "usage": {
//       "tokens_used": 120000
//     }
//   }
// }


  const responseData = await response.json();
  console.log("response",responseData);

  const genId = responseData.generation_id;
  console.log('Generation ID:', genId);

  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList
  })

  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  const randomId = nanoid()
  await db.insert(VideosGenerated).values({
    id: randomId,
    jobId: genId,
    userId: userId,
    prompt: prompt,
    aspectRatio: aspectRatio,
    model: model,
    duration: durationInt,
    videoURL: null,
    status: "processing",
  });

  //  if (genId) {
  //   const timeout = 600 * 1000; // 10 minutes
  //   const startTime = Date.now();

  //   while (Date.now() - startTime < timeout) {
  //     const responseData = await getVideo(genId);

  //     if (!responseData) {
  //       console.error('Error: No response from API');
  //       break;
  //     }

  //     const status = responseData.status;
  //     console.log('Status:', status);

  //     if (['waiting', 'active', 'queued', 'generating'].includes(status)) {
  //       console.log('Still waiting... Checking again in 10 seconds.');
  //       await new Promise((resolve) => setTimeout(resolve, 10000));
  //     } else {
  //       console.log('Processing complete:\n', responseData);
  //       return NextResponse.json({ success: true, responseData });
  //     }
  //   }

  //   console.log('Timeout reached. Stopping.');
  //   return NextResponse.json({ error: "Timeout reached" }, { status: 500 });
  // }
  return NextResponse.json({ success: true, jobId: randomId });
}