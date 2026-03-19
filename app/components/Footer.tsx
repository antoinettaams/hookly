'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  const hideFooterRoutes = [
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

  const shouldHideFooter = hideFooterRoutes.some(route => 
    pathname?.startsWith(route)
  );

  if (shouldHideFooter) {
    return null;
  }

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] py-8 sm:py-12 px-4 sm:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center justify-start gap-2">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            H<span className="text-[#6C4DFF]">o</span>okly
          </span>
        </Link>

        {/* Liens légaux ET Réseaux sociaux (Mobile) */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 text-sm font-semibold text-[var(--text-secondary)]">
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="hover:text-[var(--text-primary)] transition-colors">
              Mentions légales
            </Link>
            <Link href="/contact" className="hover:text-[var(--text-primary)] transition-colors">
              Contact
            </Link>
          </div>

          {/* Icônes mobiles */}
          <div className="flex items-center gap-4 md:hidden">
            <a href="https://facebook.com" target="_blank" className="hover:text-[var(--text-primary)] transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" className="hover:text-[var(--text-primary)] transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://tiktok.com" target="_blank" className="hover:text-[var(--text-primary)] transition-colors" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Réseaux sociaux desktop */}
        <div className="hidden md:flex items-center gap-4">
          <a href="https://facebook.com" target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 hover:bg-white/5 rounded-full" aria-label="Facebook">
            <Facebook size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 hover:bg-white/5 rounded-full" aria-label="Instagram">
            <Instagram size={20} />
          </a>
          <a href="https://tiktok.com" target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 hover:bg-white/5 rounded-full" aria-label="TikTok">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-left md:text-right text-xs sm:text-sm text-[var(--text-secondary)] font-semibold">
          © 2026 Hookly — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}