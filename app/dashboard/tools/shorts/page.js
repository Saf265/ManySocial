"use client";

import { getVideoDuration } from "@/lib/action-server-ytb";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Files,
  Globe,
  Mic,
  Music,
  Play,
  Type,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SUBTITLE_MODELS = [
  { id: "none", name: "Aucun", preview: null },
  { id: "model1", name: "Modèle 1", color: "text-yellow-500" },
  { id: "model13", name: "Modèle 13", color: "text-blue-500" },
  { id: "model19", name: "Modèle 19", color: "text-purple-500" },
  { id: "model22", name: "Modèle 22", color: "text-rose-500" },
];

const VOICES = [
  { name: "Zephyr", gender: "Femme", color: "bg-pink-500", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1764357160/Zephyr_eg9cfn.wav" },
  { name: "Kore", gender: "Femme", color: "bg-rose-500", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1764357156/Kore_ueryyo.wav" },
  { name: "Leda", gender: "Femme", color: "bg-purple-500", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1764357151/Leda_vkmcgl.wav" },
  { name: "Puck", gender: "Homme", color: "bg-blue-500", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1764357157/Puck_mcncoc.wav" },
  { name: "Charon", gender: "Homme", color: "bg-indigo-500", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1764357156/Charon_r2cgxn.wav" },
  { name: "Orus", gender: "Homme", color: "bg-cyan-500", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1764357148/Orus_zur34d.wav" },
];

const MUSIC_TRACKS = [
  { name: "Pas d'audio", preview: null },
  { name: "CentralCee Sprintal (Intrumental)", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1766351033/Dave_x_Central_Cee_-_Sprinter_Instrumental_eyakwa.mp3" },
  { name: "Young Folks", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1766351033/Peter_Bjorn_And_John_-_Young_Folks_xkfzej.mp3" },
  { name: "Death of Bluebird - Gone", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1766351032/Death_of_Bluebird_x_Gone_Gone_Thank_You_Edit_Audio_gvu4gr.mp3" },
  {name: "Creepy And Simple Horror Background Music", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1766351031/creepy_and_simple_horror_background_music_tiktok_music_xlmfcj.mp3"},
  {name:"Scary Suspense Horror Piano And Music Box", preview:"https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1766351032/Scary_Suspense_horror_piano_and_music_box_frmvzw.mp3"},
  {name: "I Was Only Temporary", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1766351032/i_was_only_temporary_ndxvxx.mp3"},
  {name: "Echo Sax End", preview: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1766351031/Echo_Sax_End_by_Caleb_Arredondo_etejkg.mp3"}
];

export default function ManySocialShortsPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    url: "",
    music: "Pas d'audio",
    voice: "Zephyr",
    captionStyle: "model1",
    language: "Français",
    title: "",
    blurredBg: true,
    blackBars: false
  });

  const [analyzedVideo, setAnalyzedVideo] = useState(null);
  const [startTimeSec, setStartTimeSec] = useState(0);
  const DURATION_WINDOW = 420; // 7 minutes in seconds

  useEffect(() => {
    const handleYTDuration = (e) => {
      const realDuration = e.detail;
      if (realDuration && analyzedVideo && analyzedVideo.duration !== realDuration) {
        setAnalyzedVideo(prev => ({ ...prev, duration: Math.floor(realDuration) }));
      }
    };
    window.addEventListener('yt-duration', handleYTDuration);
    return () => window.removeEventListener('yt-duration', handleYTDuration);
  }, [analyzedVideo]);

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAnalyze = async () => {
    if (!formData.url) {
      toast.error("Veuillez entrer un lien YouTube");
      return;
    }
    const videoId = getYoutubeId(formData.url);
    if (!videoId) {
      toast.error("Lien YouTube invalide");
      return;
    }

    setLoading(true);
    try {
      // Use the new Server Action to get high-fidelity metadata
      const videoData = await getVideoDuration(formData.url);

      if (videoData) {
        setAnalyzedVideo({
          id: videoId,
          title: videoData.title,
          channel: "YouTube",
          duration: videoData.seconds,
          thumbnail: videoData.thumbnail
        });
        toast.success("Vidéo analysée avec succès !");
        setStep(2);
      } else {
        // Fallback to fetch API if server action fails
        const res = await fetch("/api/tools/social/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: videoId })
        });
        const data = await res.json();
        if (data.videoInfo) {
          setAnalyzedVideo({
            id: videoId,
            title: data.videoInfo.title,
            channel: "YouTube",
            duration: parseInt(data.videoInfo.duration) || 2553,
            thumbnail: data.videoInfo.thumbnail
          });
          setStep(2);
        } else {
          throw new Error("Impossible de récupérer les infos");
        }
      }
    } catch (error) {
      console.error("Analysis error:", error);
      // Fallback if API fails but video exists
      setAnalyzedVideo({
        id: videoId,
        title: `Vidéo YouTube`,
        channel: "Chaîne YouTube",
        duration: 2553, 
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      });
      setStep(2);
      toast.success("Vidéo chargée (Infos limitées)");
    } finally {
      setLoading(false);
    }
  };

  const formatSeconds = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s]
      .map(v => v.toString().padStart(2, '0'))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
      {[1, 2, 3, 4].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step === num ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : 
            step > num ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
          }`}>
            {step > num ? <CheckCircle2 size={16} /> : num}
          </div>
          {num < 4 && (
            <div className={`w-12 h-0.5 mx-2 ${step > num ? "bg-emerald-500" : "bg-gray-100"}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">ManySocial Shorts</h1>
          </div>
          <p className="text-gray-500 font-medium">Transformez n'importe quelle vidéo YouTube en Shorts viraux.</p>
        </div>

        {renderStepIndicator()}

        <main className="min-h-[60vh] flex flex-col items-center">
          {step === 1 ? (
            <div className="w-full max-w-3xl space-y-10 text-center animate-in fade-in zoom-in-95 duration-500 py-12">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  Déposez un lien & <span className="text-blue-600">devenez viral</span>
                </h2>
                <div className="flex flex-col items-center gap-4">
                  <p className="text-gray-500 text-lg font-medium max-w-lg">
                    Transformez vos vidéos YouTube en contenus courts optimisés pour
                  </p>
                  <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-1.5 rounded-lg shadow-xl shrink-0">
                    <span className="font-bold tracking-tighter text-sm uppercase">Shorts</span>
                    <div className="w-5 h-5 bg-red-600 rounded-sm flex items-center justify-center">
                       <Play size={10} fill="white" className="ml-0.5" />
                    </div>
                    <span className="text-[10px] font-bold text-white/50 ml-1">grâce à l'IA</span>
                  </div>
                </div>
              </div>

              <div className="relative max-w-2xl mx-auto w-full group pt-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition-opacity"></div>
                <div className="relative flex items-center bg-white border-2 border-gray-100 rounded-2xl p-1 shadow-2xl shadow-blue-500/5 group-focus-within:border-blue-600 transition-all">
                  <input 
                    type="text" 
                    placeholder="Collez un lien YouTube ici" 
                    className="w-full pl-6 pr-4 py-4 bg-transparent outline-none font-medium text-gray-900 placeholder:text-gray-300"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  />
                  <button 
                    onClick={() => navigator.clipboard.readText().then(text => setFormData({...formData, url: text}))}
                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shrink-0"
                    title="Coller le lien"
                  >
                    <Files size={20} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={handleAnalyze}
                  disabled={loading || !formData.url}
                  className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/25 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyse...
                    </>
                  ) : (
                    "Suivant"
                  )}
                </button>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  YouTube Vidéo • Long format recommandé
                </p>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="w-full max-w-2xl space-y-6 text-center animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  Sélectionner le timing
                </h2>
                <p className="text-gray-500 text-sm font-medium">
                  Choisissez le moment de début pour votre segment
                </p>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-black border-2 border-white">
                {analyzedVideo && (
                  <iframe 
                    id="youtube-player"
                    src={`https://www.youtube.com/embed/${analyzedVideo.id}?enablejsapi=1&start=${startTimeSec}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
                {/* Script to catch duration from Iframe API */}
                <script dangerouslySetInnerHTML={{ __html: `
                  if (window.YT) {
                    new YT.Player('youtube-player', {
                      events: {
                        'onReady': (event) => {
                          const duration = event.target.getDuration();
                          if (duration > 0) {
                            window.dispatchEvent(new CustomEvent('yt-duration', { detail: duration }));
                          }
                        }
                      }
                    });
                  } else {
                    const tag = document.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    const firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    window.onYouTubeIframeAPIReady = () => {
                      new YT.Player('youtube-player', {
                        events: {
                          'onReady': (event) => {
                            const duration = event.target.getDuration();
                            if (duration > 0) {
                              window.dispatchEvent(new CustomEvent('yt-duration', { detail: duration }));
                            }
                          }
                        }
                      });
                    };
                  }
                `}} />
              </div>

              <div className="w-full space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-blue-500/5">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-10">
                    Faites glisser le segment bleu pour capturer vos 7 minutes (07:00)
                  </p>
                  
                  <div className="relative h-12 flex items-center group px-1">
                    <div className="absolute inset-x-0 h-2 bg-gray-100 rounded-full"></div>
                    <input 
                      type="range"
                      min="0"
                      max={Math.max(0, (analyzedVideo?.duration || 0) - DURATION_WINDOW)}
                      value={startTimeSec}
                      onChange={(e) => setStartTimeSec(parseInt(e.target.value))}
                      className="absolute inset-x-0 w-full bg-transparent appearance-none cursor-grab z-10 segment-slider"
                      style={{ height: '40px' }}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-6 text-gray-900 font-black">
                    <span className="text-[10px] text-gray-400">0:00</span>
                    <div className="flex items-center gap-3 bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100 shadow-sm">
                      <Clock size={16} className="text-blue-600" />
                      <div className="flex flex-col items-start leading-none">
                        <span className="text-sm text-blue-700 tracking-tight font-black">
                         {formatSeconds(startTimeSec)} — {formatSeconds(startTimeSec + DURATION_WINDOW)}
                        </span>
                        <span className="text-[9px] text-blue-400 uppercase mt-0.5 tracking-tighter">Segment de 7 minutes</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">{formatSeconds(analyzedVideo?.duration || 0)}</span>
                  </div>
                </div>

                <style jsx global>{`
                    .segment-slider::-webkit-slider-runnable-track { background: transparent; height: 40px; }
                    .segment-slider::-webkit-slider-thumb {
                        appearance: none; height: 12px; width: ${(DURATION_WINDOW / (analyzedVideo?.duration || 1)) * 100}%;
                        background: #2563eb; border-radius: 99px; cursor: grab;
                        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), 0 10px 15px -3px rgba(37, 99, 235, 0.2);
                        transition: background 0.2s, transform 0.1s; border: 2px solid white; margin-top: 14px;
                    }
                    .segment-slider::-webkit-slider-thumb:active { cursor: grabbing; background: #1d4ed8; transform: scaleY(1.2); }
                    .segment-slider::-moz-range-thumb {
                        height: 12px; width: ${(DURATION_WINDOW / (analyzedVideo?.duration || 1)) * 100}%;
                        background: #2563eb; border-radius: 99px; cursor: grab; border: 2px solid white;
                    }
                `}</style>

                <div className="flex items-center justify-center gap-4">
                  <button onClick={prevStep} className="px-6 py-3 rounded-xl font-bold text-sm text-gray-400 hover:text-gray-900 transition-colors">
                    Retour
                  </button>
                  <button onClick={nextStep} className="bg-blue-600 text-white px-10 py-3.5 rounded-xl font-black text-base hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20">
                    Suivant <span className="text-[10px] opacity-70 font-bold">(10 crédits)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl mx-auto animate-in fade-in duration-500 py-4">
              <div className="flex flex-col space-y-12 min-h-[450px]">
                {step === 3 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300 flex-1">
                    {/* Language Selection */}
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Globe size={14} /> Langue du contenu
                      </label>
                      <div className="flex gap-4">
                        {["Français", "Anglais"].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setFormData({...formData, language: lang})}
                            className={`flex-1 py-4 px-6 rounded-2xl font-black border-2 transition-all text-lg ${
                              formData.language === lang ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 text-gray-400 hover:border-gray-200"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Voice Selection */}
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Mic size={14} /> Voix du narrateur
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {VOICES.map((voice) => (
                          <div key={voice.name} className="relative group">
                            <button
                              onClick={() => setFormData({...formData, voice: voice.name})}
                              className={`w-full p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center ${
                                formData.voice === voice.name ? "border-blue-600 bg-blue-50" : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                              }`}
                            >
                              <div className={`w-12 h-12 rounded-full ${voice.color} flex items-center justify-center text-white font-bold shadow-sm relative text-lg`}>
                                {voice.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-base font-black text-gray-900 leading-tight">{voice.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{voice.gender}</p>
                              </div>
                            </button>
                            
                            {/* Individual Play Button */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                new Audio(voice.preview).play();
                              }}
                              className="absolute top-3 right-3 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
                              title="Écouter la démo"
                            >
                              <Play size={14} fill="currentColor" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300 flex-1">
                    {/* Music Selection - Custom Select */}
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Music size={14} /> Musique de fond
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setMusicDropdownOpen(!musicDropdownOpen)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 transition-all hover:border-blue-600 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
                              <Music size={14} />
                            </div>
                            <span className="text-sm">{formData.music}</span>
                          </div>
                          <ChevronRight size={18} className={`text-gray-400 transition-transform ${musicDropdownOpen ? "rotate-90" : ""}`} />
                        </button>

                        {musicDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-20" 
                              onClick={() => setMusicDropdownOpen(false)} 
                            />
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                              {MUSIC_TRACKS.map((track) => (
                                <div 
                                  key={track.name}
                                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                                    formData.music === track.name ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-700"
                                  }`}
                                  onClick={() => {
                                    setFormData({...formData, music: track.name});
                                    setMusicDropdownOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${formData.music === track.name ? "bg-blue-600" : "bg-transparent"}`} />
                                    <span className="text-sm font-bold">{track.name}</span>
                                  </div>
                                  
                                  {track.preview && (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        new Audio(track.preview).play();
                                      }}
                                      className="w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm hover:scale-110 active:scale-95 transition-all"
                                    >
                                      <Play size={12} fill="currentColor" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Subtitle Styles */}
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} /> Style des sous-titres
                      </label>
                      <div className="grid grid-cols-5 gap-3">
                        {SUBTITLE_MODELS.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => setFormData({...formData, captionStyle: model.id})}
                            className={`aspect-square rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-2 text-center gap-1 ${
                              formData.captionStyle === model.id ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                            }`}
                          >
                            {model.id === 'none' ? (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-300">
                                <CheckCircle2 size={14} />
                              </div>
                            ) : (
                              <div className={`text-xl font-black ${model.color}`}>Aa</div>
                            )}
                            <span className="text-[10px] font-bold text-gray-900 truncate w-full">{model.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Background Options - Mutually Exclusive */}
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                         Options d'affichage
                      </label>
                      <div className="flex gap-8">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-10 h-6 rounded-full transition-all relative ${formData.blurredBg ? "bg-blue-600" : "bg-gray-200"}`}>
                            <input 
                              type="radio" 
                              name="bgOption" 
                              className="hidden" 
                              checked={formData.blurredBg} 
                              onChange={() => setFormData({...formData, blurredBg: true, blackBars: false})} 
                            />
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.blurredBg ? "left-5" : "left-1"}`} />
                          </div>
                          <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">Arrière-plan flou</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-10 h-6 rounded-full transition-all relative ${formData.blackBars ? "bg-blue-600" : "bg-gray-200"}`}>
                            <input 
                              type="radio" 
                              name="bgOption" 
                              className="hidden" 
                              checked={formData.blackBars} 
                              onChange={() => setFormData({...formData, blackBars: true, blurredBg: false})} 
                            />
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.blackBars ? "left-5" : "left-1"}`} />
                          </div>
                          <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">Bandes noires</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto shrink-0">
                  <button onClick={prevStep} className="flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors">
                    <ChevronLeft size={16} /> Retour
                  </button>
                  {step < 4 ? (
                    <button onClick={nextStep} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg">
                      Suivant <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button onClick={() => toast.success("Vidéo envoyée en génération !")} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2">
                      Créer la vidéo <Zap size={16} fill="white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
