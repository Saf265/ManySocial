"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import CustomSelect from "../../components/CustomSelect";

const topicOptions = [
  { id: "sports", label: "Sports" },
  { id: "tv-shows", label: "TV Shows" },
  { id: "gardening", label: "Jardinage" },
  { id: "motivational", label: "Motivationnel" },
  { id: "countries", label: "Pays" },
  { id: "inventions", label: "Inventions" },
];

const toneOptions = [
  { id: 1, value: "professional", label: "Professionnel" },
  { id: 2, value: "casual", label: "Décontracté" },
  { id: 3, value: "humorous", label: "Humoristique" },
  { id: 4, value: "inspirational", label: "Inspirant" },
  { id: 5, value: "educational", label: "Éducatif" },
];

const videoTypeOptions = [
  { id: "reddit-story", label: "Reddit Story" },
  { id: "fake-texts", label: "Fake Texts" },
  { id: "split-screen", label: "Split Screen" },
];

export default function BrainstormPage() {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [targetAudience, setTargetAudience] = useState("");
  const [selectedVideoType, setSelectedVideoType] = useState("");
  const [generatedIdeas, setGeneratedIdeas] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTopic || !targetAudience || !selectedVideoType) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setGeneratedIdeas("");

    try {
      const response = await fetch('/api/tools/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: selectedTopic,
          tone,
          targetAudience,
          videoType: selectedVideoType,
        }),
      });

      const data = await response.json();

      if (data.ideas) {
        setGeneratedIdeas(data.ideas);
        toast.success("Idées générées avec succès !");
      } else {
        toast.error("Une erreur est survenue lors de la génération des idées.");
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast.error("Une erreur est survenue lors de la génération des idées.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-4 h-screen ">
      <form className="h-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 h-full lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-8 my-16">
            {/* Topic */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="Générer des idées pour une niche pour démarrer une page sur"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-3"
              />
              <div className="grid grid-cols-3 gap-2">
                {topicOptions.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic.label)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${selectedTopic === topic.label
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Sélectionnez le ton pour vos idées
              </label>
              <CustomSelect
                value={tone}
                onChange={setTone}
                options={toneOptions}
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Public cible
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Mamans de 30 à 40 ans aux États-Unis"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Video Type */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Type de vidéo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {videoTypeOptions.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedVideoType(type.id)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${selectedVideoType === type.id
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !selectedTopic || !targetAudience || !selectedVideoType}
              className="w-full bg-[#2563eb] text-white py-3 rounded-lg cursor-pointer font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              {isLoading ? "Génération en cours..." : "Générer des idées"}
            </button>
          </div>

          {/* Right Column - Generated Ideas */}
          <div className="h-full">
            <div className="bg-white rounded-lg p-8 border border-gray-200 h-full">
              {generatedIdeas ? (
                <div>
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                    <Sparkles className="text-gray-700" size={20} strokeWidth={1.5} />
                    <h3 className="text-base font-medium text-gray-700">Vos idées apparaîtront ici</h3>
                  </div>
                  <div className="text-gray-900 text-sm whitespace-pre-wrap leading-relaxed">
                    {generatedIdeas}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start h-full">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 w-full">
                    <Sparkles className="text-gray-700" size={20} strokeWidth={1.5} />
                    <h3 className="text-base font-medium text-gray-700">Vos idées apparaîtront ici</h3>
                  </div>
                  <div className="flex-1 flex items-center justify-center w-full">
                    <p className="text-gray-400 text-sm text-center">
                      Lorem ipsum is simply dummy text of the printing.
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
