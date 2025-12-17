import { db } from "@/db/drizzle";
import { VideosGenerated } from "@/db/drizzle/schema";
import { uploadFile } from "@/lib/upload-file";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

async function getVideo(genId) {
  const url = new URL("https://api.aimlapi.com/v2/video/generations");
  url.searchParams.append("generation_id", genId);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.AI_ML_KEY}`,
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
  }

  // 1️⃣ lire le job
  const [job] = await db
    .select()
    .from(VideosGenerated)
    .where(eq(VideosGenerated.id, videoId));

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // 2️⃣ déjà fini → on renvoie
  if (job.status === "completed" || job.status === "error") {
    return NextResponse.json(job);
  }

  // 3️⃣ check AIML (UNE FOIS)
  const aiml = await getVideo(job.jobId);

  if (aiml.status === "completed") {
    // get blob
    const response = await fetch(aiml.video.url);
    // upload to vercel blob

    if(!response.ok) {
      throw new Error("Failed to fetch video");
    }
    const blob = await response.blob();
    const blobUrl = await uploadFile(blob);
    await db
      .update(VideosGenerated)
      .set({
        status: "completed",
        videoURL: aiml.video.url,
        blobUrl: blobUrl,
      })
      .where(eq(VideosGenerated.id, videoId));
  }

  if (aiml.status === "failed") {
    await db
      .update(VideosGenerated)
      .set({
        status: "error",
        error: aiml.error ?? "Unknown error",
      })
      .where(eq(VideosGenerated.id, videoId));
  }

  // 4️⃣ relire le job à jour
  const [updatedJob] = await db
    .select()
    .from(VideosGenerated)
    .where(eq(VideosGenerated.id, videoId));

  return NextResponse.json(updatedJob);
}
