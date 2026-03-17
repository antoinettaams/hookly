'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FadeIn from '../components/FadeIn';
import { ArrowLeft } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // useNavigate -> useRouter dans Next.js

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    // Simulate successful signup
    router.push('/dashboard'); // navigate -> router.push
  };

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
              <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
              <p className="text-white/60">Commence à générer tes hooks vidéos viraux.</p>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-semibold text-center">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#6C4DFF]/50 focus:ring-1 focus:ring-[#6C4DFF]/50 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Mot de passe</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#6C4DFF]/50 focus:ring-1 focus:ring-[#6C4DFF]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Confirmer le mot de passe</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#6C4DFF]/50 focus:ring-1 focus:ring-[#6C4DFF]/50 transition-all"
                />
              </div>
              
              <button type="submit" className="w-full bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-[0_0_15px_rgba(108,77,255,0.3)] mt-4">
                S'inscrire
              </button>
            </form>
            
            <div className="mt-8 text-center text-sm text-white/60">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-[#6C4DFF] hover:text-[#6C4DFF]/80 font-semibold transition-colors">
                Se connecter
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
};