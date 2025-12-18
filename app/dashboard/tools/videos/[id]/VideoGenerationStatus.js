"use client";

import { saveAs } from "file-saver";
import { CheckCircle2, Download, Film, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VideoGenerationStatus({ jobId }) {
  const [status, setStatus] = useState("processing");
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(null);
  const [jobData, setJobData] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/tools/generate-video/processing?videoId=${jobId}`);
        const data = await res.json();

        setStatus(data.status);
        setJobData(data);

        if (data.status === "completed") {
          setBlobUrl(data.blobUrl);
        }

        if (data.status === "error") {
          setError(data.error || "Une erreur est survenue");
        }
      } catch (err) {
        console.error("Error checking status:", err);
        setError("Impossible de vérifier le statut");
      }
    };

    // Check immediately
    checkStatus();

    // Then poll every 5 seconds if still processing
    const interval = setInterval(() => {
      if (status !== "completed" && status !== "error") {
        checkStatus();
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleDownload = async () => {
    if (!blobUrl) return;
    
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      saveAs(blob, `video-${jobId}.mp4`);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        
        {/* Processing State */}
        {status === "processing" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-blue-500 p-6 rounded-full">
                  <Film className="w-12 h-12 text-white animate-pulse" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Génération de votre vidéo en cours
                </h2>
                <p className="text-gray-600">
                  Cela peut prendre quelques minutes. Ne fermez pas cette page.
                </p>
              </div>

              {/* Loading Bar */}
              <div className="w-full max-w-md">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
                </div>
              </div>

              {/* Info */}
              {jobData && (
                <div className="bg-gray-50 rounded-lg p-4 w-full max-w-md space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Modèle :</span>
                    <span className="font-medium text-gray-900">{jobData.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Durée :</span>
                    <span className="font-medium text-gray-900">{jobData.duration}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Format :</span>
                    <span className="font-medium text-gray-900">{jobData.aspectRatio}</span>
                  </div>
                </div>
              )}

              {/* Spinner */}
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Vérification du statut...</span>
              </div>
            </div>
          </div>
        )}

        {/* Completed State */}
        {status === "completed" && blobUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-6xl mx-auto">
            {/* Success Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Vidéo générée avec succès !</h2>
                <p className="text-sm text-gray-600">Votre vidéo est prête à être téléchargée.</p>
              </div>
            </div>

            
              {/* Video Player */}
                <div className="relative mb-4 rounded-lg overflow-hidden bg-black aspect-video">
                  <video 
                    src={blobUrl} 
                    controls 
                    autoPlay
                    className="w-full h-full"
                  />
                </div>

            

            {/* Prompt Display */}
            {jobData?.prompt && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 mb-1">Prompt utilisé</p>
                <p className="text-sm text-gray-900 line-clamp-2">{jobData.prompt}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <Download size={18} />
                Télécharger
              </button>
              <Link
                href="/dashboard/tools/videos"
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Nouvelle vidéo
              </Link>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Error Icon */}
              <div className="bg-red-100 p-6 rounded-full">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>

              {/* Title */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Erreur lors de la génération
                </h2>
                <p className="text-gray-600">
                  {error || "Une erreur est survenue lors de la génération de votre vidéo."}
                </p>
              </div>

              {/* Error Details */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full max-w-md">
                  <p className="text-sm text-red-800 font-mono">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <Link
                  href="/dashboard/tools/videos"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Réessayer
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
