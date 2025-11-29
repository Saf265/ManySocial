"use client"

import { saveAs } from "file-saver";
import { ArrowLeft, Download, Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // 👈 NOUVEAU: Importez useEffect pour le chargement initial
import toast from "react-hot-toast";
import { useAudioPlayer } from "react-use-audio-player";

export default function ResultPage({ voiceURL }) {
  const router = useRouter();

  // Initialisation de l'audio player
  const {
    load,
    playing,
    togglePlayPause, // 👈 Fonction native pour jouer/mettre en pause
    position,
    duration,
    isPlaying,
    seek,
    isReady,
    // togglePlayPausePause est déjà inclus dans togglePlayPause
  } = useAudioPlayer();

  // 1. ✅ CORRECTION MAJEURE: Charger l'audio au montage du composant
  useEffect(() => {
    if (voiceURL) {
      // Charger l'URL directement. C'est la méthode la plus fiable.
      // On désactive l'autoplay ici pour se conformer aux politiques des navigateurs 
      // (qui bloquent souvent l'autoplay sans interaction utilisateur).
      load(voiceURL, {
        autoplay: false, // Charger sans jouer immédiatement
        format: "wav"
      });
    }
  }, [voiceURL, load]); // Dépend de voiceURL et load

  // 2. Gestionnaire du bouton Play/Pause
  // Nous n'avons plus besoin de fetch ici. Le bouton doit juste toggler la lecture.
  const handletogglePlayPause = () => {
    if (!isReady) {
      toast.error("L'audio n'est pas encore prêt. Veuillez attendre.");
      return;
    }
    // Utiliser la fonction native du hook pour jouer/mettre en pause
    togglePlayPause();
  }

  // 3. Gestionnaire de la barre de progression (Input Range)
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (isReady) {
      seek(newTime);
    }
  };

  // 4. Formater le temps (inchangé)
  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // 5. Télécharger le fichier (inchangé, sauf utilisation de blob direct)
  async function handleDownload() {
    try {
      if (!voiceURL) {
        toast.error("URL audio manquante.");
        return;
      }
      const response = await fetch(voiceURL);
      const blob = await response.blob();

      saveAs(blob, `voiceover-${Date.now()}.wav`);
      toast.success("Téléchargement lancé.");
    } catch (error) {
      console.error("Erreur téléchargement :", error);
      toast.error("Impossible de télécharger la voix off");
    }
  }

  if (!voiceURL) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-900 font-medium">URL de la voix off introuvable.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard/tools/voiceovers")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Voix Off Générée</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>Statut: {isReady ? 'Prêt' : 'Chargement...'}</span>
            <span>•</span>
            {/* Affiche la durée si elle est disponible */}
            <span>Durée: {formatTime(duration)}</span>
          </div>
        </div>

        {/* Audio Player Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Waveform Visualization (placeholder) */}
            <div className="w-full h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg mb-6 flex items-center justify-center">
              <div className="flex items-end gap-1 h-20">
                {/* Utiliser la position de l'hook pour l'animation */}
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-blue-600 rounded-full transition-all"
                    style={{
                      height: `${Math.random() * 100}%`,
                      opacity: (position / duration) * 40 > i ? 1 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="w-full">
              {/* Progress Bar */}
              {/* <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={position}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  disabled={!isReady || duration === 0}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(position)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div> */}

              {/* Play/Pause Button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={handletogglePlayPause} // 👈 Utiliser le nouveau gestionnaire
                  className="w-16 h-16 bg-blue-600 cursor-pointer hover:scale-90  hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all shadow-lg"
                  disabled={!isReady} // Désactiver si l'audio n'est pas prêt
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
            disabled={!voiceURL}
          >
            <Download size={20} />
            <span>Télécharger</span>
          </button>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 **Astuce:** Le lecteur est maintenant synchronisé avec le chargement initial de l'URL.
          </p>
        </div>
      </div>
    </div>
  );
}