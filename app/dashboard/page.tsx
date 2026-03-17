'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Clock, Video, Plus } from 'lucide-react';
import FadeIn from '../components/FadeIn';

export default function Dashboard () {
  return (
    <main className="pt-32 pb-24 px-6 flex-1">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Tableau de bord</h1>
              <p className="text-white/60">Bienvenue ! Voici un aperçu de ton activité.</p>
            </div>
            <Link 
              href="/generator" 
              className="bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(108,77,255,0.3)] flex items-center gap-2 w-fit"
            >
              <Plus size={18} />
              Nouveau hook vidéo
            </Link>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Hooks générés", value: "24", icon: Video, color: "text-blue-400", bg: "bg-blue-400/10" },
            { title: "Crédits restants", value: "76", icon: Zap, color: "text-[#6C4DFF]", bg: "bg-[#6C4DFF]/10" },
            { title: "Temps gagné", value: "4h", icon: Clock, color: "text-emerald-400", bg: "bg-emerald-400/10" }
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 flex items-center gap-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-white/60 text-sm font-semibold mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <h2 className="text-xl font-bold mb-6">Activité récente</h2>
          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-12 text-center text-white/40 font-medium">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-white/20">
                <Clock size={32} />
              </div>
              <p>Tu n'as pas encore généré de hooks vidéos récemment.</p>
              <Link href="/generator" className="text-[#6C4DFF] hover:text-[#6C4DFF]/80 mt-2 inline-block transition-colors">
                Générer mon premier hook →
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
};