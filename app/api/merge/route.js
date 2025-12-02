import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import fs from "fs/promises";
import os from "os";
import path from "path";

const DEFAULT_TIMEOUT_MS = 120000; // 2 minutes, adapte si besoin

function extFromContentType(ct) {
  if (!ct) return "";
  if (ct.includes("audio/mpeg")) return ".mp3";
  if (ct.includes("audio/wav")) return ".wav";
  if (ct.includes("audio/")) return ".m4a";
  if (ct.includes("video/mp4")) return ".mp4";
  if (ct.includes("video/")) return ".mp4";
  return "";
}

async function downloadToFile(url, destBase) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Téléchargement échoué (${url}) : ${res.status} ${res.statusText}`);

  const contentType = res.headers.get("content-type") || "";
  // extension from URL if possible
  const parsed = new URL(url);
  const urlExt = path.extname(parsed.pathname);
  const ext = urlExt || extFromContentType(contentType) || "";

  const destPath = destBase + ext;
  const arrayBuffer = await res.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);

  // sanity checks
  if (buf.length < 100) {
    // file trop petit => probablement HTML ou JSON (error page)
    const snippet = buf.toString("utf8", 0, Math.min(buf.length, 1000));
    throw new Error(`Fichier téléchargé depuis ${url} trop petit (${buf.length} bytes). Contenu (début): ${snippet}`);
  }

  await fs.writeFile(destPath, buf);
  return { path: destPath, contentType, size: buf.length };
}

export async function POST(req) {
  try {
    if (!ffmpegPath) throw new Error("ffmpeg binaire introuvable (ffmpeg-static returned falsy).");

    const { audioUrl, videoUrl } = await req.json();

    if (!audioUrl || !videoUrl) {
      return new Response(JSON.stringify({ error: "audioUrl et videoUrl requis" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "merge-"));
    const videoBase = path.join(tmpDir, "video_input");
    const audioBase = path.join(tmpDir, "audio_input");
    const outPath = path.join(tmpDir, "output.mp4");

    // download with detection
    const [videoInfo, audioInfo] = await Promise.all([
      downloadToFile(videoUrl, videoBase),
      downloadToFile(audioUrl, audioBase),
    ]);

    // build ffmpeg args (use detected paths)
    const args = [
      "-y",
      "-i", videoInfo.path,
      "-i", audioInfo.path,
      "-map", "0:v:0",
      "-map", "1:a:0",
      "-c:v", "copy",
      "-c:a", "aac",
      "-shortest",
      outPath,
    ];

    // spawn ffmpeg and capture stderr
    const ffProcessPromise = new Promise((resolve, reject) => {
      const ff = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
      let stderr = "";
      ff.stderr.on("data", (d) => { stderr += d.toString(); });

      ff.on("error", (err) => reject({ code: "spawn_error", err: String(err), stderr }));
      ff.on("close", (code) => {
        if (code === 0) resolve({ code, stderr });
        else reject({ code, stderr });
      });
    });

    // timeout wrapper
    const result = await Promise.race([
      ffProcessPromise,
      new Promise((_, reject) => setTimeout(() => reject({ code: "timeout", stderr: "ffmpeg timeout" }), DEFAULT_TIMEOUT_MS))
    ]).catch(async (e) => {
      // try kill ffmpeg processes if any (best-effort)
      // cleanup before rethrowing
      try { await fs.rm(tmpDir, { recursive: true, force: true }); } catch(_) {}
      throw e;
    });

    // read output
    const fileBuffer = await fs.readFile(outPath);

    // cleanup
    try { await fs.rm(tmpDir, { recursive: true, force: true }); } catch (_) {}

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(fileBuffer.length),
        "Content-Disposition": `attachment; filename="merged.mp4"`,
      },
    });

  } catch (err) {
    console.error("merge error debug:", err);
    // Normalise l'erreur pour renvoyer des infos utiles au client (sans être trop verbeux)
    const payload = {
      error: (err && err.message) ? err.message : String(err),
      // si l'erreur a un stderr (objet rejeté plus haut), renvoie-le aussi
      ffmpeg_stderr: err && err.stderr ? err.stderr : undefined,
      code: err && err.code ? err.code : undefined,
    };
    return new Response(JSON.stringify(payload), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
