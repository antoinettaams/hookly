'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Liste des routes où la navbar ne doit PAS s'afficher
  const hideNavbarRoutes = [
    '/dashboard',
    '/login',
    '/register',
    '/forgot-password',
    '/generator',
    '/pricing',
    '/hooks',
    '/settings',
    '/profile'
  ];

  // Vérifie si la route actuelle doit cacher la navbar
  const shouldHideNavbar = hideNavbarRoutes.some(route => 
    pathname?.startsWith(route)
  );

  // Détecte le scroll pour changer le style de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Empêche le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Ferme le menu quand on redimensionne l'écran (passage en desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Si on est sur une route à cacher, on ne rend rien
  if (shouldHideNavbar) {
    return null;
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        isScrolled 
          ? 'bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)] py-2' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-[70]">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              H<span className="text-[#6C4DFF]">o</span>okly
            </span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--text-secondary)]">
            <Link href="/#features" className="hover:text-[var(--text-primary)] transition-colors">
              Fonctionnalités
            </Link>
            <Link href="/#examples" className="hover:text-[var(--text-primary)] transition-colors">
              Exemples
            </Link>
            <Link href="/#pricing" className="hover:text-[var(--text-primary)] transition-colors">
              Tarifs
            </Link>
          </div>

          {/* Bouton CTA Desktop */}
          <div className="hidden md:block">
            <Link 
              href="/register" 
              className="bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(108,77,255,0.3)]"
            >
              Essayer gratuitement
            </Link>
          </div>

          {/* Bouton Hamburger Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[var(--text-primary)] transition-colors z-[70] p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menu Mobile */}
        <div 
          className={`fixed inset-0 bg-[var(--bg-primary)]/98 backdrop-blur-xl z-[50] transition-all duration-300 md:hidden ${
            isMenuOpen 
              ? 'opacity-100 visible' 
              : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          <div className="flex flex-col h-full pt-24 pb-12 px-6">
            <div className="flex flex-col gap-4">
              <Link 
                href="/#features" 
                className="text-2xl font-bold text-[var(--text-primary)] py-4 border-b border-[var(--border-color)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link 
                href="/#examples" 
                className="text-2xl font-bold text-[var(--text-primary)] py-4 border-b border-[var(--border-color)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Exemples
              </Link>
              <Link 
                href="/#pricing" 
                className="text-2xl font-bold text-[var(--text-primary)] py-4 border-b border-[var(--border-color)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Tarifs
              </Link>
            </div>

            <div className="mt-auto space-y-6">
              <Link 
                href="/register" 
                className="block w-full bg-[#6C4DFF] text-white px-6 py-5 rounded-2xl font-bold text-lg text-center shadow-[0_0_30px_rgba(108,77,255,0.4)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Essayer gratuitement
              </Link>
              
              <div className="text-center">
                <p className="text-[var(--text-secondary)] text-base">
                  Déjà un compte ?{' '}
                  <Link 
                    href="/login" 
                    className="text-[#6C4DFF] font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}