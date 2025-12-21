"use client";

import {
  Clock,
  Download,
  ExternalLink,
  FolderOpen,
  Mic,
  MicOff,
  Search,
  Trash2,
  Video,
  Volume2,
  Wand2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const TYPE_CONFIG = {
  image: {
    label: "Image",
    icon: Wand2,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    previewBg: "bg-purple-50"
  },
  voice: {
    label: "Voix Off",
    icon: Mic,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    previewBg: "bg-blue-50"
  },
  enhancer: {
    label: "Amélioration Audio",
    icon: Volume2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    previewBg: "bg-emerald-50"
  },
  video: {
    label: "Vidéo",
    icon: Video,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    previewBg: "bg-orange-50"
  },
  remover: {
    label: "Vocal Remover",
    icon: MicOff,
    color: "text-rose-600",
    bgColor: "bg-rose-100",
    previewBg: "bg-rose-50"
  }
};

export default function ProjectsContent({ initialProjects }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const formatDate = (date) => {
    try {
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(date));
    } catch (e) {
        return "Date inconnue";
    }
  };

  const filters = [
    { id: "all", label: "Tout" },
    { id: "image", label: "Images" },
    { id: "video", label: "Vidéos" },
    { id: "voice", label: "Voix Off" },
    { id: "enhancer", label: "Audio" },
    { id: "remover", label: "Vocal Remover" },
  ];

  const filteredProjects = useMemo(() => {
    return (initialProjects || [])
      .filter((project) => {
        const matchesSearch = project.title?.toLowerCase().includes(search.toLowerCase()) || 
                             project.type?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === "all" || project.type === activeFilter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [initialProjects, search, activeFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header & Filters */}
      <div className="p-8 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">Mes Projets</h1>
            <p className="text-gray-500 text-sm">Retrouvez toutes vos créations générées par l'IA</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeFilter === filter.id
                  ? "bg-[#2563eb] text-white shadow-md shadow-blue-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 p-8 bg-gray-50/30">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => {
              const config = TYPE_CONFIG[project.type] || TYPE_CONFIG.image;
              const Icon = config.icon;
              
              return (
                <div 
                  key={project.id} 
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col"
                >
                  {/* Preview Section */}
                  <div className={`relative aspect-square sm:aspect-video lg:aspect-square xl:aspect-[4/3] ${config.previewBg} border-b border-gray-100 overflow-hidden`}>
                    {project.preview ? (
                      project.type === 'video' ? (
                        <video 
                          src={project.preview} 
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      ) : (
                        <div className="w-full h-full relative">
                          <Image
                            src={project.preview}
                            alt={project.title || ""}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl ${config.bgColor} ${config.color} flex items-center justify-center`}>
                          <Icon size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{config.label}</span>
                      </div>
                    )}
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                       <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm shadow-sm border border-gray-100`}>
                          <Icon size={12} className={config.color} />
                          <span className="text-[10px] font-bold text-gray-800 uppercase tracking-tight">{config.label}</span>
                       </div>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 bg-white rounded-xl text-gray-900 hover:bg-[#2563eb] hover:text-white transition-all transform hover:scale-110 shadow-lg"
                        title="Ouvrir"
                       >
                          <ExternalLink size={20} />
                       </a>
                       <a 
                        href={project.url} 
                        download
                        className="p-2.5 bg-white rounded-xl text-gray-900 hover:bg-[#2563eb] hover:text-white transition-all transform hover:scale-110 shadow-lg"
                        title="Télécharger"
                       >
                          <Download size={20} />
                       </a>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-3 flex-1 text-gray-900">
                       <h3 className="font-bold text-[15px] line-clamp-2 mb-1 group-hover:text-[#2563eb] transition-colors leading-snug">
                        {project.title || "Projet sans titre"}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                        <Clock size={12} strokeWidth={2.5} />
                        {formatDate(project.createdAt)}
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                       <button className="text-[11px] font-bold text-[#2563eb] hover:text-[#1d4ed8] uppercase tracking-wider">
                          Détails
                       </button>
                       <button className="text-gray-400 hover:text-rose-600 transition-colors p-1" title="Supprimer">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
              <FolderOpen className="text-gray-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun projet trouvé</h3>
            <p className="text-gray-500 max-w-sm mb-8 font-medium">
              Vous n'avez pas encore de projet dans cette catégorie. Commencez à créer avec nos outils IA !
            </p>
            <Link href="/dashboard/tools">
              <button className="bg-[#2563eb] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-100 ">
                Explorer les outils IA
              </button>
            </Link>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
