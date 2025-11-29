"use client";


import { extractYouTubeId } from "@/utils/actions-youtube";
import { Download } from "lucide-react";
import { useState } from "react";

export default function YoutubeDownloadPage(){
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    
    const handleDownload = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!url.trim()) {
            setError("Veuillez coller un lien YouTube");
            return;
        }

        setLoading(true);
        try {
            const id = extractYouTubeId(url);
            console.log("id", id)
            
            const response = await fetch("/api/tools/social/youtube", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url:id }),
            });

            const data = await response.json();
            console.log("data", data)
            setSuccess("Téléchargement commencé !");
            // const response = await fetch(downloadUrl);
            // const blob = await response.blob();
            // const blobUrl = URL.createObjectURL(blob);
            // saveAs(blobUrl, "video.mp4");
            setUrl("");
        } catch (err) {
            setError("Échec du téléchargement vidéo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
            <div className="max-w-2xl w-full">
                {/* Header */}
                
                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
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

                    {/* Info Box */}
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-[#2563eb] mb-2">ℹ️ Comment utiliser</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Copiez le lien d'une vidéo YouTube</li>
                            <li>• Collez-le dans le champ ci-dessus</li>
                            <li>• Cliquez sur "Télécharger la vidéo" pour commencer</li>
                            <li>• Votre vidéo sera sauvegardée au format MP4</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}