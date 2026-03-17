'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FadeIn } from '../components/FadeIn';

export default function Generator () {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [tone, setTone] = useState('Curiosité');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setResults([
        "[Vidéo] Plan serré dynamique avec texte : Personne ne te dit ça sur " + topic + "...",
        "[Vidéo] Transition rapide avant/après avec texte : J'ai testé cette méthode pour " + topic + " pendant 30 jours",
        "[Vidéo] Quelqu'un qui fait mal une action barré en rouge avec texte : Arrête de faire ça si tu veux réussir dans " + topic + ".",
        "[Vidéo] Chuchotement face caméra avec texte : Le secret le mieux gardé concernant " + topic + " vient d'être révélé.",
        "[Vidéo] Graphique qui monte en flèche avec texte : Pourquoi 99% des gens échouent avec " + topic + ".",
        "[Vidéo] Pointage du doigt vers le spectateur avec texte : Si tu regardes cette vidéo, tu as un avantage déloyal sur " + topic + ".",
        "[Vidéo] Gros plan sur une erreur commune avec texte : Voici l'erreur que tout le monde fait avec " + topic + ".",
        "[Vidéo] Regard choqué face caméra avec texte : Je n'arrive pas à croire que cette technique pour " + topic + " soit légale.",
        "[Vidéo] Document confidentiel révélé avec texte : La vérité choquante sur " + topic + " que les experts te cachent.",
        "[Vidéo] Chronomètre qui défile vite avec texte : Comment j'ai hacké " + topic + " en moins de 24 heures."
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <main className="pt-32 pb-24 px-6 flex-1">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Générateur de hooks vidéos</h1>
            <p className="text-white/60">Crée tes hooks vidéos de quelques secondes pour tes prochaines vidéos.</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-[400px_1fr] gap-8">
          {/* Controls */}
          <FadeIn delay={0.1}>
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(108,77,255,0.05)] h-fit sticky top-28">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">Quel est le sujet de ta vidéo ?</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Comment optimiser son sommeil pour être plus productif" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#6C4DFF]/50 focus:ring-1 focus:ring-[#6C4DFF]/50 transition-all resize-none h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">Plateforme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['TikTok', 'YouTube', 'Instagram'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
                          platform === p 
                            ? 'bg-[#6C4DFF]/20 border-[#6C4DFF]/50 text-[#6C4DFF]' 
                            : 'bg-black/40 border-white/5 text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">Ton de l'accroche</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Curiosité', 'Choc', 'Storytelling', 'Humour'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
                          tone === t 
                            ? 'bg-[#6C4DFF]/20 border-[#6C4DFF]/50 text-[#6C4DFF]' 
                            : 'bg-black/40 border-white/5 text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={!topic.trim() || isGenerating}
                  className="w-full bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 disabled:opacity-50 disabled:hover:bg-[#6C4DFF] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(108,77,255,0.3)] flex items-center justify-center gap-2 mt-4"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Générer mes hooks
                    </>
                  )}
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Results */}
          <FadeIn delay={0.2}>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Résultats</h2>
                {results.length > 0 && (
                  <span className="text-sm font-semibold text-white/40 bg-white/5 px-3 py-1 rounded-full">
                    {results.length} hooks vidéos générés
                  </span>
                )}
              </div>

              {results.length === 0 ? (
                <div className="bg-[#111111] border border-white/5 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center h-[400px]">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                    <Sparkles size={32} />
                  </div>
                  <p className="text-white/40 font-medium max-w-sm">
                    Remplis le formulaire à gauche et clique sur "Générer mes hooks" pour voir tes hooks vidéos apparaître ici.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((hook, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="bg-[#111111] border border-white/5 rounded-xl p-5 flex gap-4 items-start group hover:border-[#6C4DFF]/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#6C4DFF]/10 text-[#6C4DFF] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-base text-white/90 leading-relaxed pt-1 flex-1">{hook}</p>
                      <button 
                        onClick={() => handleCopy(hook, i)}
                        className="ml-auto text-white/40 hover:text-[#6C4DFF] transition-colors p-2 bg-white/5 rounded-lg hover:bg-[#6C4DFF]/10"
                        title="Copier l'idée de vidéo"
                      >
                        {copiedIndex === i ? (
                          <CheckCircle2 size={18} className="text-green-500" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
};