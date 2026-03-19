'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Zap,
  Video,
  Settings,
  Crown,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  isMobileOpen: boolean;
  onToggle: () => void;
  onMobileToggle: () => void;
  onLogout: () => void;
}

// Interface pour les items du menu
interface MenuItem {
  name: string;
  icon: any;
  href: string;
}

export default function Sidebar({ isOpen, isMobileOpen, onToggle, onMobileToggle, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const { user, getRemainingHooks, getRemainingDownloads } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Menu principal (identique pour tous)
  const menuItems: MenuItem[] = [
    { name: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Générer', icon: Zap, href: '/generator' },
    { name: 'Mes hooks', icon: Video, href: '/hooks' },
  ];

  // Menu du bas
  const bottomMenuItems: MenuItem[] = [
    { name: 'Paramètres', icon: Settings, href: '/settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href) || false;
  };

  // Sur mobile, on utilise isMobileOpen, sur desktop on utilise isOpen
  const sidebarWidth = isMobile 
    ? (isMobileOpen ? 'w-64' : 'w-0')
    : (isOpen ? 'w-64' : 'w-20');

  const sidebarVisibility = isMobile 
    ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full')
    : 'translate-x-0';

  // Obtenir les valeurs restantes
  const remainingHooks = user ? getRemainingHooks() : 0;
  const remainingDownloads = user ? getRemainingDownloads() : 0;

  return (
    <>
      {/* Overlay pour mobile quand la sidebar est ouverte */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col z-50
        transition-all duration-300
        ${sidebarWidth}
        ${sidebarVisibility}
        ${isMobile ? 'shadow-2xl' : ''}
        ${isMobile && !isMobileOpen ? 'hidden' : ''}
      `}>
        {/* Logo avec toggle */}
        <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 overflow-hidden"
            onClick={() => isMobile && onMobileToggle()}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#6C4DFF] to-purple-600 rounded-lg flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            {/* Afficher "Hookly" quand ouvert, "H" quand réduit */}
            {(isOpen || isMobileOpen) ? (
              <span className="font-bold text-xl whitespace-nowrap text-[var(--text-primary)]">Hookly</span>
            ) : (
              <span className="font-bold text-xl whitespace-nowrap text-[#6C4DFF]">H</span>
            )}
          </Link>
          
          {/* Bouton toggle pour desktop */}
          {!isMobile && (
            <button 
              onClick={onToggle}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors hidden lg:block text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label={isOpen ? 'Réduire' : 'Agrandir'}
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          )}

          {/* Bouton fermer pour mobile */}
          {isMobile && isMobileOpen && (
            <button 
              onClick={onMobileToggle}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => isMobile && onMobileToggle()}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${active 
                        ? 'bg-[#6C4DFF] text-white shadow-[0_0_15px_rgba(108,77,255,0.3)]' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                      }
                    `}
                    title={!isOpen && !isMobile ? item.name : undefined}
                  >
                    <item.icon size={20} className="shrink-0" />
                    {/* Afficher le texte seulement si ouvert */}
                    {(isOpen || isMobileOpen) && (
                      <span className="text-sm font-semibold">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[var(--border-color)]">
          <ul className="space-y-2">
            {/* Paramètres */}
            {bottomMenuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => isMobile && onMobileToggle()}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
                  title={!isOpen && !isMobile ? item.name : undefined}
                >
                  <item.icon size={20} className="shrink-0" />
                  {(isOpen || isMobileOpen) && <span className="text-sm font-semibold">{item.name}</span>}
                </Link>
              </li>
            ))}
            
            {/* Bouton Déconnexion */}
            <li>
              <button
                onClick={() => {
                  onLogout();
                  isMobile && onMobileToggle();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/5 transition-all"
                title={!isOpen && !isMobile ? 'Déconnexion' : undefined}
              >
                <LogOut size={20} className="shrink-0" />
                {(isOpen || isMobileOpen) && <span className="text-sm font-semibold">Déconnexion</span>}
              </button>
            </li>
          </ul>

          {/* Plan Card - Adaptée au plan avec les nouvelles données */}
          <div className="mt-4 p-4 bg-gradient-to-br from-[#6C4DFF]/20 to-transparent rounded-xl border border-[#6C4DFF]/20">
            {/* Version ouverte (avec texte) */}
            {(isOpen || isMobileOpen) ? (
              <>
                <div className="flex items-center gap-2 text-[#6C4DFF] mb-2">
                  <Crown size={16} className="shrink-0" />
                  <span className="text-xs font-bold uppercase">
                    Plan {user?.plan === 'Pro' ? 'Pro' : 'Gratuit'}
                  </span>
                </div>
                
                {/* Contenu différent selon le plan */}
                {user?.plan === 'Pro' ? (
                  // Affichage PRO
                  <>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">
                      <span className="text-[#6C4DFF] font-bold">30 hooks/jour</span> • {remainingDownloads} téléchargements restants ce mois
                    </p>
                    <div className="text-center text-xs text-[var(--text-secondary)] bg-white/5 py-2 rounded-lg">
                      Accès illimité aux fonctionnalités ✨
                    </div>
                  </>
                ) : (
                  // Affichage GRATUIT
                  <>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">
                      <span className="font-bold text-[var(--text-primary)]">{remainingHooks}</span> hooks restants aujourd'hui
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">
                      {remainingDownloads} téléchargement{remainingDownloads > 1 ? 's' : ''} restant{remainingDownloads > 1 ? 's' : ''}
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs text-[var(--text-secondary)] bg-white/5 p-2 rounded-lg">
                        3 hooks/jour • 1 téléchargement/jour
                      </div>
                      <Link 
                        href="/pricing" 
                        onClick={() => isMobile && onMobileToggle()}
                        className="block text-center bg-[#6C4DFF] text-white text-xs py-2 rounded-lg font-bold hover:bg-[#6C4DFF]/90 transition-all"
                      >
                        Passer au Pro
                      </Link>
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Version réduite (juste l'icône) */
              <div className="flex justify-center">
                <Crown size={20} className="text-[#6C4DFF]" />
              </div>
            )}
          </div>

          {/* Mini avatar quand sidebar fermée (desktop seulement) */}
          {!isMobile && !isOpen && (
            <div className="mt-4 flex justify-center">
              <Link href="/profile">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C4DFF] to-purple-600 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:ring-2 hover:ring-[#6C4DFF] transition-all">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Espace pour la barre mobile sur le contenu principal */}
      {isMobile && !isMobileOpen && (
        <div className="h-16 lg:hidden" />
      )}
    </>
  );
}