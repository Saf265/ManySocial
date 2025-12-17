"use client";

import { Activity, ArrowRightLeft, Gauge, Heart, Mic, Pause, Play, Search, Settings, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAudioPlayer } from "react-use-audio-player";

const voices = [
  { name: "Zephyr", gender: "Female", description: "Bright, Higher pitch", tags: ["Female", "Higher pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357160/Zephyr_eg9cfn.wav" },
  { name: "Puck", gender: "Male", description: "Upbeat, Middle pitch", tags: ["Male", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357157/Puck_mcncoc.wav" },
  { name: "Charon", gender: "Male", description: "Informative, Lower pitch", tags: ["Male", "Lower pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357156/Charon_r2cgxn.wav" },
  { name: "Kore", gender: "Female", description: "Firm, Middle pitch", tags: ["Female", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357156/Kore_ueryyo.wav" },
  { name: "Fenrir", gender: "Male", description: "Excitable, Lower middle", tags: ["Male", "Lower middle", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357153/Fenrir_ttsyfe.wav" },
  { name: "Leda", gender: "Female", description: "Youthful, Higher pitch", tags: ["Female", "Higher pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357151/Leda_vkmcgl.wav" },
  { name: "Orus", gender: "Male", description: "Firm, Lower middle pitch", tags: ["Male", "Lower middle", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357148/Orus_zur34d.wav" },
  { name: "Aoede", gender: "Female", description: "Breezy, Middle pitch", tags: ["Female", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357148/Aoede_zyqwof.wav" },
  { name: "Callirrhoe", gender: "Female", description: "Easy-going, Middle pitch", tags: ["Female", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357148/Callirrhoe_ybistv.wav" },
  { name: "Autonoe", gender: "Female", description: "Bright, Middle pitch", tags: ["Female", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357147/Autonoe_cqftiy.wav" },
  { name: "Enceladus", gender: "Male", description: "Breathy, Lower pitch", tags: ["Male", "Lower pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357142/Enceladus_bw5t73.wav" },
  { name: "Lapetus", gender: "Male", description: "Clear, Lower middle pitch", tags: ["Male", "Lower middle", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357143/Iapetus_kly6by.wav" },
  { name: "Umbriel", gender: "Male", description: "Easy-going, Lower middle pitch", tags: ["Male", "Lower middle", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357141/Umbriel_zqiovl.wav" },
  { name: "Algieba", gender: "Male", description: "Smooth, Lower pitch", tags: ["Male", "Lower pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357141/Algieba_odsuon.wav" },
  { name: "Despina", gender: "Female", description: "Smooth, Middle pitch", tags: ["Female", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357141/Despina_uawaph.wav" },
  { name: "Erinome", gender: "Female", description: "Clear, Middle pitch", tags: ["Female", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357137/Erinome_lqobgj.wav" },
  { name: "Algenib", gender: "Male", description: "Gravelly, Lower pitch", tags: ["Male", "Lower pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357136/Algenib_uztsbp.wav" },
  { name: "Rasalgethi", gender: "Male", description: "Informative, Middle pitch", tags: ["Male", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357136/Rasalgethi_ryuuiv.wav" },
  { name: "Laomedeia", gender: "Female", description: "Upbeat, Higher pitch", tags: ["Female", "Higher pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357135/Laomedeia_napji0.wav" },
  { name: "Achernar", gender: "Female", description: "Soft, Higher pitch", tags: ["Female", "Higher pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357135/Achernar_ku8wmf.wav" },
  { name: "Alnilam", gender: "Male", description: "Firm, Lower middle pitch", tags: ["Male", "Lower middle", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357132/Alnilam_olivhd.wav" },
  { name: "Schedar", gender: "Male", description: "Even, Lower middle pitch", tags: ["Male", "Lower middle", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357131/Schedar_qrdcqo.wav" },
  { name: "Gacrux", gender: "Female", description: "Mature, Middle pitch", tags: ["Female", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357131/Gacrux_cdcu1f.wav" },
  { name: "Pulcherrima", gender: "Female", description: "Forward, Middle pitch", tags: ["Female", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357131/Pulcherrima_kxewml.wav" },
  { name: "Achird", gender: "Male", description: "Friendly, Lower middle pitch", tags: ["Male", "Lower middle", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357131/Achird_lkd3xs.wav" },
  { name: "Zubenelgenubi", gender: "Male", description: "Casual, Lower middle pitch", tags: ["Male", "Lower middle", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357131/Zubenelgenubi_udats0.wav" },
  { name: "Vindemiatrix", gender: "Female", description: "Gentle, Middle pitch", tags: ["Female", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357130/Vindemiatrix_lhfgwx.wav" },
  { name: "Sadachbia", gender: "Male", description: "Lively, Lower pitch", tags: ["Male", "Lower pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357130/Sadachbia_qlovue.wav" },
  { name: "Sadaltager", gender: "Male", description: "Knowledgeable, Middle pitch", tags: ["Male", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357130/Sadaltager_yfc44s.wav" },
  { name: "Sulafat", gender: "Female", description: "Warm, Middle pitch", tags: ["Female", "Middle pitch", "Multilingual"], voicePreview: "https://res.cloudinary.com/dotihphpy/video/upload/v1764357130/Sulafat_gb7lnj.wav" }
];

export default function VoiceGenerator({ initialVoiceovers = [] }) {
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVoiceovers, setGeneratedVoiceovers] = useState(initialVoiceovers);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("Zephyr");
  const [rythme, setRythme] = useState(1.0);
  const [tonalite, setTonalite] = useState(1.0);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [activeAudioUrl, setActiveAudioUrl] = useState(null);
  const { load, playing, togglePlay } = useAudioPlayer();

  // Load favorites from sessionStorage
  useEffect(() => {
    const storedFavorites = sessionStorage.getItem("voiceover-favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);
  const router = useRouter()

  // Save favorites to sessionStorage
  const toggleFavorite = (voiceName) => {
    const newFavorites = favorites.includes(voiceName)
      ? favorites.filter(f => f !== voiceName)
      : [...favorites, voiceName];
    setFavorites(newFavorites);
    sessionStorage.setItem("voiceover-favorites", JSON.stringify(newFavorites));
  };

  // Filter and sort voices
  const filteredVoices = voices
    .filter(voice =>
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.gender.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aIsFav = favorites.includes(a.name);
      const bIsFav = favorites.includes(b.name);
      if (aIsFav && !bIsFav) return -1;
      if (!aIsFav && bIsFav) return 1;
      return 0;
    });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      toast.error("Veuillez entrer un titre");
      return;
    }

    if (!script.trim()) {
      toast.error("Veuillez entrer un script");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/tools/voiceovers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          script: script.trim(),
          voice: selectedVoice,
          rythme,
          tonalite
        }),
      });

      const data = await response.json();

      if (data.success && data.id) {

        toast.success("Voix générée avec succès !");
        setTitle("");
        setScript("");
        router.push(`/dashboard/tools/voiceovers/${data.id}`)
      } else {
        toast.error(data.error || "Une erreur est survenue lors de la génération.");
      }
    } catch (error) {
      console.error('Error generating voiceover:', error);
      toast.error("Une erreur est survenue lors de la génération.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (!title.trim() || !script.trim() || isGenerating) return;
        handleSubmit(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [title, script, selectedVoice, rythme, tonalite, isGenerating]);

  const characterCount = script.length;
  const estimatedDuration = Math.ceil(characterCount / 15);

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

  // Get color for voice avatar
  const getVoiceColor = (name) => {
    const gradients = [
      "bg-gradient-to-br from-pink-500 to-rose-500",
      "bg-gradient-to-br from-purple-500 to-indigo-500",
      "bg-gradient-to-br from-blue-500 to-cyan-500",
      "bg-gradient-to-br from-emerald-500 to-teal-500",
      "bg-gradient-to-br from-orange-500 to-amber-500",
      "bg-gradient-to-br from-red-500 to-orange-500",
      "bg-gradient-to-br from-indigo-500 to-blue-500",
      "bg-gradient-to-br from-teal-500 to-emerald-500"
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="w-full p-8 h-screen">
      <form className="h-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 h-full lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6 h-full flex flex-col">
            {/* Voice and Settings Buttons */}
            <div className="flex items-stretch gap-3">
              <button
                type="button"
                onClick={() => setShowVoiceModal(true)}
                className="flex-1 group flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${getVoiceColor(selectedVoice)} flex items-center justify-center text-white font-medium shadow-sm`}>
                    {selectedVoice.charAt(0)}
                  </div>
                  <span className="text-lg font-medium text-gray-900">{selectedVoice}</span>
                </div>
                <ArrowRightLeft className="text-gray-400 group-hover:text-gray-600 transition-colors" size={20} />
              </button>

              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="w-[68px] flex items-center justify-center bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-600"
              >
                <Settings size={24} />
              </button>
            </div>

            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-base font-medium text-gray-900 mb-2">
                Tapez votre titre ici
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entrez un titre pour votre voix off"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isGenerating}
              />
            </div>

            {/* Script Input */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="script" className="block text-base font-medium text-gray-900">
                  Tapez votre script ici
                </label>
                <span className="text-sm text-gray-500">
                  {characterCount} • {estimatedDuration}s
                </span>
              </div>
              <textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Entrez le texte ici"
                className="w-full flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isGenerating}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating || !title.trim() || !script.trim()}
              className="w-full bg-[#2563eb] text-white py-3 rounded-lg cursor-pointer font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? "Génération en cours..." : (
                <>
                  Générer une voix off
                  <span className="text-xs opacity-75">⌘+Entrée</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="h-full">
            <div className="bg-white h-full rounded-lg p-8 border border-gray-200 min-h-[500px]">
              {generatedVoiceovers.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Mic className="text-gray-700" size={20} strokeWidth={1.5} />
                      <h3 className="text-base font-medium text-gray-700">
                        Voix Off Récentes
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Voir Tout
                    </button>
                  </div>
                  <div className="space-y-4">
                    {generatedVoiceovers.map((voiceover) => (
                      <div key={voiceover.id} className="bg-gray-50 rounded-lg p-4">
                      
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            {voiceover.title}
                          </p>
                          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 mb-2">
                             <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (activeAudioUrl === voiceover.audioURL) {
                                    togglePlay();
                                  } else {
                                    load(voiceover.audioURL, { autoplay: true, format: "wav" });
                                    setActiveAudioUrl(voiceover.audioURL);
                                  }
                                }}
                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:scale-105 transition-all text-blue-600"
                              >
                                {activeAudioUrl === voiceover.audioURL && playing ? (
                                  <Pause size={20} fill="currentColor" />
                                ) : (
                                  <Play size={20} fill="currentColor" className="ml-0.5" />
                                )}
                              </button>
                          </div>
                        </div>
                        <a
                          href={voiceover.audioURL}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownload(voiceover.audioURL, `${voiceover.title}.mp3`);
                          }}
                          className="inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
                        >
                          Télécharger la Voix Off
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start h-full">
                  <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Mic className="text-gray-700" size={20} strokeWidth={1.5} />
                      <h3 className="text-base font-medium text-gray-700">
                        Voix Off Récentes
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Voir Tout
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <div className="text-gray-300 mb-4">
                      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <circle cx="60" cy="60" r="50" fill="currentColor" opacity="0.1" />
                        <path d="M60 40 L60 50 M60 70 L60 80 M45 55 L45 65 M75 55 L75 65 M52.5 50 L52.5 70 M67.5 50 L67.5 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
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

      {/* Voice Selection Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowVoiceModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-2">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Sélectionner une voix</h3>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher une voix, un style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all font-medium"
                />
              </div>
            </div>

            {/* Voice Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredVoices.map((voice) => {
                  const isFavorite = favorites.includes(voice.name);
                  const isSelected = selectedVoice === voice.name;

                  return (
                    <div
                      key={voice.name}
                      className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-200 group ${isSelected
                        ? "bg-blue-50 ring-2 ring-blue-600"
                        : "hover:bg-gray-50 border border-gray-100 hover:border-gray-200"
                        }`}
                      onClick={() => {
                        setSelectedVoice(voice.name);
                      }}
                    >
                      {/* Header: Avatar + Name + Heart */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full ${getVoiceColor(voice.name)} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                            {voice.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{voice.name}</h4>
                            <p className="text-sm text-gray-500 font-medium">{voice.gender}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(voice.name);
                          }}
                          className={`p-2 rounded-full transition-colors ${isFavorite ? "text-red-500 bg-red-50" : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"}`}
                        >
                          <Heart size={18} className={isFavorite ? "fill-current" : ""} />
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {voice.description}
                      </p>

                      {/* Footer: Tags + Play */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                            {voice.tags[1]}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            load(voice.voicePreview, { autoplay: true })
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-700 hover:scale-105 active:scale-95 transition-all"
                        >
                          <Play size={14} className="ml-0.5" fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-white/80 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Confirmer la sélection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Paramètres</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Speed Control */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Gauge size={20} />
                    </div>
                    <label className="font-semibold text-gray-900">Rythme</label>
                  </div>
                  <span className="font-mono font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-sm">{rythme.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={rythme}
                  onChange={(e) => setRythme(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                />
                <div className="flex justify-between text-xs font-medium text-gray-400 mt-2">
                  <span>Lent (0.5x)</span>
                  <span>Rapide (2.0x)</span>
                </div>
              </div>

              {/* Pitch Control */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                      <Activity size={20} />
                    </div>
                    <label className="font-semibold text-gray-900">Tonalité</label>
                  </div>
                  <span className="font-mono font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md text-sm">{tonalite.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={tonalite}
                  onChange={(e) => setTonalite(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-600 hover:accent-purple-700"
                />
                <div className="flex justify-between text-xs font-medium text-gray-400 mt-2">
                  <span>Grave</span>
                  <span>Aigu</span>
                </div>
              </div>

              {/* Reset Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setRythme(1.0);
                    setTonalite(1.0);
                  }}
                  className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
                >
                  Réinitialiser par défaut
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
