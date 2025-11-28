"use client";

import { ChevronDown, Heart, Mic, Play, Search, Settings, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAudioPlayer } from "react-use-audio-player";


export default function VoiceoversPage() {
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVoiceovers, setGeneratedVoiceovers] = useState([]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("Zephyr");
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const { load, playing, togglePlay } = useAudioPlayer();

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

  // Load favorites from sessionStorage
  useEffect(() => {
    const storedFavorites = sessionStorage.getItem("voiceover-favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

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
    e.preventDefault();

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
          speed,
          pitch
        }),
      });

      const data = await response.json();

      if (data.success && data.audioUrl) {
        setGeneratedVoiceovers([
          {
            id: Date.now(),
            title: title,
            audioUrl: data.audioUrl,
            duration: data.duration || "0s"
          },
          ...generatedVoiceovers
        ]);
        toast.success("Voix générée avec succès !");
        setTitle("");
        setScript("");
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

  const characterCount = script.length;
  const estimatedDuration = Math.ceil(characterCount / 15);

  // Get color for voice avatar
  const getVoiceColor = (name) => {
    const colors = [
      "bg-pink-500", "bg-purple-500", "bg-blue-500", "bg-green-500",
      "bg-yellow-500", "bg-red-500", "bg-indigo-500", "bg-teal-500"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full p-8 h-screen">
      <form className="h-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 h-full lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6 h-full flex flex-col">
            {/* Voice and Settings Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowVoiceModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User size={18} className="text-gray-600" />
                <span className="text-sm text-gray-700">{selectedVoice}</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings size={18} className="text-gray-600" />
                <span className="text-sm text-gray-700">Paramètres</span>
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
                        <p className="text-sm text-gray-600 mb-3">
                          Sélectionnez et téléchargez le clip pour générer une voix off
                        </p>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            {voiceover.title}
                          </p>
                          <audio
                            controls
                            src={voiceover.audioUrl}
                            className="w-full"
                          />
                        </div>
                        <a
                          href={voiceover.audioUrl}
                          download={`${voiceover.title}.mp3`}
                          className="inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowVoiceModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Sélectionner une Voix IA</h3>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher nom, tag, etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Voice Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVoices.map((voice) => {
                  const isFavorite = favorites.includes(voice.name);
                  const isSelected = selectedVoice === voice.name;

                  return (
                    <div
                      key={voice.name}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      onClick={() => {
                        setSelectedVoice(voice.name);
                        setShowVoiceModal(false);
                      }}
                    >
                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(voice.name);
                        }}
                        className="absolute top-3 right-3 z-10"
                      >
                        <Heart
                          size={18}
                          className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}
                        />
                      </button>

                      {/* Voice Avatar */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full ${getVoiceColor(voice.name)} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                          {voice.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{voice.name}</h4>
                          <p className="text-xs text-gray-500">{voice.description}</p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${voice.gender === "Male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                          }`}>
                          {voice.gender}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                          Multilingual
                        </span>
                      </div>

                      {/* Play Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          load(voice.voicePreview, { autoplay: true })
                          toast.success(`Aperçu de ${voice.name}`);
                        }}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Play size={14} />
                        <span>Écouter</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Terminé
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Paramètres de la voix</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6">
              {/* Speed Control */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Vitesse</label>
                  <span className="text-sm text-gray-500">{speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x</span>
                  <span>2.0x</span>
                </div>
              </div>

              {/* Pitch Control */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Tonalité</label>
                  <span className="text-sm text-gray-500">{pitch.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Grave</span>
                  <span>Aigu</span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={() => {
                  setSpeed(1.0);
                  setPitch(1.0);
                }}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Réinitialiser les paramètres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
