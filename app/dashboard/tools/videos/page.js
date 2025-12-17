"use client";

import { BookOpen, Image, Search, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CustomSelect from "../../components/CustomSelect";

const modelOptions = [
  { id: 1, value: "veo3-standard", label: "VEO3 Standard", badge: "Populaire" },
  { id: 2, value: "veo3-pro", label: "VEO3 Pro", badge: "Premium" },
  { id: 3, value: "runway-gen3", label: "Runway Gen-3", badge: "Créatif" },
];

const durationOptions = [
  { id: 1, value: "4s", label: "4s" },
  { id: 2, value: "8s", label: "8s" },
  { id: 3, value: "12s", label: "12s" },
  { id: 4, value: "16s", label: "16s" },
];

const aspectRatioOptions = [
  { id: 1, value: "16:9", label: "16:9" },
  { id: 2, value: "9:16", label: "9:16" },
  { id: 3, value: "1:1", label: "1:1" },
  { id: 4, value: "4:3", label: "4:3" },
];

const samplePrompts = [
  { id: 1, title: "Paysage Cinématique", text: "Vue aérienne cinématique d'une chaîne de montagnes enneigée au coucher du soleil, éclairage doré, 8k, très détaillé." },
  { id: 2, title: "Ville Futuriste", text: "Cyberpunk ville futuriste avec des néons, voitures volantes, pluie sur les trottoirs, ambiance sombre et mystérieuse." },
  { id: 3, title: "Portrait Artistique", text: "Portrait en gros plan d'un astronaute regardant l'horizon martien, reflet dans la visière, style réaliste." },
  { id: 4, title: "Nature Macro", text: "Macro vidéo d'une goutte de rosée sur une feuille verte, lumière du matin, haute résolution, profondeur de champ." },
  { id: 5, title: "Animation 3D", text: "Un robot mignon qui danse dans un environnement coloré, style Pixar, rendu 3D, éclairage studio." },
];

export default function GenerateVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("veo3-standard");
  const [duration, setDuration] = useState("8s");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isLoading && prompt.trim()) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prompt, isLoading, model, duration, aspectRatio, image]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      // Data to be submitted
      const submissionData = {
        prompt,
        model,
        duration,
        aspectRatio,
        image: image || null
      };

      console.log('Generating video with data:', submissionData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle success (would typically call an API here)
      // For now we just log as requested
      
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPrompts = samplePrompts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        
        {/* Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modèle
            </label>
            <CustomSelect
              value={model}
              onChange={setModel}
              options={modelOptions}
              placeholder="Sélectionner un modèle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée
            </label>
            <CustomSelect
              value={duration}
              onChange={setDuration}
              options={durationOptions}
              placeholder="Sélectionner une durée"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <CustomSelect
              value={aspectRatio}
              onChange={setAspectRatio}
              options={aspectRatioOptions}
              placeholder="Sélectionner un format"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            type="button"
            onClick={() => setShowPromptLibrary(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <BookOpen size={16} />
            Bibliothèque de prompts
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
              image 
              ? "bg-blue-50 border-blue-200 text-blue-700" 
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Image size={16} />
            {image ? "Modifier l'image de référence" : "Ajouter une image de référence"}
          </button>

          {image && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
              <span className="truncate max-w-[150px]">{image.name}</span>
              <button onClick={removeImage} className="hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Prompt Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Décrivez la vidéo que vous souhaitez créer..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={8}
          />
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-3.5 text-center text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
            isLoading || !prompt.trim()
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Génération en cours...</span>
            </>
          ) : (
            <>
              <span>Générer la vidéo</span>
              <span className="text-sm opacity-75 hidden sm:inline">⌘+Entrée</span>
            </>
          )}
        </button>
      </div>

      {/* Prompt Library Modal */}
      {showPromptLibrary && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPromptLibrary(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BookOpen className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Bibliothèque de prompts</h3>
              </div>
              <button
                onClick={() => setShowPromptLibrary(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un prompt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredPrompts.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => {
                    setPrompt(p.text);
                    setShowPromptLibrary(false);
                  }}
                  className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-700">{p.title}</h4>
                    <Sparkles size={16} className="text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{p.text}</p>
                </div>
              ))}
              {filteredPrompts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun prompt trouvé.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
