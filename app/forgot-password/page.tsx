'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FadeIn from '../components/FadeIn';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    setSuccess(false);

    if (!email) {
      setLocalError('Veuillez entrer votre email');
      return;
    }

    if (!email.includes('@')) {
      setLocalError('Email invalide');
      return;
    }

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const displayError = error || localError;

  return (
    <main className="flex-1 flex items-center justify-center min-h-screen py-12 px-4 bg-[var(--bg-primary)]">
      <div className="w-full max-w-md">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Retour à la connexion</span>
        </Link>
        
        <FadeIn>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-8 shadow-[0_0_50px_rgba(108,77,255,0.1)]">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Mot de passe oublié</h1>
              <p className="text-[var(--text-secondary)]">
                Saisis ton email, on t'enverra un lien pour réinitialiser ton mot de passe.
              </p>
            </div> 
            
            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                <CheckCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-400">
                  Email envoyé ! Vérifie ta boîte de réception.
                </p>
              </div>
            )}

            {displayError && !success && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{displayError}</p>
              </div>
            )}
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com" 
                    disabled={isLoading || success}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#6C4DFF]/50 focus:ring-1 focus:ring-[#6C4DFF]/50 transition-all disabled:opacity-50"
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isLoading || success}
                className="w-full bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-[0_0_15px_rgba(108,77,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Envoi...</span>
                  </>
                ) : (
                  "Envoyer le lien"
                )}
              </button>
            </form>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}