"use client";

import {
    ArrowRight,
    Bell,
    ChevronRight,
    Command,
    Files,
    FolderOpen,
    Home,
    LifeBuoy,
    Search,
    Settings,
    Wand2,
    X,
    Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Accueil", href: "/dashboard/home", icon: Home, category: "Navigation" },
  { name: "Assets", href: "/dashboard/assets", icon: FolderOpen, category: "Navigation" },
  { name: "Projets", href: "/dashboard/projects", icon: Files, category: "Navigation" },
  { name: "Outils IA", href: "/dashboard/tools", icon: Wand2, category: "Navigation" },
];

const searchableTools = [
    { name: "Amélioration Audio IA", href: "/dashboard/tools/enhance-speech", icon: Wand2, category: "Outils" },
    { name: "Générateur de Voix Off", href: "/dashboard/tools/voiceovers", icon: Wand2, category: "Outils" },
    { name: "Vocal Remover", href: "/dashboard/tools/vocal-remover", icon: Wand2, category: "Outils" },
];

const secondaryItems = [
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: 12 },
  { name: "Support", href: "/dashboard/support", icon: LifeBuoy },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allSearchableItems = [...navItems, ...searchableTools, ...secondaryItems];
  
  const filteredItems = allSearchableItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle Cmd+K / Ctrl+K and Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      if (!isSearchOpen) return;

      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      }

      if (e.key === "Enter" && filteredItems.length > 0) {
        e.preventDefault();
        handleItemClick(filteredItems[selectedIndex].href);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, filteredItems, selectedIndex]);

  const handleItemClick = (href) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  return (
    <>
      <aside className={`
        relative h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}
      `}>
        {/* Header Section */}
        <div className="h-20 flex items-center px-5 shrink-0">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"}`}>
            <div className="w-9 h-9 rounded-xl bg-[#2563eb] flex items-center justify-center shadow-lg shadow-blue-100 shrink-0">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="text-gray-900 font-bold text-lg tracking-tight whitespace-nowrap">ManySocial</span>
          </div>
          
          {isCollapsed && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-300 opacity-100">
               <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center shadow-lg shadow-blue-100 shrink-0">
                  <Zap size={22} className="text-white fill-white" />
                </div>
            </div>
          )}

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              absolute -right-3.5 top-8 w-7 h-7 bg-white border border-gray-100 rounded-full 
              flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300
              shadow-sm z-50 transition-all duration-300
              ${isCollapsed ? "rotate-0" : "rotate-180"}
            `}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Search Bar - Trigger */}
        <div className="px-4 mb-6 shrink-0">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className={`
              relative flex items-center bg-gray-50 rounded-xl transition-all duration-300 overflow-hidden group
              ${isCollapsed ? "w-12 h-12 justify-center mx-auto" : "w-full px-3 py-2.5"}
            `}
          >
            <Search size={18} className={`text-gray-400 shrink-0 group-hover:text-gray-900 transition-colors ${isCollapsed ? "" : "mr-2"}`} />
            {!isCollapsed && (
               <div className="flex items-center justify-between w-full">
                 <span className="text-sm text-gray-400 group-hover:text-gray-500 transition-colors">Rechercher...</span>
                 <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-200/50 rounded text-[10px] text-gray-400 font-medium">
                   <Command size={10} />
                   <span>K</span>
                 </div>
               </div>
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1.5 px-3 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center rounded-xl transition-all duration-200 group relative
                  ${isActive ? "bg-[#2563eb] text-white shadow-md shadow-blue-100" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                  ${isCollapsed ? "w-12 h-12 justify-center mx-auto" : "px-3 py-2.5 w-full"}
                `}
                title={isCollapsed ? item.name : ""}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 text-[15px] font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="space-y-1.5 px-3 mb-6 border-t border-gray-50 pt-6 shrink-0">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center rounded-xl transition-all duration-200 group relative
                  ${isActive ? "bg-gray-50 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                  ${isCollapsed ? "w-12 h-12 justify-center mx-auto" : "px-3 py-2.5 w-full"}
                `}
                title={isCollapsed ? item.name : ""}
              >
                <Icon size={20} className="shrink-0" />
                {!isCollapsed && (
                  <div className="ml-3 flex items-center justify-between w-full animate-in fade-in duration-300">
                    <span className="text-[15px] font-medium whitespace-nowrap">{item.name}</span>
                    {item.badge && (
                      <span className="bg-[#2563eb] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
                {isCollapsed && item.badge && (
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#2563eb] rounded-full border-2 border-white" />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Profile */}
        <div className="mt-auto border-t border-gray-50 p-4 shrink-0">
          <div className={`
            flex items-center transition-all duration-300
            ${isCollapsed ? "justify-center" : "gap-3 px-1"}
          `}>
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 ring-2 ring-transparent group-hover:ring-[#2563eb] transition-all">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-300">
                <p className="text-sm font-semibold text-gray-900 truncate">Felix Bouce</p>
                <p className="text-xs text-gray-500 truncate">felix@manysocial.com</p>
              </div>
            )}
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
        `}</style>
      </aside>

      {/* Global Search Modal */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Area */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <Search className="text-gray-400" size={20} />
              <input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un outil, un projet..." 
                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 placeholder:text-gray-400"
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"
                title="Fermer (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-none">
              {filteredItems.length > 0 ? (
                <div className="space-y-1">
                  {filteredItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleItemClick(item.href)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                          isSelected ? "bg-blue-50 ring-1 ring-blue-100" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected ? "text-[#2563eb] bg-white shadow-sm" : "text-gray-400 bg-gray-50 group-hover:text-[#2563eb] group-hover:bg-blue-50"
                          }`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold transition-colors ${isSelected ? "text-blue-900" : "text-gray-900"}`}>{item.name}</p>
                            <p className="text-xs text-gray-400">{item.category || "Outil"}</p>
                          </div>
                        </div>
                        <ArrowRight size={16} className={`transition-all ${
                          isSelected ? "text-[#2563eb] opacity-100 translate-x-1" : "text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                        }`} />
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <Search className="text-gray-300" size={32} />
                  </div>
                  <p className="text-gray-900 font-medium">Aucun résultat trouvé</p>
                  <p className="text-gray-400 text-sm">Essayez un autre mot-clé ou parcourez les outils.</p>
                </div>
              )}
            </div>

            {/* Footer Area */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded shadow-sm text-gray-600 font-bold">ESC</span>
                  <span>pour fermer</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded shadow-sm text-gray-600 font-bold">↵</span>
                    <span>pour naviguer</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 italic">Propulsé par ManySocial AI</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
