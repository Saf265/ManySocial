"use client";

import { uploadFile } from "@/lib/upload-file";
import { Music, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

export default function VocalRemoverPage() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedAudio, setProcessedAudio] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      // Check file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux. Maximum 50 MB.");
        return;
      }

      setFile(selectedFile);
      setProcessedAudio(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    setIsProcessing(true);

    try {

      // Upload le fichier vers Vercel Blob
      const loadingToast = toast.loading("Upload du fichier...");
      const fileUrl = await uploadFile(file);
      toast.dismiss(loadingToast);

      console.log("File uploaded to:", fileUrl);

      const fileName =file.name
      const fileType = file.type 
     const slicedType = fileType.slice(0, 5)

     const response = await fetch("/api/tools/remove-vocals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrl }),
    });

    const data = await response.json();
    console.log("data", data)

    if (data.success) {
      setProcessedAudio(data.blobUrl);
      toast.success("Voix supprimées avec succès !");
    } else {
      toast.error(data.error || "Une erreur est survenue lors du traitement.");
    }
    } catch (error) {
      console.error('Error removing vocals:', error);
      toast.error("Une erreur est survenue lors du traitement.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setProcessedAudio(null);
  };

  return (
    <div className="w-full p-8 h-screen bg-white">
      <form className="h-full flex flex-col" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full max-h-[calc(100vh-100px)]">
          {/* Left Column */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col h-full">
            {/* Title and Description */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Suppresseur de voix IA
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                Téléchargez votre fichier audio ou vidéo et notre IA supprimera les voix, vous laissant avec une piste instrumentale.
              </p>
            </div>

            {/* Dropzone */}
            <div className="flex-1 flex flex-col min-h-0">
              <div
                {...getRootProps()}
                className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : file
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center max-w-sm">
                  {file ? (
                    <>
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <Music className="text-emerald-600" size={32} strokeWidth={1.5} />
                      </div>
                      <p className="text-gray-900 font-semibold mb-1 truncate w-full">
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
                        className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Changer de fichier
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="text-gray-400" size={32} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Télécharger audio/vidéo
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        {isDragActive
                          ? "Déposez le fichier ici"
                          : "Glissez-déposez ou cliquez pour parcourir"}
                      </p>
                      <p className="text-gray-400 text-xs px-4">
                        mp3, wav, ogg, flac, m4a, aac, mp4, mov, avi, webm • Max 50 MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !file}
              className="mt-6 w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Traitement en cours..." : "Supprimer les Voix"}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Suppressions Vocales Récentes
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Sélectionnez et téléchargez le clip pour supprimer la voix
                </p>
              </div>
              <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Voir tout
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
              {processedAudio ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Music className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Instrumental Généré</p>
                        <p className="text-xs text-gray-500">Prêt à être téléchargé</p>
                      </div>
                    </div>
                    <audio
                      controls
                      src={processedAudio}
                      className="w-full mb-4"
                    />
                    <a
                      href={processedAudio}
                      download="instrumental.mp3"
                      className="flex items-center justify-center w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Télécharger l'Instrumental
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="mb-6 opacity-30">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                      <circle cx="60" cy="60" r="50" fill="currentColor" className="text-gray-300" opacity="0.2" />
                      <path d="M60 40V80 M40 60H80" stroke="currentColor" className="text-gray-400" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun résultat pour le moment
                  </h3>
                  <p className="text-gray-500 text-sm max-w-[200px]">
                    D'abord, traitez un fichier audio pour voir les résultats ici !
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );


}
