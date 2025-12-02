"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("");
  const [outputUrl, setOutputUrl] = useState("");

  const getFileData = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Impossible de charger ${url}`);
  const buffer = await res.arrayBuffer(); // transforme Response en ArrayBuffer
  return new Uint8Array(buffer); // FFmpeg.writeFile attend Uint8Array
};

  const merge = async () => {
    try {
      setStatus("Chargement de FFmpeg…");

      // Crée l'instance FFmpeg
      const ffmpeg = new FFmpeg({ log: true });
      await ffmpeg.load();

      setStatus("Téléchargement des fichiers…");

      // Remplace ces URLs par les tiennes
      const videoUrl =
        "https://api.apify.com/v2/key-value-stores/vmi8PUH1nFn3ECtw1/records/video_9749e5645aca48f295c05f49179a00f9";
      const audioUrl =
        "https://api.apify.com/v2/key-value-stores/vmi8PUH1nFn3ECtw1/records/audio_1cf7375beb0b42eaa6ed8450e6ddac44";

      const videoData = await getFileData(videoUrl);
console.log(videoData.status);
      const audioData = await getFileData(audioUrl);
console.log(audioData.status);
      ffmpeg.writeFile("input_video.mp4", videoData);
      ffmpeg.writeFile("input_audio.mp3", audioData);

      setStatus("Fusion en cours…");

      await ffmpeg.exec([
        "-i",
        "input_video.mp4",
        "-i",
        "input_audio.mp3",
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-shortest",
        "output.mp4",
      ]);

      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      setOutputUrl(url);
      setStatus("Terminé !");
    } catch (err) {
      console.error(err);
      setStatus("Erreur : " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={merge}>Fusionner</button>
      <p>{status}</p>
      {outputUrl && (
        <video
          controls
          src={outputUrl}
          style={{ width: "100%", marginTop: 20 }}
        />
      )}
    </div>
  );
}
