// API Route: app/api/process-audio/route.ts
import { db } from '@/db/drizzle';
import { VocalEnhancerGenerated } from '@/db/drizzle/schema';
import { auth } from '@/lib/auth';
import { uploadFile } from '@/lib/upload-file';
import { Cleanvoice } from '@cleanvoice/cleanvoice-sdk';
import { nanoid } from 'nanoid';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { fileUrl, fileType } = await request.json();

  const cv = new Cleanvoice({
    apiKey: process.env.CLEANVOICE_API_KEY
  });

  const result = await cv.process(fileUrl, {
    video: fileType === "video" ? true : false,
    normalize: true,
    studio_sound: true
  });
  console.log("result", result)

  const nanoId = nanoid()

  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList
  })

  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  } 



  const fileGenerated= result.audio.url
  const fileName = result.audio.filename

  // fetch blob and store
  const response = await fetch(fileGenerated)
  const blob = await response.blob()
  const blobUrl = await uploadFile(blob)

  const resultDB = await db.insert(VocalEnhancerGenerated).values({
    id: nanoId,
    userId,
    fileName,
    fileURL: blobUrl,
  }).returning()

  return NextResponse.json({ id: resultDB[0].id, fileURL: blobUrl });
}