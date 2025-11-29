"use client";

import { handleDonwloadFormat } from "@/features/youtube-download/server/youtube-action";
import { extractYouTubeId } from "@/utils/actions-youtube";
import { Download } from "lucide-react";
import { useState } from "react";

export default function YoutubeDownloadPage(){
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [videoData, setVideoData] = useState(null);

    const handleDownload = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setVideoData(null);

        if (!url.trim()) {
            setError("Veuillez coller un lien YouTube");
            return;
        }

        setLoading(true);
        try {
            const id = extractYouTubeId(url);
            console.log("id", id);
            
            const response = await fetch("/api/tools/social/youtube", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: id }),
            });

            const data = await response.json();
            console.log("data", data);
            
            if (data.error) {
                setError(data.error);
            } else {
                setVideoData(data);
                setSuccess("Vidéo chargée avec succès!");
            }
        } catch (err) {
            setError("Échec du téléchargement vidéo");
        } finally {
            setLoading(false);
        }
    };

    const handleDonwloadFormats= async (url)=>{
      console.log(url)
      const id = await handleDonwloadFormat(url)
      const response = await fetch(id)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      saveAs(blobUrl, "video.mp4")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
            <div className="max-w-2xl w-full">
                {/* Header */}
                
                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                    {!videoData ? (
                        <form onSubmit={handleDownload} className="space-y-6">
                            {/* Input Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Lien vidéo YouTube
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="Collez le lien YouTube ici..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-700 text-sm font-medium">{success}</p>
                                </div>
                            )}

                            {/* Download Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#2563eb] cursor-pointer hover:bg-[#1d4ed8] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                {loading ? "Téléchargement..." : "Télécharger la vidéo"}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {/* Video Info */}
                            <div className="flex gap-4">
                                {videoData.videoInfo?.thumbnail && (
                                    <img
                                        src={videoData.videoInfo.thumbnail}
                                        alt="Thumbnail"
                                        className="w-32 h-24 rounded-lg object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                                        {videoData.videoInfo?.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-2">
                                        👁️ {parseInt(videoData.videoInfo?.viewCount).toLocaleString()} vues
                                    </p>
                                    {videoData.videoInfo?.keywords && (
                                        <p className="text-xs text-[#2563eb] line-clamp-2">
                                            {videoData.videoInfo.keywords}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Formats List */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900">Qualités disponibles</h3>
                                {videoData.mp4Formats?.map((format) => (
                                    <div
                                        key={format.qualityLabel}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{format.qualityLabel}</p>
                                            <p className="text-sm text-gray-600">
                                                {(format.bitrate / 1024 / 1024).toFixed(2)} Mbps
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => window.open(format.url, "_blank")}
                                            className="text-xs px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            Ouvrir
                                        </button>
                                        <button
                                            onClick={() => handleDonwloadFormats(format.url)}
                                            className="flex items-center gap-1 text-xs px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            <Download size={14} />
                                            Télécharger
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Back Button */}
                            <button
                                onClick={() => {
                                    setVideoData(null);
                                    setUrl("");
                                    setSuccess("");
                                }}
                                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Retour
                            </button>
                        </div>
                    )}

                    {!videoData && (
                        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="text-sm font-semibold text-[#2563eb] mb-2">ℹ️ Comment utiliser</h3>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li>• Copiez le lien d'une vidéo YouTube</li>
                                <li>• Collez-le dans le champ ci-dessus</li>
                                <li>• Cliquez sur "Télécharger la vidéo" pour commencer</li>
                                <li>• Votre vidéo sera sauvegardée au format MP4</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}