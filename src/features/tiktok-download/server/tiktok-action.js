"use server"

export const getDownloadUrl = async (videoUrl) => {
  const params = new URLSearchParams({ videoUrl });

  try {
    const response = await fetch(
      `https://tiktok-video-downloader-api.p.rapidapi.com/media?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY,
          'x-rapidapi-host': 'tiktok-video-downloader-api.p.rapidapi.com',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    const downloadUrl = data.downloadUrl;
    console.log('First response received, download URL:', downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error('Error fetching download URL:', error);
    throw error;
  }
};


export async function fetchAndDownload(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Erreur réseau");
  const blob = await response.blob();  // transforme en Blob :contentReference[oaicite:0]{index=0}

  // Pour forcer le téléchargement
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = "file.wav";  // ou un autre nom selon ton audio
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
}
