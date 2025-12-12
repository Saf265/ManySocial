"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomSelect from "../../components/CustomSelect";

const modelOptions = [
  { id: 1, value: "flux/schnell", label: "Flux Schnell", info: "Très rapide" },
  { id: 2, value: "bytedance/seedream-3.0", label: "Seedream 3", info: "Haute qualité" },
  { id: 3, value: "google/imagen-4.0-fast-generate-001", label: "Google Imagen 4 Fast", info: "Rapide et équilibré" },
  { id: 4, value: "google/imagen-4.0-generate-001", label: "Google Imagen 4", info: "Qualité supérieure" },
  { id: 5, value: "dall-e-3", label: "DALL·E 3", info: "Créatif et détaillé" },
  { id: 6, value: "alibaba/qwen-image", label: "Qwen Image", info: "Efficient" }
];

const aspectRatioOptions = [
  { id: 1, value: "1:1", label: "1:1", width: 1024, height: 1024 },
  { id: 2, value: "5:4", label: "5:4", width: 1280, height: 1024 },
  { id: 3, value: "4:5", label: "4:5", width: 1024, height: 1280 },
  { id: 4, value: "4:3", label: "4:3", width: 1024, height: 768 },
  { id: 5, value: "3:4", label: "3:4", width: 768, height: 1024 },
  { id: 6, value: "3:2", label: "3:2", width: 1536, height: 1024 },
  { id: 7, value: "2:3", label: "2:3", width: 1024, height: 1536 },
  { id: 8, value: "16:10", label: "16:10", width: 1600, height: 1000 },
  { id: 9, value: "10:16", label: "10:16", width: 1000, height: 1600 },
  { id: 10, value: "16:9", label: "16:9", width: 1920, height: 1080 },
  { id: 11, value: "9:16", label: "9:16", width: 1080, height: 1920 },
  { id: 12, value: "2:1", label: "2:1", width: 2048, height: 1024 },
  { id: 13, value: "1:2", label: "1:2", width: 1024, height: 2048 },
  { id: 14, value: "3:1", label: "3:1", width: 3072, height: 1024 },
  { id: 15, value: "1:3", label: "1:3", width: 1024, height: 3072 },
];
export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("flux/schnell");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const router = useRouter();

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;

    const originalPrompt = prompt;
    setIsEnhancing(true);
    setPrompt(""); // Clear current prompt

    try {
      const { enhancePrompt } = await import("@/features/images/server/action-images");

      // Get the full enhanced text
      const enhancedText = await enhancePrompt(originalPrompt);

      // Simulate streaming effect
      let currentIndex = 0;
      const streamInterval = setInterval(() => {
        if (currentIndex < enhancedText.length) {
          const chunkSize = Math.floor(Math.random() * 3) + 2; // Random 2-4 chars
          currentIndex += chunkSize;
          setPrompt(enhancedText.slice(0, currentIndex));
        } else {
          setPrompt(enhancedText);
          clearInterval(streamInterval);
          setIsEnhancing(false);
        }
      }, 30); // 30ms between chunks

    } catch (error) {
      console.error('Error enhancing prompt:', error);
      toast.error("Erreur lors de l'amélioration du prompt");
      setPrompt(originalPrompt); // Restore original on error
      setIsEnhancing(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isLoading && prompt.trim()) {
          handleSubmit(e);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prompt, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const selectedAspectRatio = aspectRatioOptions.find(opt => opt.value === aspectRatio);

      const response = await fetch('/api/tools/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          width: selectedAspectRatio.width,
          height: selectedAspectRatio.height,
        }),
      });

      const data = await response.json();
      console.log('Generated image:', data);
      const id = data.id;


      // TODO: Handle the generated image (display, save to recent generations, etc.)
      if (id) {
        toast.success("Image générée avec succès !")
        router.push(`/dashboard/tools/images/${id}`)
      } else {
        toast.error("Une erreur est survenue lors de la génération de l'image.")
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-8">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Model & Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Modèle
                </label>
                <CustomSelect
                  value={model}
                  onChange={setModel}
                  options={modelOptions}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Format d'image
                </label>
                <CustomSelect
                  value={aspectRatio}
                  onChange={setAspectRatio}
                  options={aspectRatioOptions}
                />
              </div>
            </div>

            {/* Preview Area */}
            <div className="bg-gray-50 rounded-lg p-8 sm:p-12 flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] border border-gray-200">
              <Sparkles className="text-gray-400 mb-4" size={48} strokeWidth={1.5} />
              <p className="text-gray-900 font-medium mb-1 text-center">
                Prêt à créer quelque chose d'incroyable ?
              </p>
              <p className="text-gray-500 text-sm text-center">
                Entrez un prompt ci-dessous et laissez l'IA donner vie à vos idées
              </p>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Prompt
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Décrivez l'image que vous souhaitez créer..."
                  className="w-full px-4 py-3 pb-12 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={7}
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={!prompt.trim() || isEnhancing}
                    className={`text-xs font-medium cursor-pointer px-3 py-1.5 rounded-md transition-colors ${prompt.trim() && !isEnhancing
                      ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {isEnhancing ? "Amélioration..." : "Améliorer le prompt"}
                  </button>

                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              ⌘+Entrez pour générer
            </p>
            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full bg-[#2563eb] text-white py-3 rounded-lg cursor-pointer font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Génération en cours..." : "Générer une image"}
            </button>
          </div>

          {/* Right Column - Recent Generations */}
          <div>
            <h3 className="text-sm text-gray-600 mb-4">Générations récentes</h3>
            <div className="space-y-3">
              {/* Empty state */}
              <div className="text-center py-12 text-gray-400 text-sm">
                Aucune génération récente
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
