// API Route: app/api/process-audio/route.ts
import { db } from '@/db/drizzle';
import { uploadFile } from '@/lib/upload-file';
import { Cleanvoice } from '@cleanvoice/cleanvoice-sdk';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { fileUrl, fileType } = await request.json();

  const cv = new Cleanvoice({
    apiKey: process.env.CLEANVOICE_API_KEY
  });

  const result = await cv.process(fileUrl, {
    video: fileType === "video" ? true: false,
    normalize: true,
    studio_sound: true
  });
  console.log(result)

  const resultUrl = await uploadFile(result.audio.url)

  const nanoId = nanoid()

  const resultDB = await db.insert(VocalEnhancerGenerated).values({
    id: nanoId,
    userId: "temp-userId",
    fileName: result.audio.filename,
    audioURL: resultUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning()

  return NextResponse.json({id: resultDB[0].id});
}