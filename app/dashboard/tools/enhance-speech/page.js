"use client";

import { uploadFile } from "@/lib/upload-file";
import { Check, Cloud, Download, Link as LinkIcon, Music, Pause, Play, RefreshCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import 'react-h5-audio-player/lib/styles.css';
import toast from "react-hot-toast";
import { useAudioPlayer } from "react-use-audio-player";

export default function EnhanceSpeechPage() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultFile, setResultFile] = useState(null);
  const [activeAudioUrl, setActiveAudioUrl] = useState(null);
  const { load, playing,  togglePlayPause, isPlaying } = useAudioPlayer();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux. Maximum 50 MB.");
        return;
      }

      setFile(selectedFile);
      setResultFile(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac"],
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Amélioration de la voix en cours...");

    try {
      const fileUrl = await uploadFile(file);
      const isVideo = file.type.startsWith("video");

      const response = await fetch("/api/tools/enhance-vocal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrl,
          fileType: isVideo ? "video" : "audio",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors du traitement");
      }

      const data = await response.json();

      if (data.fileURL) {
        setResultFile(data.fileURL);
        toast.success("Voix améliorée avec succès !", { id: loadingToast });
      } else {
        throw new Error("URL du fichier manquante dans la réponse");
      }
    } catch (error) {
      console.error("Error enhancing speech:", error);
      toast.error(error.message || "Une erreur est survenue lors du traitement.", {
        id: loadingToast,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResultFile(null);
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-6">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white shrink-0">
            <LinkIcon size={18} className="text-gray-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Améliorer la voix
            </h1>
            <p className="text-gray-500 text-sm">
              Téléchargez un fichier vidéo ou audio pour améliorer la clarté audio.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {!resultFile ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : file
                    ? "border-gray-300 hover:border-gray-400 bg-white"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/30"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center mb-4">
                     {file ? (
                      <Check className="text-green-500" size={24} />
                    ) : (
                      <Cloud className="text-gray-400" size={24} />
                    )}
                  </div>

                  {file ? (
                    <>
                      <p className="text-gray-900 font-medium mb-1 truncate max-w-full px-4">
                        {file.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReset();
                        }}
                        className="mt-4 text-sm text-blue-600 font-medium hover:underline flex items-center gap-1.5 mx-auto"
                      >
                        <RefreshCcw size={14} />
                        Changer de fichier
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Télécharger audio/vidéo
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Glissez-déposez ou cliquez pour parcourir
                      </p>
                      <p className="text-gray-400 text-xs">
                        mp3, wav, m4a, ogg, aac, mp4, mov, avi, webm • Max 50 MB
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  type="submit"
                  disabled={isProcessing || !file}
                  className="bg-[#2563eb] text-white px-6 py-2.5 rounded-lg font-medium transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCcw className="animate-spin" size={18} />
                      Traitement...
                    </>
                  ) : (
                    "Améliorer le fichier"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Music size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                       Audio Amélioré
                    </h3>
                    <p className="text-xs text-gray-500">Votre fichier est prêt !</p>
                  </div>
                </div>

                <div className="flex items-center justify-center bg-gray-100 rounded-xl p-6 mb-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (activeAudioUrl === resultFile) {
                        togglePlayPause();
                      } else {
                        load("https://acchkx67jxpygqwf.public.blob.vercel-storage.com/file-prb7j-qkVsA2xVrpfeTWr-Dkqxpc4efkagLBV2BBkb00QDKPgnn8", { autoplay: true, format: "mp3" });
                        setActiveAudioUrl(resultFile);
                      }
                    }}
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:scale-105 transition-all text-blue-600"
                  >
                    {activeAudioUrl === resultFile && isPlaying ? (
                      <Pause size={24} fill="currentColor" />
                    ) : (
                      <Play size={24} fill="currentColor" className="ml-0.5" />
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDownload(resultFile, `${file?.name?.split(".")[0] || 'audio'}_enhanced.mp3`)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <Download size={18} />
                    Télécharger
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Nouveau fichier
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
                        
    </div>
  );
}
