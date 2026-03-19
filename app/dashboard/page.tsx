'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Zap, 
  Video, 
  Download,
  Search,
  Menu,
  Crown,
  Clock,
  Eye,
  Copy,
  MoreHorizontal,
  Bell,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import LogoutModal from '../components/LogoutModal';
import FadeIn from '../components/FadeIn';
import Sidebar from '../components/Sidebar';

// Types pour les hooks
interface Hook {
  id: string;
  title: string;
  platform: string;
  views: string;
  downloads: number;
  createdAt: string;
}

export default function Dashboard() {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [recentHooks, setRecentHooks] = useState<Hook[]>([]);
  const [isLoadingHooks, setIsLoadingHooks] = useState(true);
  
  const { user, isLoading, logout, getRemainingHooks, getRemainingDownloads } = useAuth();

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

  // Charger les hooks récents (simulé pour l'instant)
  useEffect(() => {
    const loadRecentHooks = async () => {
      setIsLoadingHooks(true);
      try {
        // Simuler un chargement depuis Firebase
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Si l'utilisateur a des hooks, on les affiche, sinon tableau vide
        if (user && user.usage.hooksGeneratedToday > 0) {
          setRecentHooks([
            { 
              id: '1', 
              title: "Tu savais que 90% des gens font cette erreur ?", 
              platform: "TikTok", 
              views: "1.2K", 
              downloads: 45,
              createdAt: new Date().toISOString()
            },
            { 
              id: '2', 
              title: "J'ai testé cette routine pendant 30 jours...", 
              platform: "Reels", 
              views: "3.4K", 
              downloads: 89,
              createdAt: new Date().toISOString()
            },
          ]);
        } else {
          setRecentHooks([]);
        }
      } catch (error) {
        console.error('Erreur chargement hooks:', error);
        setRecentHooks([]);
      } finally {
        setIsLoadingHooks(false);
      }
    };

    if (user) {
      loadRecentHooks();
    }
  }, [user]);

  // Gérer le clic sur le menu burger
  const handleMenuClick = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Calculer les statistiques en temps réel
  const stats = [
    { 
      title: 'Hooks générés', 
      value: user?.usage.hooksGeneratedToday || 0, 
      icon: Copy, 
      color: 'from-blue-500 to-blue-600', 
      bg: 'bg-blue-500/10' 
    },
    { 
      title: 'Téléchargements', 
      value: user?.usage.downloadsToday || 0, 
      icon: Download, 
      color: 'from-purple-500 to-purple-600', 
      bg: 'bg-purple-500/10' 
    },
    { 
      title: "Hooks restants", 
      value: getRemainingHooks(), 
      icon: Clock, 
      color: 'from-emerald-500 to-emerald-600', 
      bg: 'bg-emerald-500/10' 
    },
  ];

  // Hooks tendance (inspiration) - toujours disponibles
  const trendingHooks = [
    { id: 1, title: "Pourquoi tout le monde parle de ça ? 🔥", platform: "TikTok", views: "45.2K", viral: true },
    { id: 2, title: "La méthode secrète des créateurs pro", platform: "Reels", views: "23.1K", viral: true },
    { id: 3, title: "3 astuces que personne ne te dit", platform: "YouTube", views: "12.8K", viral: false },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C4DFF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        isMobileOpen={isMobileSidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onLogout={() => setLogoutModalOpen(true)}
      />

      {/* Main Content */}
      <main className={`
        flex-1 transition-all duration-300
        ${sidebarOpen && !isMobile ? 'ml-64' : ''}
        ${!sidebarOpen && !isMobile ? 'ml-20' : ''}
        w-full
      `}>
        {/* Header responsive */}
        <header className="h-16 lg:h-20 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-40">
          <div className="h-full px-3 sm:px-4 lg:px-8 flex items-center justify-between">
            {/* Partie gauche - Menu burger + recherche */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              {/* Bouton menu burger (mobile) */}
              <button
                onClick={handleMenuClick}
                className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <Menu size={20} className="text-[var(--text-secondary)]" />
              </button>

              {/* Barre de recherche - visible sur tous les écrans */}
              <div className="relative flex-1 max-w-[180px] sm:max-w-[250px] md:max-w-sm lg:max-w-md">
                <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg lg:rounded-xl pl-8 pr-3 py-2 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#6C4DFF]/50 transition-all"
                />
              </div>
            </div>

            {/* Partie droite - Notifications + Profil */}
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

        {/* Dashboard Content */}
        <div className="p-3 sm:p-4 lg:p-8">
          {/* Header avec infos rapides */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <div>
                <h1 className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2">
                  Bonjour {user?.name || 'Joellaams'} 👋
                </h1>
                <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                  <span className="text-xs lg:text-sm text-[var(--text-secondary)]">
                    Plan <span className="text-[#6C4DFF] font-semibold">{user?.plan || 'Gratuit'}</span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:block"></span>
                  <span className="text-xs lg:text-sm text-[var(--text-secondary)]">
                    {getRemainingHooks()} hook{getRemainingHooks() > 1 ? 's' : ''} restant{getRemainingHooks() > 1 ? 's' : ''} aujourd'hui
                  </span>
                </div>
              </div>
              
              {/* Bouton Créer un hook */}
              <Link 
                href="/generator"
                className="bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white px-4 sm:px-6 lg:px-8 py-2.5 lg:py-4 rounded-lg lg:rounded-xl font-bold text-sm lg:text-base transition-all shadow-[0_0_20px_rgba(108,77,255,0.3)] flex items-center gap-2 w-fit"
              >
                <Zap size={16} className="lg:w-5 lg:h-5" />
                <span className="hidden xs:inline">Créer un hook</span>
                <span className="xs:hidden">Créer</span>
              </Link>
            </div>
          </FadeIn>

          {/* Statistiques en temps réel */}
          <FadeIn delay={0.2}>
            <div className="mb-6 lg:mb-10">
              <h2 className="text-base lg:text-lg font-bold mb-3 lg:mb-4">Ta progression aujourd'hui</h2>
              <div className="grid grid-cols-3 gap-2 lg:gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg lg:rounded-xl p-2 lg:p-5 flex flex-col items-center text-center">
                    <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl ${stat.bg} flex items-center justify-center mb-1 lg:mb-2`}>
                      <stat.icon size={14} className="lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm lg:text-2xl font-bold">{stat.value}</p>
                      <p className="text-[10px] lg:text-sm text-[var(--text-secondary)] line-clamp-1">{stat.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Bloc Limites selon le plan */}
          {user?.plan !== 'Pro' && (
            <FadeIn delay={0.3}>
              <div className="mb-6 lg:mb-10">
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg lg:rounded-xl p-3 lg:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 lg:gap-4 w-full sm:w-auto">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                      <Crown size={16} className="lg:w-6 lg:h-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm lg:text-lg">
                        {getRemainingDownloads()} téléchargement{getRemainingDownloads() > 1 ? 's' : ''} restant{getRemainingDownloads() > 1 ? 's' : ''}
                      </h3>
                      <p className="text-[10px] lg:text-sm text-[var(--text-secondary)]">Passe au Premium pour plus</p>
                    </div>
                  </div>
                  <Link
                    href="/pricing"
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl font-bold text-xs lg:text-base transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] text-center"
                  >
                    Passer en Pro
                  </Link>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Bloc Derniers hooks - avec état de chargement et message si vide */}
          <FadeIn delay={0.4}>
            <div className="mb-6 lg:mb-10">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h2 className="text-base lg:text-lg font-bold">Tes derniers hooks</h2>
                {recentHooks.length > 0 && (
                  <Link href="/hooks" className="text-[#6C4DFF] text-xs lg:text-sm hover:underline">
                    Voir tout
                  </Link>
                )}
              </div>
              
              {isLoadingHooks ? (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg lg:rounded-xl p-8 text-center">
                  <Loader2 size={32} className="animate-spin text-[#6C4DFF] mx-auto mb-3" />
                  <p className="text-[var(--text-secondary)]">Chargement de tes hooks...</p>
                </div>
              ) : recentHooks.length === 0 ? (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] border-dashed rounded-lg lg:rounded-xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#6C4DFF]/10 flex items-center justify-center mx-auto mb-3">
                    <Video size={24} className="text-[#6C4DFF]" />
                  </div>
                  <h3 className="text-base lg:text-lg font-bold mb-2">Aucun hook pour le moment</h3>
                  <p className="text-xs lg:text-sm text-[var(--text-secondary)] mb-4">
                    Génère ton premier hook pour le voir apparaître ici
                  </p>
                  <Link
                    href="/generator"
                    className="inline-flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    <Zap size={16} />
                    Générer un hook
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {recentHooks.map((hook) => (
                    <div key={hook.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg lg:rounded-xl p-3 lg:p-5 hover:border-[#6C4DFF]/30 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[10px] lg:text-xs font-semibold bg-white/5 px-2 py-0.5 rounded-full">
                          {hook.platform}
                        </span>
                        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                          <MoreHorizontal size={14} className="lg:w-4 lg:h-4" />
                        </button>
                      </div>
                      <p className="text-xs lg:text-sm font-medium mb-2 line-clamp-2">{hook.title}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] lg:text-xs text-[var(--text-secondary)]">
                          <span className="flex items-center gap-0.5">
                            <Eye size={10} className="lg:w-3 lg:h-3" />
                            {hook.views}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Download size={10} className="lg:w-3 lg:h-3" />
                            {hook.downloads}
                          </span>
                        </div>
                        <button className="text-[#6C4DFF] hover:text-[#6C4DFF]/80 text-[10px] lg:text-xs font-semibold flex items-center gap-0.5">
                          <Download size={10} className="lg:w-3 lg:h-3" />
                          DL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Bloc Inspiration - toujours visible */}
          <FadeIn delay={0.5}>
            <div>
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h2 className="text-base lg:text-lg font-bold">Inspiration 🔥</h2>
                <span className="text-[10px] lg:text-xs text-[#6C4DFF] bg-[#6C4DFF]/10 px-2 py-0.5 rounded-full">
                  Tendance
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {trendingHooks.map((hook) => (
                  <div key={hook.id} className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-[var(--border-color)] rounded-lg lg:rounded-xl p-3 lg:p-5 hover:border-[#6C4DFF]/30 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[10px] lg:text-xs font-semibold bg-white/5 px-2 py-0.5 rounded-full">
                        {hook.platform}
                      </span>
                      {hook.viral && (
                        <span className="text-[8px] lg:text-xs font-bold text-pink-400 bg-pink-400/10 px-1.5 py-0.5 rounded-full">
                          Viral
                        </span>
                      )}
                    </div>
                    <p className="text-xs lg:text-sm font-medium mb-2 line-clamp-2">"{hook.title}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] lg:text-xs text-[var(--text-secondary)] flex items-center gap-0.5">
                        <Eye size={10} className="lg:w-3 lg:h-3" />
                        {hook.views}
                      </span>
                      <Link
                        href="/generator"
                        className="text-[#6C4DFF] hover:text-[#6C4DFF]/80 text-[10px] lg:text-xs font-semibold flex items-center gap-0.5"
                      >
                        <Zap size={10} className="lg:w-3 lg:h-3" />
                        Recréer
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </main>

      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={async () => {
          try {
            await logout();
          } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            setLogoutModalOpen(false);
          }
        }}
      />
    </div>
  );
}