import { db } from "@/db/drizzle";
import { VocalRemoverGenerated } from "@/db/drizzle/schema";
import { auth } from "@/lib/auth";
import { uploadFile } from "@/lib/upload-file";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ error: "No file URL provided" }, { status: 400 });
    }

    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Download the file from our storage
    console.log("Fetching source file from:", fileUrl);
    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) {
      throw new Error("Failed to fetch source file");
    }
    const fileBlob = await fileRes.blob();
    const fileName = new URL(fileUrl).pathname.split("/").pop() || "audio.mp3";

    const LALAL_API_KEY = process.env.LALAL_API_KEY;

    // 2. Upload to Lalal.ai
    console.log("Uploading file to Lalal.ai...");
    const uploadRes = await fetch("https://www.lalal.ai/api/upload/", {
      method: "POST",
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        Authorization: `license ${LALAL_API_KEY}`,
      },
      body: fileBlob,
    });

    const uploadData = await uploadRes.json();
    console.log("Lalal.ai upload response:", uploadData);
    if (uploadData.status !== "success") {
      console.error("Lalal.ai upload error:", uploadData);
      throw new Error(uploadData.error || "Upload to Lalal.ai failed");
    }

    const fileId = uploadData.id;

    // 3. Request split
    console.log("Requesting split for fileId:", fileId);
    const splitRes = await fetch("https://www.lalal.ai/api/split/", {
      method: "POST",
      headers: {
        Authorization: `license ${LALAL_API_KEY}`,
      },
      body: new URLSearchParams({
        params: JSON.stringify([
          {
            id: fileId,
            stem: "vocals", // Splits into vocals and instrumental (back_track)
          },
        ]),
      }),
    });

    const splitData = await splitRes.json();
    console.log("Lalal.ai split response:", splitData);
    if (splitData.status !== "success") {
      console.error("Lalal.ai split error:", splitData);
      throw new Error(splitData.error || "Lalal.ai split request failed");
    }

    // 4. Poll for results
    console.log("Starting polling for results...");
    let instrumentalUrl = null;
    let attempts = 0;
    const maxAttempts = 50; // increased for safety

    while (attempts < maxAttempts) {
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts}...`);
      const checkRes = await fetch("https://www.lalal.ai/api/check/", {
        method: "POST",
        headers: {
          Authorization: `license ${LALAL_API_KEY}`,
        },
        body: new URLSearchParams({
          id: fileId,
        }),
      });

      const checkData = await checkRes.json();
      if (checkData.status === "success") {
        const result = checkData.result[fileId];
        console.log("Polling status:", result.status, result.task?.state || "");
        if (result.status === "success" && result.split) {
          instrumentalUrl = result.split.back_track;
          console.log("Instrumental URL found:", instrumentalUrl);
          break;
        } else if (result.status === "error") {
          throw new Error(result.error || "Processing failed");
        } else if (result.task && result.task.state === "error") {
          throw new Error(result.task.error || "Task failed");
        }
      }

      attempts++;
      // Wait 3 seconds between polls
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    if (!instrumentalUrl) {
      throw new Error("Lalal.ai processing timed out");
    }

    // 5. Download the processed instrumental
    console.log("Downloading instrumental from Lalal.ai...");
    const instrumentalRes = await fetch(instrumentalUrl);
    if (!instrumentalRes.ok) {
      throw new Error("Failed to download processed file from Lalal.ai");
    }
    const instrumentalBlob = await instrumentalRes.blob();

    // 6. Upload the result back to our storage
    console.log("Uploading processed file to storage...");
    const blobUrl = await uploadFile(instrumentalBlob);
    console.log("Uploaded result to:", blobUrl);

    // 7. Save to database
    console.log("Saving result to database for user:", userId);
    await db.insert(VocalRemoverGenerated).values({
      id: nanoid(),
      userId,
      fileName,
      blobURL: blobUrl,
    });
    console.log("Database insertion successful");

    return NextResponse.json({
      success: true,
      blobUrl,
    });

  } catch (error) {
    console.error("Vocal remover route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
