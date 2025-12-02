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

     const response = await fetch("/api/tools/enhance-vocal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrl, fileType }),
    });

    const data = await response.json();
    console.log("data", data)


      // if (slicedType === "audio") {
      //   setProcessedAudio(data.audioUrl);
      //   toast.success("Voix supprimées avec succès !");
      // } else {
      //   toast.error(data.error || "Une erreur est survenue lors du traitement.");
      // }
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
    <div className="w-full p-8 h-screen">
      <form className="h-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 h-full lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6 h-full">
            {/* Title and Description */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Suppresseur de Voix IA
              </h1>
              <p className="text-sm text-gray-600">
                Téléchargez votre fichier audio ou vidéo et notre IA supprimera les voix, vous laissant avec une piste instrumentale.
              </p>
            </div>

            {/* Dropzone */}
            <div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : file
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  {file ? (
                    <>
                      <Music className="text-green-600 mb-4" size={48} strokeWidth={1.5} />
                      <p className="text-gray-900 font-medium mb-1">
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
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                      >
                        Changer de fichier
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-400 mb-4" size={48} strokeWidth={1.5} />
                      <p className="text-gray-900 font-medium mb-1">
                        Télécharger audio/vidéo
                      </p>
                      <p className="text-gray-500 text-sm mb-2">
                        {isDragActive
                          ? "Déposez le fichier ici"
                          : "Glissez-déposez ou cliquez pour parcourir"}
                      </p>
                      <p className="text-gray-400 text-xs">
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
              className="w-full bg-[#2563eb] text-white py-3 rounded-lg cursor-pointer font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Traitement en cours..." : "Supprimer les Voix"}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="h-full">
            <div className="bg-white h-full rounded-lg p-8 border border-gray-200 min-h-[500px]">
              {processedAudio ? (
                <div>
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                    <Music className="text-gray-700" size={20} strokeWidth={1.5} />
                    <h3 className="text-base font-medium text-gray-700">
                      Suppressions Vocales Récentes
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-3">
                        Sélectionnez et téléchargez le clip pour supprimer la voix
                      </p>
                      <audio
                        controls
                        src={processedAudio}
                        className="w-full mb-3"
                      />
                      <a
                        href={processedAudio}
                        download="instrumental.mp3"
                        className="inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Télécharger l'Instrumental
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start h-full">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 w-full">
                    <Music className="text-gray-700" size={20} strokeWidth={1.5} />
                    <h3 className="text-base font-medium text-gray-700">
                      Suppressions Vocales Récentes
                    </h3>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <div className="text-gray-300 mb-4">
                      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <circle cx="60" cy="60" r="50" fill="currentColor" opacity="0.1" />
                        <path d="M60 35v50M35 60h50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p className="text-gray-900 font-medium mb-1">
                      Aucun Résultat Pour le Moment
                    </p>
                    <p className="text-gray-500 text-sm text-center">
                      D'abord, Générez une Narration !
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
