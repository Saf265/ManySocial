"use client";

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
      console.log(blobUrl);
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `video-${jobId}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
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
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* Success Header */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Vidéo générée avec succès !</h2>
                  <p className="text-gray-600">Votre vidéo est prête à être téléchargée.</p>
                </div>
              </div>

              {/* Video Player */}
              <div className="mb-6">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                  <video 
                    src={blobUrl} 
                    controls 
                    autoPlay
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Info Grid */}
              {jobData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Modèle</p>
                    <p className="font-semibold text-gray-900 text-sm">{jobData.model}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Durée</p>
                    <p className="font-semibold text-gray-900 text-sm">{jobData.duration}s</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Format</p>
                    <p className="font-semibold text-gray-900 text-sm">{jobData.aspectRatio}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">ID</p>
                    <p className="font-mono text-xs text-gray-900 truncate">{jobId.slice(0, 8)}...</p>
                  </div>
                </div>
              )}

              {/* Prompt Display */}
              {jobData?.prompt && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-xs text-gray-600 mb-2">Prompt utilisé</p>
                  <p className="text-sm text-gray-900">{jobData.prompt}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Download size={20} />
                  Télécharger la vidéo
                </button>
                <Link
                  href="/dashboard/tools/videos"
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Générer une nouvelle vidéo
                </Link>
              </div>
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
              {jobData && (
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
