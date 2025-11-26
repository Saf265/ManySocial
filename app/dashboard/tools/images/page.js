"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import CustomSelect from "../../components/CustomSelect";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("flux/schnell");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isLoading, setIsLoading] = useState(false);

  const modelOptions = [
    { id: 1, value: "flux/schnell", label: "Flux Schnell", info: "Very Fast" },
    { id: 2, value: "bytedance/seedream-3.0", label: "Seedream 3", info: "High Quality" },
    { id: 3, value: "google/imagen-4.0-fast-generate-001", label: "Google Imagen 4 Fast", info: "Fast & Balanced" },
    { id: 4, value: "google/imagen-4.0-generate-001", label: "Google Imagen 4", info: "Premium Quality" },
    { id: 5, value: "dall-e-3", label: "DALL·E 3", info: "Creative & Detailed" },
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

      // TODO: Handle the generated image (display, save to recent generations, etc.)

    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Model & Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Model
                </label>
                <CustomSelect
                  value={model}
                  onChange={setModel}
                  options={modelOptions}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Aspect Ratio
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
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décrivez l'image que vous souhaitez créer..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={6}
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3">
                <button className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                  Enhance Prompt
                </button>
                <p className="text-xs text-gray-400">
                  ⌘+Enter to generate
                </p>
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full bg-[#2563eb] text-white py-3 rounded-lg cursor-pointer font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Génération en cours..." : "Generate Image"}
            </button>
          </div>

          {/* Right Column - Recent Generations */}
          <div>
            <h3 className="text-sm text-gray-600 mb-4">Recent Generations</h3>
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
