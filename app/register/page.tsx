'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FadeIn from '../components/FadeIn';
import { ArrowLeft } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Register() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validation email
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validation mot de passe
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return '⚠️ Cet email est déjà utilisé. Essaie de te connecter ou utilise un autre email.';
      case 'auth/invalid-email':
        return '❌ Format d\'email invalide. Vérifie que ton email est correct (ex: nom@domaine.com).';
      case 'auth/weak-password':
        return '🔒 Mot de passe trop faible. Utilise au moins 6 caractères.';
      case 'auth/network-request-failed':
        return '🌐 Problème de connexion. Vérifie ta connexion internet et réessaie.';
      default:
        return '😓 Une erreur inattendue est survenue. Réessaie dans quelques instants.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations avec messages personnalisés
    if (!email || !password || !confirmPassword) {
      setError('📝 Tous les champs doivent être remplis.');
      return;
    }

    if (!validateEmail(email)) {
      setError('📧 Format d\'email incorrect. Exemple: nom@domaine.com');
      return;
    }

    if (!validatePassword(password)) {
      setError('🔑 Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('❌ Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      // Création dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Création du document utilisateur dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        plan: 'free',
        hooksGenerated: 0,
        hooksRemaining: 10,
        lastHookGeneration: null,
        settings: {
          tone: 'curiosité',
          platform: 'TikTok'
        },
        displayName: email.split('@')[0], // Nom d'affichage par défaut
        createdAtReadable: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      });

      // Message de succès personnalisé
      setSuccess(`🎉 Bienvenue ${email.split('@')[0]} ! Redirection vers ton tableau de bord...`);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Erreur Firebase:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 bg-[var(--bg-primary)]">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Retour à l'accueil</span>
        </Link>

        <FadeIn>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-8 shadow-[0_0_50px_rgba(108,77,255,0.1)]">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
              <p className="text-[var(--text-secondary)]">Rejoins Hookly et commence à générer des hooks viraux 🚀</p>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Message d'erreur personnalisé */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-xl text-sm font-medium text-center animate-pulse">
                  {error}
                </div>
              )}

              {/* Message de succès */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-4 rounded-xl text-sm font-medium text-center">
                  {success}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com" 
                  className={`w-full bg-[var(--input-bg)] border ${
                    error && error.includes('Email') ? 'border-red-500/50' : 'border-[var(--border-color)]'
                  } rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#6C4DFF]/50 focus:ring-1 focus:ring-[#6C4DFF]/50 transition-all`}
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Mot de passe <span className="text-red-400">*</span>
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (min. 6 caractères)" 
                  className={`w-full bg-[var(--input-bg)] border ${
                    error && error.includes('Mot de passe') ? 'border-red-500/50' : 'border-[var(--border-color)]'
                  } rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#6C4DFF]/50 focus:ring-1 focus:ring-[#6C4DFF]/50 transition-all`}
                  disabled={loading}
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  🔒 Minimum 6 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Confirmer le mot de passe <span className="text-red-400">*</span>
                </label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  className={`w-full bg-[var(--input-bg)] border ${
                    error && error.includes('correspondent') ? 'border-red-500/50' : 'border-[var(--border-color)]'
                  } rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#6C4DFF]/50 focus:ring-1 focus:ring-[#6C4DFF]/50 transition-all`}
                  disabled={loading}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 disabled:bg-[#6C4DFF]/50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-[0_0_15px_rgba(108,77,255,0.3)] mt-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Création en cours...</span>
                  </>
                ) : (
                  <span>🚀 S'inscrire gratuitement</span>
                )}
              </button>
            </form>

            {/* Indicateur de force du mot de passe */}
            {password && !loading && (
              <div className="mt-4">
                <div className="flex gap-1 h-1">
                  <div className={`flex-1 h-full rounded-l-full ${
                    password.length >= 6 ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div className={`flex-1 h-full ${
                    password.length >= 8 ? 'bg-green-500' : 'bg-white/20'
                  }`} />
                  <div className={`flex-1 h-full rounded-r-full ${
                    password.length >= 12 ? 'bg-green-500' : 'bg-white/20'
                  }`} />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  {password.length < 6 && '🔴 Faible'}
                  {password.length >= 6 && password.length < 8 && '🟡 Moyen'}
                  {password.length >= 8 && password.length < 12 && '🟢 Fort'}
                  {password.length >= 12 && '💪 Très fort'}
                </p>
              </div>
            )}
            
            <div className="mt-8 text-center text-sm text-[var(--text-secondary)]">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-[#6C4DFF] hover:text-[#6C4DFF]/80 font-semibold transition-colors">
                Se connecter
              </Link>
            </div>

            {/* Mentions légales */}
            <p className="text-xs text-[var(--text-secondary)] text-center mt-6">
              En t'inscrivant, tu acceptes nos{' '}
              <Link href="/conditions" className="text-[var(--text-primary)] hover:text-[#6C4DFF]">
                conditions d'utilisation
              </Link>
            </p>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}