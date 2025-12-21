import { Mic, MicOff, Video, Volume2, Wand2, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AIToolsDashboard() {


  const tools = [
    {
      title: "Générateur d'Images IA",
      description: "Générez des images de haute qualité avec l'IA en quelques secondes.",
      icon: Wand2,
      preview: "/Images-BG.svg",
      href: "/dashboard/tools/images"
    },
    {
      title: "Générateur de Voix Off IA",
      description: "Créez des voix off de haute qualité en quelques secondes avec plus de 50 narrateurs.",
      icon: Mic,
      preview: "/Voiceover-BG.svg",
      href: "/dashboard/tools/voiceovers"
    },
    {
      title: "Amélioration Audio IA",
      description: "Améliorez la qualité de n'importe quel fichier audio ou vidéo avec l'IA.",
      icon: Volume2,
      preview: "/Enhance-BG.svg",
      badge: "New",
      href: "/dashboard/tools/enhance-speech"
    },
    {
      title: "Générateur de Vidéos IA",
      description: "VEO3 est un outil qui vous permet de créer des vidéos avec l'IA.",
      icon: Video,
      preview: "/Video-BG.svg",
      href: "/dashboard/tools/videos"
    },
    {
      title: "ManySocial Shorts",
      description: "Transformez vos vidéos YouTube en Shorts viraux et monétisables.",
      icon: Zap,
      preview: null,
      href: "/dashboard/tools/shorts",
      badge: "Beta"
    },
    {
      title: "Suppresseur de Voix IA",
      description: "Supprimez les voix de n'importe quel fichier audio ou vidéo avec l'IA.",
      icon: MicOff,
      preview: "/Vocal-Remover.png",
      href: "/dashboard/tools/vocal-remover"
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="w-full mx-auto">
        

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden ">
              {/* Preview Image */}
              <div className="relative bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
                {tool.preview && !tool.preview.includes('/api/placeholder') ? (
                  <Image
                    src={tool.preview}
                    alt={tool.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full p-4 flex items-center justify-center">
                    <div className="w-full h-full bg-white rounded border border-gray-100 flex items-center justify-center">
                      <tool.icon className="w-12 h-12 text-gray-300" />
                    </div>
                  </div>
                )}
                {tool.badge && (
                  <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full z-10">
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {tool.description}
                </p>
                <Link href={tool.href}>
                <button className="w-full border cursor-pointer border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors">
                  Commencer
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}