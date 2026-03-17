'use client';

import React from 'react';
import Link from 'next/link';
import { FadeIn } from '../components/FadeIn';
import { ArrowLeft } from 'lucide-react';

export default function Login(){
  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

         <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Retour à l'accueil</span>
        </Link>
        <FadeIn>
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(108,77,255,0.1)]">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Bon retour</h1>
              <p className="text-white/60">Connecte-toi pour continuer.</p>
            </div> 
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="ton@email.com" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#6C4DFF]/50 focus:ring-1 focus:ring-[#6C4DFF]/50 transition-all"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-white/80">Mot de passe</label>
                  <Link href="/forgot-password" className="text-xs text-[#6C4DFF] hover:text-[#6C4DFF]/80 font-semibold transition-colors">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#6C4DFF]/50 focus:ring-1 focus:ring-[#6C4DFF]/50 transition-all"
                />
              </div>
              
              <Link href="/dashboard" className="block text-center w-full bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-[0_0_15px_rgba(108,77,255,0.3)] mt-4">
                Se connecter
              </Link>
            </form>
            
            <div className="mt-8 text-center text-sm text-white/60">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-[#6C4DFF] hover:text-[#6C4DFF]/80 font-semibold transition-colors">
                S'inscrire
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
};