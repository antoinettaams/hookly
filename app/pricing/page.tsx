'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

export default function Pricing () {
  return (
    <main className="pt-32 pb-24 px-6 flex-1">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Simple. Transparent. Abordable.</h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Choisis le plan qui te correspond pour générer tes hooks vidéos et faire décoller tes vues.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <FadeIn delay={0.1}>
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-10 h-full flex flex-col">
              <div className="inline-block bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm font-semibold mb-6 w-fit">
                Gratuit
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold">0€</span>
                <span className="text-white/40 font-semibold">/mois</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-white/80">
                  <Check size={20} className="text-[#6C4DFF]" />
                  <span>10 hooks par jour</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <Check size={20} className="text-[#6C4DFF]" />
                  <span>Plateformes principales (TikTok, Reels, Shorts)</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <Check size={20} className="text-[#6C4DFF]" />
                  <span>Ton standard</span>
                </li>
              </ul>
              <Link href="/register" className="w-full text-center block bg-transparent border border-white/20 hover:bg-white/5 text-white py-4 rounded-xl font-bold transition-all">
                Commencer gratuitement
              </Link>
            </div>
          </FadeIn>

          {/* Pro Plan */}
          <FadeIn delay={0.2}>
            <div className="bg-[#111111] border-2 border-[#6C4DFF] rounded-3xl p-10 h-full flex flex-col relative shadow-[0_0_40px_rgba(108,77,255,0.15)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6C4DFF] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                Le plus populaire
              </div>
              <div className="mb-8 mt-2">
                <span className="text-5xl font-bold">9€</span>
                <span className="text-white/40 font-semibold">/mois</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-white/80">
                  <Check size={20} className="text-[#6C4DFF]" />
                  <span>Hooks illimités</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <Check size={20} className="text-[#6C4DFF]" />
                  <span>50+ templates de hooks vidéos</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <Check size={20} className="text-[#6C4DFF]" />
                  <span>Tous les tons disponibles (Choc, Humour, etc.)</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <Check size={20} className="text-[#6C4DFF]" />
                  <span>Export des scripts</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <Check size={20} className="text-[#6C4DFF]" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
              <Link href="/register" className="w-full text-center block bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(108,77,255,0.4)]">
                Passer en Pro
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
};