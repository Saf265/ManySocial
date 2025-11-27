import { db } from "@/db/drizzle";
import { ImagesGenerated } from "@/db/drizzle/schema";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { model, prompt, width, height } = await request.json();

  const response = await fetch('https://api.aimlapi.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AI_ML_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      image_size: { width: width, height: height },
      num_inference_steps: 8,
      num_images: 4,
      // seed: 12345,
      // enable_safety_checker: true
    })
  });

  const data = await response.json();
  console.log("first", data);
  console.log("second", data.data)

  const randomId = nanoid();


  console.log(data.data)
  // Extract image URLs from the response
  const imageUrls = data.data.map(img => img.url);

  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList
  })

  const [newImagesGenerated] = await db.insert(ImagesGenerated).values({
    id: randomId,
    userId: session?.user?.id ?? "none", // TODO: Get from session
    prompt: prompt,
    images: imageUrls
  }).returning();


  return NextResponse.json({ id: newImagesGenerated.id }, { status: 200 });
}