import { db } from "@/db/drizzle";
import { VoicesGenerated } from "@/db/drizzle/schema";
import { uploadFile } from "@/lib/upload-file"; // Assurez-vous que cette fonction gère l'upload du Buffer
import { GoogleGenAI } from "@google/genai";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { PassThrough } from "stream"; // Importation nécessaire pour travailler avec les buffers
import wav from 'wav';

/**
 * Crée un Buffer WAV valide en encapsulant les données PCM brutes avec un en-tête WAV.
 * * @param {Buffer} pcmData - Les données audio brutes (PCM) reçues de l'API Gemini.
 * @param {number} channels - Nombre de canaux (1 pour mono).
 * @param {number} rate - Taux d'échantillonnage (24000 Hz est la valeur par défaut pour Gemini TTS).
 * @param {number} sampleWidth - Taille de l'échantillon en octets (2 pour 16-bit).
 * @returns {Promise<Buffer>} Le Buffer du fichier WAV complet.
 */
async function createWaveBuffer(
  pcmData,
  channels = 1,
  rate = 24000,
  sampleWidth = 2,
) {
  return new Promise((resolve, reject) => {
    // Le writer crée l'en-tête WAV et écrit les données
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8, // 16 bits
    });

    const buffers = [];
    // Utiliser un PassThrough stream pour capturer la sortie du writer en mémoire
    const stream = new PassThrough();

    stream.on('data', (chunk) => {
      buffers.push(chunk);
    });

    stream.on('finish', () => {
      // Concaténer tous les morceaux pour former le Buffer WAV complet
      resolve(Buffer.concat(buffers));
    });

    stream.on('error', reject);

    // Lier le writer à notre stream en mémoire
    writer.pipe(stream);

    // Écrire les données PCM brutes
    writer.write(pcmData);
    writer.end();
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, script, voice, rythme, tonalite } = body;

    // Validation (inchangée)
    if (!title || !title.trim() || !script || !script.trim() || !voice || !voice.trim()) {
      return NextResponse.json(
        { success: false, error: "Tous les champs (titre, script, voix) sont requis" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEN_AI_KEY
    });

    // Determine tone description based on pitch (tonalite)
    let toneDesc = "neutral tone";
    if (tonalite < 0.8) toneDesc = "very deep and gravelly tone";
    else if (tonalite < 1.0) toneDesc = "low and resonant tone";
    else if (tonalite > 1.2) toneDesc = "very high and light tone";
    else if (tonalite > 1.0) toneDesc = "slightly higher and brighter tone";

    // Determine pace description based on speed (rythme)
    let paceDesc = "natural pacing";
    if (rythme < 0.8) paceDesc = "very slow and deliberate pacing";
    else if (rythme < 1.0) paceDesc = "slow and calm pacing";
    else if (rythme > 1.2) paceDesc = "very fast and urgent pacing";
    else if (rythme > 1.0) paceDesc = "quick and energetic pacing";

    const promptText = `
Say with a ${toneDesc}, ${paceDesc}:
"${script}"
`;

    // 1. Appel à l'API TTS de Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    // Extraction des données Base64
    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!data) {
      throw new Error("Aucune donnée audio reçue de l'API.");
    }

    // Conversion du Base64 en Buffer de données PCM brutes
    const audioBuffer = Buffer.from(data, 'base64');

    // 2. Création du fichier WAV valide (avec en-tête) en mémoire
    // On suppose: 1 canal (Mono), 24000 Hz, 16 bits (2 octets)
    const waveBuffer = await createWaveBuffer(audioBuffer, 1, 24000, 2);

    // 3. Upload du Buffer WAV complet
    const audioURL = await uploadFile(waveBuffer); // Stocke un fichier .wav valide

    // 4. Stockage en base de données
    const randomId = nanoid()
    const dataStocked = await db.insert(VoicesGenerated).values({
      title: title.trim(),
      text: script.trim(),
      audioURL: audioURL,
      userId: "temp-userId", // Remplacer par l'ID utilisateur réel
      id: randomId
    }).returning()

    // 5. Retour
    return NextResponse.json({
      success: true,
      message: "Voix off générée et stockée avec succès",
      id: dataStocked[0].id
    });

  } catch (error) {
    console.error("Erreur dans la génération de voix off:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Une erreur est survenue lors du traitement."
      },
      { status: 500 }
    );
  }
}