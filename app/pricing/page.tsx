'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ArrowLeft, Menu, Search, Bell, Crown, Sparkles, Zap, Video, Download, Clock, Eye, Copy, Star, Settings, LogOut } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import LogoutModal from '../components/LogoutModal';
import { usePathname } from 'next/navigation';

export default function Pricing() {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();

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

  // Données utilisateur
  const displayUser = {
    name: user?.name || 'Joellaams',
    plan: user?.plan || 'Gratuit',
    avatar: user?.avatar || null
  };

  // Tableau comparatif des fonctionnalités
  const features = [
    { name: 'Hooks / jour', free: '3', pro: '30' },
    { name: 'Téléchargements', free: '1/jour', pro: '50/mois' },
    { name: 'Styles', free: 'Limité', pro: 'Tous' },
    { name: 'Variantes', free: '❌', pro: '✔️' },
    { name: 'Qualité vidéo', free: 'Standard', pro: 'Haute' },
    { name: 'Watermark', free: 'Oui', pro: 'Non' },
    { name: 'Vitesse', free: 'Normale', pro: 'Rapide' }
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

              {/* Barre de recherche */}
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
              {/* Profil avec initiales */}
              <Link 
                href="/profile" 
                className="flex items-center gap-2 pl-1 sm:pl-2 lg:pl-2 border-l border-[var(--border-color)] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-semibold">{displayUser.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{displayUser.plan}</p>
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-[#6C4DFF] to-purple-600 flex items-center justify-center text-white font-bold text-sm lg:text-base overflow-hidden ring-2 ring-[#6C4DFF]/20">
                  {displayUser.avatar ? (
                    <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover" />
                  ) : (
                      displayUser.name.charAt(0).toUpperCase()
                  )}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Pricing Content */}
        <div className="p-5 sm:p-6 lg:p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header avec titre et retour */}
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold mb-2">Nos offres</h1>
                  <p className="text-sm lg:text-base text-[var(--text-secondary)]">
                    Choisis le plan qui correspond à tes besoins
                  </p>
                </div>

                {/* Badge plan actuel */}
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-2.5">
                    <span className="text-xs text-[var(--text-secondary)] block">Plan actuel</span>
                    <span className="text-sm font-bold text-[#6C4DFF] flex items-center gap-1">
                      <Crown size={14} />
                      {displayUser.plan}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Cartes des plans */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Free Plan */}
              <FadeIn delay={0.2}>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-8 h-full flex flex-col">
                  <div className="inline-block bg-white/10 text-[var(--text-secondary)] px-3 py-1 rounded-full text-sm font-semibold mb-6 w-fit">
                    Gratuit
                  </div>
                  <div className="mb-8">
                    <span className="text-5xl font-bold">0 FCFA</span>
                    <span className="text-[var(--text-secondary)] font-semibold">/mois</span>
                  </div>
                  
                  {/* Features list */}
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span>3 hooks par jour</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span>1 téléchargement / jour</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span>Styles limités</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)] opacity-50">
                      <Check size={20} className="text-white/20" />
                      <span className="line-through">Variantes</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span>Qualité standard</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <span className="text-red-400 font-bold">⚠️</span>
                      <span>Watermark</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span>Vitesse normale</span>
                    </li>
                  </ul>

                  {displayUser.plan === 'Gratuit' ? (
                    <span className="w-full text-center block bg-white/5 text-[var(--text-secondary)] py-3 rounded-xl font-bold border border-[var(--border-color)] cursor-not-allowed">
                      Plan actuel
                    </span>
                  ) : (
                    <Link href="/dashboard" className="w-full text-center block bg-transparent border border-[var(--border-color)] hover:bg-white/5 text-[var(--text-primary)] py-3 rounded-xl font-bold transition-all">
                      Rester en Gratuit
                    </Link>
                  )}
                </div>
              </FadeIn>

              {/* Pro Plan */}
              <FadeIn delay={0.3}>
                <div className="bg-[var(--bg-secondary)] border-2 border-[#6C4DFF] rounded-3xl p-8 h-full flex flex-col relative shadow-[0_0_40px_rgba(108,77,255,0.15)] ">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6C4DFF] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    Le plus populaire
                  </div>
                  <div className="mb-8 mt-2">
                    <span className="text-5xl font-bold">5000 FCFA</span>
                    <span className="text-[var(--text-secondary)] font-semibold">/mois</span>
                  </div>
                  
                  {/* Features list */}
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span><span className="font-bold text-[#6C4DFF]">30 hooks</span> par jour</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span><span className="font-bold text-[#6C4DFF]">50 téléchargements</span> / mois</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span>Tous les styles</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span>Variantes incluses</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span>Qualité haute</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span>Sans watermark</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--text-primary)]">
                      <Check size={20} className="text-[#6C4DFF]" />
                      <span>Vitesse rapide</span>
                    </li>
                  </ul>

                  {displayUser.plan === 'Pro' ? (
                    <span className="w-full text-center block bg-[#6C4DFF]/20 text-[#6C4DFF] py-3 rounded-xl font-bold border border-[#6C4DFF]/30 cursor-not-allowed">
                      Plan actuel ✨
                    </span>
                  ) : (
                    <Link 
                      href="/checkout" 
                      className="w-full text-center block bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(108,77,255,0.4)]"
                    >
                      Passer en Pro
                    </Link>
                  )}
                </div>
              </FadeIn>
            </div>

            {/* Tableau comparatif */}
            <FadeIn delay={0.1}>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
                <div className="grid grid-cols-3 border-b border-[var(--border-color)] bg-black/20">
                  <div className="p-4 font-bold text-[var(--text-secondary)]">Fonctionnalités</div>
                  <div className="p-4 font-bold text-center text-[var(--text-secondary)]">Gratuit</div>
                  <div className="p-4 font-bold text-center text-[#6C4DFF] bg-[#6C4DFF]/5">Premium</div>
                </div>
                
                {features.map((feature, index) => (
                  <div key={index} className={`grid grid-cols-3 ${index !== features.length - 1 ? 'border-b border-[var(--border-color)]' : ''}`}>
                    <div className="p-4 text-[var(--text-primary)]">{feature.name}</div>
                    <div className="p-4 text-center text-[var(--text-secondary)]">{feature.free}</div>
                    <div className="p-4 text-center text-[var(--text-primary)] bg-[#6C4DFF]/5 font-medium">{feature.pro}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
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