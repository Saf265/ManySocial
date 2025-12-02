"use client";

import { BookOpen, Image } from "lucide-react";
import { useEffect, useState } from "react";
import CustomSelect from "../../components/CustomSelect";

const modelOptions = [
  { id: 1, value: "veo3-standard", label: "VEO3 Standard", badge: "Popular" },
  { id: 2, value: "veo3-pro", label: "VEO3 Pro", badge: "Premium" },
  { id: 3, value: "runway-gen3", label: "Runway Gen-3", badge: "Creative" },
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


export default function GenerateVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("veo3-standard");
  const [duration, setDuration] = useState("8s");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [isLoading, setIsLoading] = useState(false);

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
  }, [prompt, isLoading]);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Generating video:', { model, prompt, duration, aspectRatio });
      // Handle success
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        {/* Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <CustomSelect
              value={model}
              onChange={setModel}
              options={modelOptions}
              placeholder="Select model"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <CustomSelect
              value={duration}
              onChange={setDuration}
              options={durationOptions}
              placeholder="Select duration"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aspect Ratio
            </label>
            <CustomSelect
              value={aspectRatio}
              onChange={setAspectRatio}
              options={aspectRatioOptions}
              placeholder="Select ratio"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <BookOpen size={16} />
            Prompt Library
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <BookOpen size={16} />
            Prompt Docs
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed"
            disabled
          >
            <Image size={16} />
            Add reference image
          </button>
        </div>

        {/* Prompt Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to create..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500 resize-none"
            rows={8}
          />
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
          className={`w-full  py-3.5 w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 cursor-pointer ${isLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed": ""} `}
        >
          <span>{isLoading ? "Generating Video..." : "Generate Video"}</span>
          <span className="text-sm opacity-75">⌘+Enter</span>
        </button>
      </div>
    </div>
  );
}