"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import CustomSelect from "../../components/CustomSelect";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("seedream-3");
  const [aspectRatio, setAspectRatio] = useState("9:16");

  const modelOptions = [
    { value: "seedream-3", label: "Seedream 3 Recommended" },
    { value: "seedream-2", label: "Seedream 2" },
  ];

  const aspectRatioOptions = [
    { value: "9:16", label: "9:16" },
    { value: "16:9", label: "16:9" },
    { value: "1:1", label: "1:1" },
    { value: "4:3", label: "4:3" },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Model & Aspect Ratio */}
          <div className="grid grid-cols-2 gap-4">
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
          <div className="bg-gray-50 rounded-lg p-12 flex flex-col items-center justify-center min-h-[300px] border border-gray-200">
            <Sparkles className="text-gray-400 mb-4" size={48} strokeWidth={1.5} />
            <p className="text-gray-900 font-medium mb-1">
              Prêt à créer quelque chose d'incroyable ?
            </p>
            <p className="text-gray-500 text-sm">
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
            <div className="flex items-center justify-between mt-3">
              <button className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                Enhance Prompt
              </button>
              <p className="text-xs text-gray-400">
                ⌘+Enter to generate
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <button className="w-full bg-[#2563eb] text-white py-3 rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors">
            Generate Image
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
    </div>
  );
}
