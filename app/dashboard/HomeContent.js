"use client";

import {
  ArrowRight,
  Clock,
  ExternalLink,
  Files,
  Mic,
  MicOff,
  Sparkles,
  Video,
  Volume2,
  Wand2,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const QUICK_TOOLS = [
  {
    title: "Images IA",
    description: "Générateur d'images haute qualité",
    icon: Wand2,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    href: "/dashboard/tools/images"
  },
  {
    title: "Voix Off IA",
    description: "Plus de 50 narrateurs disponibles",
    icon: Mic,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/dashboard/tools/voiceovers"
  },
  {
    title: "Vidéos IA",
    description: "Créez des vidéos pro en un clic",
    icon: Video,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    href: "/dashboard/tools/videos"
  },
  {
    title: "Vocal Remover",
    description: "Isolez les voix parfaitement",
    icon: MicOff,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    href: "/dashboard/tools/vocal-remover"
  }
];

const TYPE_CONFIG = {
  image: { label: "Image", icon: Wand2, color: "text-purple-600", bgColor: "bg-purple-100" },
  voice: { label: "Voix Off", icon: Mic, color: "text-blue-600", bgColor: "bg-blue-100" },
  enhancer: { label: "Audio", icon: Volume2, color: "text-emerald-600", bgColor: "bg-emerald-100" },
  video: { label: "Vidéo", icon: Video, color: "text-orange-600", bgColor: "bg-orange-100" },
  remover: { label: "Vocal Remover", icon: MicOff, color: "text-rose-600", bgColor: "bg-rose-100" }
};

export default function HomeContent({ user, recentProjects }) {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
    }).format(new Date(date));
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Top Header Section - Fixed Height */}
      <div className="p-8 pb-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] text-[10px] font-bold tracking-wider uppercase border border-blue-100 leading-none">
                        Version Beta
                    </span>
                    <span className="flex items-center gap-1 text-yellow-600 text-[10px] font-bold tracking-wider uppercase bg-yellow-50 px-2.5 py-0.5 rounded-full border border-yellow-100 leading-none">
                        <Sparkles size={10} fill="currentColor" />
                        Pro
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Bonjour, <span className="text-[#2563eb]">{user?.name?.split(' ')[0] || "Utilisateur"}</span>
                </h1>
            </div>
            
            <Link href="/dashboard/tools" className="hidden sm:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-sm">
                <Zap size={16} fill="white" />
                Nouveau Projet
            </Link>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-none custom-scrollbar pb-10">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Quick Access Tools */}
          <section>
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-lg font-bold text-gray-900">
                Accès Rapide
              </h2>
              <Link href="/dashboard/tools" className="text-xs font-bold text-gray-400 hover:text-[#2563eb] transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {QUICK_TOOLS.map((tool, i) => (
                <Link 
                  key={i} 
                  href={tool.href}
                  className="group p-6 rounded-2xl border border-gray-200 bg-white hover:border-[#2563eb] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className={`w-12 h-12 rounded-xl ${tool.bgColor} ${tool.color} flex items-center justify-center mb-5 transition-transform duration-300`}>
                    <tool.icon size={22} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-[15px] mb-1 group-hover:text-[#2563eb] transition-colors line-clamp-1">{tool.title}</h3>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-1">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Activity Column */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-lg font-bold text-gray-900">Activité Récente</h2>
              <Link href="/dashboard/projects" className="text-xs font-bold text-gray-400 hover:text-[#2563eb] transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                Mes projets <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 shadow-sm">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => {
                  const config = TYPE_CONFIG[project.type] || TYPE_CONFIG.image;
                  const Icon = config.icon;
                  return (
                    <div key={project.id} className="p-4 hover:bg-gray-50/50 transition-colors flex items-center gap-4 group">
                      <div className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100 relative ${config.bgColor}`}>
                        {project.preview ? (
                           project.type === 'video' ? (
                              <video src={project.preview} className="w-full h-full object-cover" />
                           ) : (
                              <Image src={project.preview} alt="" fill className="object-cover" />
                           )
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${config.color}`}>
                            <Icon size={18} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate mb-0.5 group-hover:text-[#2563eb] transition-colors leading-tight">
                          {project.title || "Projet sans titre"}
                        </h4>
                        <div className="flex items-center gap-2.5">
                           <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide">
                              <Icon size={10} className={config.color} />
                              <span className={config.color}>{config.label}</span>
                           </div>
                           <span className="text-gray-200 text-[10px]">•</span>
                           <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-400">
                             <Clock size={10} />
                             {formatDate(project.createdAt)}
                           </div>
                        </div>
                      </div>
                      <Link 
                        href={project.url} 
                        target="_blank"
                        className="p-2 text-gray-300 hover:text-[#2563eb] hover:bg-white rounded-lg transition-all"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  )
                })
              ) : (
                <div className="p-16 text-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                    <Files className="text-gray-200" size={28} />
                  </div>
                  <p className="text-gray-400 font-bold text-sm">Aucune activité récente</p>
                  <p className="text-gray-400 text-xs mt-1">Créez votre premier projet pour le voir ici !</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e5e5e5;
        }
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
