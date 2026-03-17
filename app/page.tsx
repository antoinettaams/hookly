'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  Zap, 
  Clock, 
  TrendingDown, 
  EyeOff, 
  Smartphone, 
  MessageCircle, 
  Copy, 
  Infinity, 
  Check, 
  ArrowRight,
  Sparkles,
  Play
} from 'lucide-react';
import FadeIn from './components/FadeIn';

function LandingContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [pathname, searchParams]);

  return (
    <main className="overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="min-h-screen px-4 sm:px-6 relative flex items-center pt-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-[#6C4DFF]/20 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] -z-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center w-full">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 text-[#6C4DFF] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              <Sparkles size={14} className="sm:w-4 sm:h-4" />
              <span>Propulsé par l'IA</span>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] mb-2 sm:mb-3 tracking-tight px-2">
              Génère le hook vidéo parfait pour commencer ta <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] to-purple-400">prochaine vidéo</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-4">
              L'outil IA qui crée des hooks vidéos de quelques secondes irrésistibles pour stopper le scroll sur TikTok, Reels et YouTube.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link href="/register" className="w-full sm:w-auto bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-[0_0_20px_rgba(108,77,255,0.4)] hover:shadow-[0_0_30px_rgba(108,77,255,0.6)] flex items-center justify-center gap-2">
                <Zap size={18} className="sm:w-5 sm:h-5" />
                <span className="whitespace-normal sm:whitespace-nowrap">Générer gratuitement</span>
              </Link>
              <a href="#examples" className="w-full sm:w-auto bg-transparent border border-white/20 hover:bg-white/5 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2">
                <Play size={18} className="sm:w-5 sm:h-5" />
                <span>Voir exemples</span>
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="mt-8 sm:mt-10 md:mt-12 relative mx-auto max-w-5xl px-2 sm:px-4">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A] z-10 pointer-events-none" />
              <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-[#111111] shadow-[0_0_50px_rgba(108,77,255,0.15)] overflow-hidden">
                <div className="h-10 sm:h-12 border-b border-white/5 flex items-center px-3 sm:px-4 gap-2 bg-black/20">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 sm:gap-6 md:gap-8 text-left">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1 sm:mb-2">Sujet</div>
                      <div className="bg-black/40 border border-white/5 rounded-lg p-2 sm:p-3 text-xs sm:text-sm text-white/80 break-words">
                        Comment optimiser son sommeil
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1 sm:mb-2">Plateforme</div>
                      <div className="flex flex-wrap gap-2">
                        <div className="bg-[#6C4DFF]/20 border border-[#6C4DFF]/30 text-[#6C4DFF] rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold">TikTok</div>
                        <div className="bg-black/40 border border-white/5 text-white/60 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold">Reels</div>
                      </div>
                    </div>
                    <button className="w-full bg-[#6C4DFF] text-white rounded-lg py-2 sm:py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(108,77,255,0.3)] pointer-events-none">
                      <Sparkles size={14} className="sm:w-4 sm:h-4" />
                      Générer (10)
                    </button>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1 sm:mb-2">Résultats (3/10)</div>
                    {[
                      "[Vidéo] Zoom rapide : Tu dors 8h par nuit mais tu es toujours fatigué ?",
                      "[Vidéo] Transition dynamique : J'ai testé la routine du PDG d'Apple...",
                      "[Vidéo] Tasse de café jetée : Arrête de boire du café le matin."
                    ].map((hook, i) => (
                      <div key={i} className="bg-black/40 border border-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 flex gap-3 items-start group hover:border-[#6C4DFF]/30 transition-colors">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#6C4DFF]/10 text-[#6C4DFF] flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-white/90 leading-relaxed flex-1 break-words">{hook}</p>
                        <button className="text-white/20 group-hover:text-[#6C4DFF] transition-colors shrink-0">
                          <Copy size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4">Pourquoi tes vidéos ne décollent pas ?</h2>
              <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto px-4">
                Les 3 premières secondes décident de tout. Un mauvais hook vidéo = personne ne regarde.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
            {[
              { icon: Clock, text: "Tu passes des heures à chercher comment commencer ta vidéo" },
              { icon: TrendingDown, text: "Tes vidéos ont peu de vues malgré un bon contenu" },
              { icon: EyeOff, text: "Ton audience ne s'arrête pas sur ton contenu" }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#111111] border border-white/5 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center h-full">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 sm:mb-6 text-white/80 mx-auto">
                    <item.icon size={24} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-white/90 leading-snug">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <p className="text-center text-xl sm:text-2xl font-bold text-[#6C4DFF]">
              Hookly règle ça en 10 secondes.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 md:mb-20 px-4">
              Crée tes hooks vidéos en 3 étapes simples
            </h2>
          </FadeIn>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6C4DFF]/30 to-transparent -translate-y-1/2 z-0" />

            {[
              { num: "1", title: "Entre ton sujet de vidéo" },
              { num: "2", title: "Choisis ta plateforme" },
              { num: "3", title: "Reçois 10 hooks viraux" }
            ].map((step, i) => (
              <React.Fragment key={i}>
                <FadeIn delay={i * 0.2}>
                  <div className="relative z-10 flex flex-col items-center text-center w-full md:max-w-[280px] bg-[#0A0A0A] p-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#6C4DFF] mb-4 sm:mb-6 shadow-[0_0_30px_rgba(108,77,255,0.15)]">
                      {step.num}
                    </div>
                    <p className="text-sm sm:text-base md:text-lg font-semibold text-white/90 px-2">{step.title}</p>
                  </div>
                </FadeIn>
                {i < 2 && (
                  <div className="md:hidden text-[#6C4DFF]/30 my-2">
                    <ArrowRight className="rotate-90" size={24} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* EXAMPLES SECTION */}
      <section id="examples" className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-[#050505]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4">Exemples de hooks vidéos</h2>
              <div className="inline-block bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/60 font-semibold">
                Sujet : Fitness & perte de poids
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {[
              "Zoom ventre plat : Personne ne te dit ça sur la perte de ventre…",
              "Transition avant/après : J'ai testé cette routine pendant 30 jours",
              "Exercice barré : Arrête de faire ça si tu veux des abdos"
            ].map((hook, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#111111] border-l-4 border-l-[#6C4DFF] border-y border-r border-white/5 rounded-r-xl p-4 sm:p-6 md:p-8 h-full shadow-lg">
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-snug text-white/90 break-words">"{hook}"</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div className="text-center px-4">
              <Link href="/register" className="inline-block w-full sm:w-auto bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-[0_0_20px_rgba(108,77,255,0.4)]">
                Générer mes propres hooks
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 md:mb-20 px-4">
              Tout ce dont tu as besoin
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[
              { icon: Zap, text: "Générateur de hooks vidéos IA" },
              { icon: Smartphone, text: "Optimisé TikTok, YouTube, Instagram" },
              { icon: MessageCircle, text: "Multiples tons disponibles" },
              { icon: Copy, text: "50+ templates de vidéos" },
              { icon: Check, text: "Copie en 1 clic" },
              { icon: Infinity, text: "Génération illimitée (Pro)" }
            ].map((feature, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#111111] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 flex items-center gap-3 sm:gap-4 md:gap-6 hover:border-[#6C4DFF]/30 transition-colors group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#6C4DFF]/10 text-[#6C4DFF] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-white/90 break-words">{feature.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-[#050505]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 md:mb-20 px-4">
              Simple. Transparent. Abordable.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
            {/* Free Plan */}
            <FadeIn delay={0.1}>
              <div className="bg-[#111111] border border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 h-full flex flex-col">
                <div className="inline-block bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 w-fit">
                  Gratuit
                </div>
                <div className="mb-4 sm:mb-6 md:mb-8">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold">0€</span>
                  <span className="text-white/40 text-sm sm:text-base font-semibold">/mois</span>
                </div>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 md:mb-10 flex-1">
                  <li className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                    <Check size={16} className="sm:w-5 sm:h-5 text-[#6C4DFF] shrink-0" />
                    <span>10 hooks par jour</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                    <Check size={16} className="sm:w-5 sm:h-5 text-[#6C4DFF] shrink-0" />
                    <span>Plateformes principales</span>
                  </li>
                </ul>
                <Link href="/register" className="w-full text-center block bg-transparent border border-white/20 hover:bg-white/5 text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all">
                  Commencer gratuitement
                </Link>
              </div>
            </FadeIn>

            {/* Pro Plan */}
            <FadeIn delay={0.2}>
              <div className="bg-[#111111] border-2 border-[#6C4DFF] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 h-full flex flex-col relative shadow-[0_0_40px_rgba(108,77,255,0.15)]">
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-[#6C4DFF] text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg whitespace-nowrap">
                  Le plus populaire
                </div>
                <div className="mb-4 sm:mb-6 md:mb-8 mt-4 sm:mt-6">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold">9€</span>
                  <span className="text-white/40 text-sm sm:text-base font-semibold">/mois</span>
                </div>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 md:mb-10 flex-1">
                  <li className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                    <Check size={16} className="sm:w-5 sm:h-5 text-[#6C4DFF] shrink-0" />
                    <span>Hooks illimités</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                    <Check size={16} className="sm:w-5 sm:h-5 text-[#6C4DFF] shrink-0" />
                    <span>50+ templates</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                    <Check size={16} className="sm:w-5 sm:h-5 text-[#6C4DFF] shrink-0" />
                    <span>Tous les tons disponibles</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                    <Check size={16} className="sm:w-5 sm:h-5 text-[#6C4DFF] shrink-0" />
                    <span>Export scripts</span>
                  </li>
                </ul>
                <Link href="/register" className="w-full text-center block bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-[0_0_20px_rgba(108,77,255,0.4)]">
                  Passer en Pro
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-[#1A0A3D] to-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-4">
              Lance-toi. Tes prochains hooks t'attendent.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto px-4">
              Rejoins des milliers de créateurs qui cartonnent avec Hookly.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link href="/register" className="inline-flex w-full sm:w-auto bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all shadow-[0_0_30px_rgba(108,77,255,0.5)] items-center justify-center gap-2 sm:gap-3 mx-auto">
              <Zap size={20} className="sm:w-6 sm:h-6" />
              Générer gratuitement
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}

export default function Landing() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
      <LandingContent />
    </Suspense>
  );
}