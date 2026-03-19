'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  RefreshCw,
  Menu,
  Search,
  Bell,
  Lock,
  Play,
  Eye,
  Zap,
  Heart,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FadeIn from '../components/FadeIn';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import LogoutModal from '../components/LogoutModal';

// Styles de hook avec leurs couleurs
const hookStyles = [
  { id: 'auto', name: 'Auto', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'choc', name: 'Choc', icon: Zap, color: 'text-red-400', bg: 'bg-red-400/10' },
  { id: 'emotion', name: 'Émotion', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { id: 'curiosite', name: 'Curiosité', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10' },
];

// Types pour les vidéos
interface Video {
  id: number;
  title: string;
  style: string;
  type: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  views: string;
  downloadable: boolean;
}

export default function Generator() {
  const [niche, setNiche] = useState('');
  const [keywords, setKeywords] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [results, setResults] = useState<Video[]>([]);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const { user, isLoading, logout, getRemainingHooks, getRemainingDownloads, incrementHooksGenerated } = useAuth();

  // Calculer les générations restantes
  const generationsLeft = user ? getRemainingHooks() : 0;
  const isPro = user?.plan === 'Pro';

  // Déterminer combien de vidéos sont téléchargeables
  const getDownloadableCount = () => {
    if (isPro) return 3; // Pro peut tout télécharger
    return 1; // Gratuit seulement 1
  };

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (mobile) {
        setSidebarOpen(false);
        setIsMobileSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setIsMobileSidebarOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Gérer le clic sur le menu burger
  const handleMenuClick = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Simulation de génération
  const handleGenerate = async () => {
    if (!niche.trim() || !keywords.trim()) return;
    
    // Vérifier s'il reste des générations
    if (generationsLeft <= 0 && !isPro) {
      alert("Tu as atteint ta limite de générations pour aujourd'hui ! Passe en Pro pour générer plus.");
      return;
    }
    
    setIsGenerating(true);
    setGenerationStep(0);
    setResults([]);

    // Animation des étapes de génération
    const steps = [
      { message: "Analyse de ta niche...", duration: 800 },
      { message: "Création des hooks...", duration: 1200 },
      { message: "Génération des vidéos...", duration: 1000 }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setGenerationStep(index + 1);
      }, steps.slice(0, index).reduce((acc, s) => acc + s.duration, 0));
    });

    // Simuler la génération depuis une API
    setTimeout(async () => {
      // Générer des hooks basés sur les inputs
      const newVideos: Video[] = [
        {
          id: Date.now() + 1,
          title: `[${selectedStyle === 'auto' ? 'Choc' : selectedStyle}] Personne ne te dit ça sur ${niche}...`,
          style: selectedStyle === 'auto' ? 'choc' : selectedStyle,
          type: selectedStyle === 'auto' ? 'Choc' : selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1),
          videoUrl: '/videos/hook1.mp4',
          thumbnail: '/thumbnails/hook1.jpg',
          duration: '0:15',
          views: '0',
          downloadable: true // La première est toujours téléchargeable
        },
        {
          id: Date.now() + 2,
          title: `J'ai testé cette méthode pour ${keywords} pendant 30 jours...`,
          style: 'emotion',
          type: 'Émotion',
          videoUrl: '/videos/hook2.mp4',
          thumbnail: '/thumbnails/hook2.jpg',
          duration: '0:12',
          views: '0',
          downloadable: isPro // Seulement si Pro
        },
        {
          id: Date.now() + 3,
          title: `Le secret que personne ne te dit sur ${niche}...`,
          style: 'curiosite',
          type: 'Curiosité',
          videoUrl: '/videos/hook3.mp4',
          thumbnail: '/thumbnails/hook3.jpg',
          duration: '0:18',
          views: '0',
          downloadable: isPro // Seulement si Pro
        }
      ];

      setResults(newVideos);
      setIsGenerating(false);
      setGenerationStep(0);
      
      // Incrémenter le compteur de hooks générés
      await incrementHooksGenerated();
    }, 3000);
  };

  const handleDownload = (videoId: number) => {
    const video = results.find(v => v.id === videoId);
    if (!video) return;
    
    // Vérifier si l'utilisateur peut télécharger
    if (!video.downloadable) {
      alert("Cette vidéo est verrouillée. Passe en Pro pour télécharger toutes les vidéos !");
      return;
    }
    
    console.log('Téléchargement vidéo:', videoId);
    // Logique de téléchargement réelle ici
  };

  const handleRegenerate = (videoId: number) => {
    console.log('Regénération vidéo:', videoId);
    // Logique de regénération ici
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C4DFF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex">
      <Sidebar 
        isOpen={sidebarOpen}
        isMobileOpen={isMobileSidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onLogout={() => setLogoutModalOpen(true)}
      />

      <main className={`
        flex-1 transition-all duration-300
        ${sidebarOpen && !isMobile ? 'ml-64' : ''}
        ${!sidebarOpen && !isMobile ? 'ml-20' : ''}
        w-full
      `}>
        {/* Header */}
        <header className="h-16 lg:h-20 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-40">
          <div className="h-full px-3 sm:px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <button
                onClick={handleMenuClick}
                className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <Menu size={20} className="text-[var(--text-secondary)]" />
              </button>

              <div className="relative flex-1 max-w-[180px] sm:max-w-[250px] md:max-w-sm lg:max-w-md">
                <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="Rechercher un hook..."
                  className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg lg:rounded-xl pl-8 pr-3 py-2 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#6C4DFF]/50 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Bell size={18} className="text-[var(--text-secondary)]" />
              </button>
              <Link 
                href="/profile" 
                className="flex items-center gap-2 pl-1 sm:pl-2 lg:pl-2 border-l border-[var(--border-color)] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-semibold">{user?.name || 'Joellaams'}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{user?.plan || 'Gratuit'}</p>
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-[#6C4DFF] to-purple-600 flex items-center justify-center text-white font-bold text-sm lg:text-base overflow-hidden ring-2 ring-[#6C4DFF]/20">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    (user?.name || 'J').charAt(0).toUpperCase()
                  )}
                </div>
              </Link>   
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header avec stats en temps réel */}
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold mb-2">
                    Générateur de hooks vidéo
                  </h1>
                  <p className="text-sm lg:text-base text-[var(--text-secondary)]">
                    Crée des hooks viraux en quelques secondes
                  </p>
                </div>

                {/* Affichage des limites selon le plan */}
                <div className="flex items-center gap-4">
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3">
                    <span className="text-xs text-[var(--text-secondary)] block">
                      {isPro ? 'Hooks disponibles' : 'Hooks restants'}
                    </span>
                    <span className="text-lg font-bold text-[#6C4DFF]">
                      {isPro ? 'Illimité' : generationsLeft}
                    </span>
                  </div>
                  {!isPro && (
                    <Link
                      href="/pricing"
                      className="bg-gradient-to-r from-[#6C4DFF] to-purple-600 px-4 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all text-white"
                    >
                      Passer Pro
                    </Link>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Zone d'input */}
            <FadeIn delay={0.1}>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 lg:p-8 mb-8">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                      Ta niche
                    </label>
                    <input
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="Ex: Fitness, Business, Cuisine..."
                      className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#6C4DFF]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                      Thème / Mots-clés
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Ex: Perte de poids, Motivation, Recette..."
                      className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#6C4DFF]/50 transition-all"
                    />
                  </div>
                </div>

                {/* Style selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">
                    Style du hook
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {hookStyles.map((style) => {
                      const Icon = style.icon;
                      const isSelected = selectedStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`
                            flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                            ${isSelected 
                              ? `${style.bg} ${style.color} border border-${style.color.split('-')[1]}-400/30` 
                              : 'bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                            }
                          `}
                        >
                          <Icon size={16} />
                          {style.name}
                          {style.id === 'auto' && '(recommandé)'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bouton générer et warning */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={!niche.trim() || !keywords.trim() || isGenerating || (!isPro && generationsLeft === 0)}
                    className={`
                      bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 disabled:opacity-50 disabled:hover:bg-[#6C4DFF] 
                      text-white px-8 py-4 rounded-xl font-bold text-sm transition-all 
                      shadow-[0_0_20px_rgba(108,77,255,0.3)] flex items-center justify-center gap-2
                      min-w-[200px]
                    `}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        💥 Générer 3 hooks
                      </>
                    )}
                  </button>
                  
                  {!isPro && generationsLeft === 0 && (
                    <div className="flex items-center gap-2 text-amber-400 text-sm">
                      <AlertCircle size={16} />
                      <span>Plus de générations aujourd'hui. Passe en Pro !</span>
                    </div>
                  )}
                </div>

                {/* Rappel des limites pour les gratuits */}
                {!isPro && generationsLeft > 0 && (
                  <p className="text-xs text-[var(--text-secondary)] mt-4 text-center sm:text-left">
                    ℹ️ Il te reste {generationsLeft} génération{generationsLeft > 1 ? 's' : ''} aujourd'hui
                  </p>
                )}
              </div>
            </FadeIn>

            {/* État de chargement */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 mb-8 text-center"
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#6C4DFF]/20 flex items-center justify-center mb-4">
                      {generationStep === 1 && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <Search size={32} className="text-[#6C4DFF]" />
                        </motion.div>
                      )}
                      {generationStep === 2 && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        >
                          <Sparkles size={32} className="text-[#6C4DFF]" />
                        </motion.div>
                      )}
                      {generationStep === 3 && (
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <Play size={32} className="text-[#6C4DFF]" />
                        </motion.div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
                      {generationStep === 1 && "Analyse de ta niche..."}
                      {generationStep === 2 && "Création des hooks..."}
                      {generationStep === 3 && "Génération des vidéos..."}
                    </h3>
                    
                    <div className="w-64 h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-[#6C4DFF]"
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: generationStep === 1 ? "33%" : 
                                 generationStep === 2 ? "66%" : 
                                 generationStep === 3 ? "100%" : "0%" 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Résultats - 3 vidéos côte à côte */}
            {results.length > 0 && (
              <FadeIn delay={0.2}>
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl lg:text-2xl font-bold">Tes hooks vidéo</h2>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {!isPro ? `${getDownloadableCount()}/3 vidéos téléchargeables 🔒` : 'Toutes les vidéos sont téléchargeables ✨'}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((video, index) => {
                      const isLocked = !video.downloadable;
                      const style = hookStyles.find(s => s.id === video.style);
                      const StyleIcon = style?.icon || Sparkles;

                      return (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`
                            relative group bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden
                            ${isLocked ? 'opacity-75' : 'hover:border-[#6C4DFF]/30 hover:shadow-[0_0_30px_rgba(108,77,255,0.1)]'} 
                            transition-all
                          `}
                          onMouseEnter={() => setHoveredVideo(video.id)}
                          onMouseLeave={() => setHoveredVideo(null)}
                        >
                          {/* Miniature vidéo avec overlay */}
                          <div className="relative aspect-video bg-black/60">
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#6C4DFF]/20 to-purple-600/20">
                              {isLocked ? (
                                <Lock size={32} className="text-white/40" />
                              ) : (
                                <Play size={32} className="text-white/40 group-hover:text-[#6C4DFF] transition-colors" />
                              )}
                            </div>

                            {/* Overlay au hover */}
                            {hoveredVideo === video.id && !isLocked && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4"
                              >
                                <button className="w-12 h-12 rounded-full bg-[#6C4DFF] flex items-center justify-center hover:scale-110 transition-transform">
                                  <Play size={20} className="text-white ml-1" />
                                </button>
                              </motion.div>
                            )}

                            {/* Badge durée */}
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
                              {video.duration}
                            </span>

                            {/* Badge type de hook */}
                            <div className={`absolute top-2 left-2 ${style?.bg} ${style?.color} text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1`}>
                              <StyleIcon size={12} />
                              {video.type}
                            </div>

                            {/* Badge verrouillé */}
                            {isLocked && (
                              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                <div className="text-center">
                                  <Lock size={32} className="text-amber-400 mx-auto mb-2" />
                                  <p className="text-sm font-bold text-white">Verrouillé</p>
                                  <p className="text-xs text-white/60">Passe en Pro</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Infos vidéo */}
                          <div className="p-4">
                            <h3 className="text-sm font-semibold mb-2 line-clamp-2 text-[var(--text-primary)]">
                              {video.title}
                            </h3>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                <Eye size={14} />
                                <span>{video.views} vues</span>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Bouton regénérer (toujours disponible) */}
                                <button
                                  onClick={() => handleRegenerate(video.id)}
                                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[#6C4DFF]"
                                  title="Regénérer"
                                >
                                  <RefreshCw size={16} />
                                </button>

                                {/* Bouton télécharger */}
                                <button
                                  onClick={() => handleDownload(video.id)}
                                  disabled={isLocked}
                                  className={`
                                    p-2 rounded-lg transition-colors
                                    ${isLocked 
                                      ? 'text-white/20 cursor-not-allowed' 
                                      : 'hover:bg-white/5 text-[var(--text-secondary)] hover:text-[#6C4DFF]'
                                    }
                                  `}
                                  title={isLocked ? 'Passe en Pro pour télécharger' : 'Télécharger'}
                                >
                                  <Download size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Message pour les utilisateurs gratuits */}
                  {!isPro && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-8 bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center"
                    >
                      <p className="text-sm text-[var(--text-secondary)]">
                        🔒 En version gratuite, tu peux générer 3 hooks par jour mais seulement 1 téléchargement.
                        <Link href="/pricing" className="text-amber-400 font-bold hover:underline ml-2">
                          Passe en Pro pour tout débloquer ✨
                        </Link>
                      </p>
                    </motion.div>
                  )}
                </div>
              </FadeIn>
            )}

            {/* État vide */}
            {!isGenerating && results.length === 0 && (
              <FadeIn delay={0.3}>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] border-dashed rounded-2xl p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full bg-[#6C4DFF]/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={32} className="text-[#6C4DFF]" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Prêt à créer des hooks viraux ?</h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                      Remplis les champs ci-dessus et clique sur "Générer 3 hooks" pour voir tes vidéos apparaître ici.
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs text-[var(--text-secondary)]">
                      <div className="p-2">
                        <Zap size={16} className="mx-auto mb-1 text-[#6C4DFF]" />
                        <span>Choc</span>
                      </div>
                      <div className="p-2">
                        <Heart size={16} className="mx-auto mb-1 text-[#6C4DFF]" />
                        <span>Émotion</span>
                      </div>
                      <div className="p-2">
                        <Eye size={16} className="mx-auto mb-1 text-[#6C4DFF]" />
                        <span>Curiosité</span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </main>

      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={async () => {
          try {
            await logout();
          } catch (error) {
            console.error('Erreur:', error);
            setLogoutModalOpen(false);
          }
        }}
      />
    </div>
  );
}