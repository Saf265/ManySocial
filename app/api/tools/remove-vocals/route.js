import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    const { fileUrl, fileName } = await request.json();

    if (!fileUrl) {
      return NextResponse.json({
        error: "Aucun fichier fourni",
        success: false,
      }, { status: 400 });
    }

    console.log("File URL from Vercel Blob:", fileUrl);

    // Télécharger le fichier depuis Vercel Blob
    const fileResponse = await fetch(fileUrl);
    const fileBuffer = await fileResponse.arrayBuffer();

    // Étape 1: Upload le fichier vers LALAL.AI
    const uploadResponse = await fetch('https://www.lalal.ai/api/upload/', {
      method: 'POST',
      headers: {
        'Content-Disposition': `attachment; filename="${fileName || 'upload.mp4'}"`,
        'Authorization': `license ${process.env.LALAL_API_KEY}`
      },
      body: fileBuffer
    });

    const uploadResult = await uploadResponse.json();
    console.log("Upload result:", uploadResult);

    if (uploadResult.status !== "success") {
      return NextResponse.json({
        error: uploadResult.error || "Erreur lors de l'upload",
        success: false
      }, { status: 400 });
    }

    const fileId = uploadResult.id;

    // Étape 2: Lancer le split (suppression des voix)
    const splitParams = JSON.stringify([{
      id: fileId,
      stem: "vocals"
    }]);

    const splitFormData = new URLSearchParams();
    splitFormData.append('params', splitParams);

    const splitResponse = await fetch('https://www.lalal.ai/api/split/', {
      method: 'POST',
      headers: {
        'Authorization': `license ${process.env.LALAL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: splitFormData
    });

    const splitResult = await splitResponse.json();
    console.log("Split result:", splitResult);

    if (splitResult.status !== "success") {
      return NextResponse.json({
        error: splitResult.error || "Erreur lors du split",
        success: false
      }, { status: 400 });
    }

    // Étape 3: Attendre et vérifier le résultat (polling)
    let checkAttempts = 0;
    const maxAttempts = 60; // 60 tentatives = 2 minutes max
    let checkResult;

    while (checkAttempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes

      const checkFormData = new URLSearchParams();
      checkFormData.append('id', fileId);

      const checkResponse = await fetch('https://www.lalal.ai/api/check/', {
        method: 'POST',
        headers: {
          'Authorization': `license ${process.env.LALAL_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: checkFormData
      });

      checkResult = await checkResponse.json();
      console.log("Check result:", checkResult);

      if (checkResult.status === "success" && checkResult.result[fileId]) {
        const fileResult = checkResult.result[fileId];

        if (fileResult.task?.state === "success" && fileResult.split) {
          // Traitement terminé avec succès
          return NextResponse.json({
            success: true,
            audioUrl: fileResult.split.back_track, // back_track = instrumental (sans voix)
            stemUrl: fileResult.split.stem_track, // stem_track = voix uniquement
            data: fileResult,
            message: "Voix supprimées avec succès"
          }, { status: 200 });
        }

        if (fileResult.task?.state === "error") {
          return NextResponse.json({
            error: fileResult.task.error || "Erreur lors du traitement",
            success: false
          }, { status: 400 });
        }

        if (fileResult.task?.state === "cancelled") {
          return NextResponse.json({
            error: "Traitement annulé",
            success: false
          }, { status: 400 });
        }
      }

      checkAttempts++;
    }

    // Timeout
    return NextResponse.json({
      error: "Timeout: le traitement prend trop de temps",
      success: false
    }, { status: 408 });

  } catch (error) {
    console.error("Error removing vocals:", error);
    return NextResponse.json({
      error: "Erreur lors de la suppression des voix",
      success: false,
      details: error.message
    }, { status: 500 });
  }
}
