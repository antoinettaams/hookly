'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';

// Types de plans
export type PlanType = 'Gratuit' | 'Pro';

// Interface pour les limites du plan
export interface PlanLimits {
  hooksPerDay: number;
  downloadsPerDay: number;
  downloadsPerMonth: number;
  styles: string[];
  hasVariants: boolean;
  videoQuality: 'standard' | 'haute';
  hasWatermark: boolean;
  speed: 'normale' | 'rapide';
}

// Définition des limites pour chaque plan
export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  Gratuit: {
    hooksPerDay: 3,
    downloadsPerDay: 1,
    downloadsPerMonth: 30,
    styles: ['choc', 'curiosite'],
    hasVariants: false,
    videoQuality: 'standard',
    hasWatermark: true,
    speed: 'normale'
  },
  Pro: {
    hooksPerDay: 30,
    downloadsPerDay: 0,
    downloadsPerMonth: 50,
    styles: ['choc', 'curiosite', 'emotion', 'storytelling', 'humour'],
    hasVariants: true,
    videoQuality: 'haute',
    hasWatermark: false,
    speed: 'rapide'
  }
};

// Interface pour les statistiques d'utilisation
export interface UserUsage {
  hooksGeneratedToday: number;
  downloadsToday: number;
  downloadsThisMonth: number;
  lastResetDate: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  plan: PlanType;
  avatar?: string;
  createdAt?: string;
  usage: UserUsage;
  stripeCustomerId?: string;
  subscriptionId?: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  getPlanLimits: () => PlanLimits;
  canGenerateHook: () => boolean;
  canDownloadVideo: () => boolean;
  getRemainingHooks: () => number;
  getRemainingDownloads: () => number;
  incrementHooksGenerated: () => Promise<void>;
  incrementDownloads: () => Promise<void>;
  resetDailyUsage: () => Promise<void>;
  upgradeToPro: (stripeCustomerId: string, subscriptionId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fonction pour extraire un nom depuis l'email
const extractNameFromEmail = (email: string): string => {
  if (!email) return 'Utilisateur';
  
  let name = email.split('@')[0];
  name = name.replace(/[._-]/g, ' ');
  name = name.replace(/[0-9]/g, '');
  
  if (!name || name.trim().length === 0) {
    return 'Utilisateur';
  }
  
  name = name.split(' ').map(word => {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return '';
  }).join(' ').trim();
  
  return name;
};

// Fonction pour initialiser l'usage utilisateur
const initializeUsage = (): UserUsage => {
  const today = new Date().toISOString().split('T')[0];
  return {
    hooksGeneratedToday: 0,
    downloadsToday: 0,
    downloadsThisMonth: 0,
    lastResetDate: today
  };
};

// Vérifier si le jour a changé pour réinitialiser les compteurs
const checkAndResetDailyUsage = (usage: UserUsage): UserUsage => {
  const today = new Date().toISOString().split('T')[0];
  if (usage.lastResetDate !== today) {
    return {
      ...usage,
      hooksGeneratedToday: 0,
      downloadsToday: 0,
      lastResetDate: today
    };
  }
  return usage;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const userName = userData.name || extractNameFromEmail(firebaseUser.email || '');
        
        // Initialiser ou vérifier l'usage quotidien
        let usage: UserUsage = userData.usage || initializeUsage();
        usage = checkAndResetDailyUsage(usage);
        
        // Mettre à jour l'usage si nécessaire
        if (JSON.stringify(usage) !== JSON.stringify(userData.usage)) {
          await updateDoc(userRef, { usage });
        }
        
        setUser({
          uid: firebaseUser.uid,
          name: userName,
          email: firebaseUser.email || '',
          plan: userData.plan || 'Gratuit',
          avatar: firebaseUser.photoURL || userData.avatar,
          createdAt: userData.createdAt,
          usage,
          stripeCustomerId: userData.stripeCustomerId,
          subscriptionId: userData.subscriptionId
        });

        await updateDoc(userRef, { 
          lastLogin: new Date().toISOString(),
          ...(!userData.name && { name: userName })
        });
        
      } else {
        // Nouvel utilisateur
        const userName = extractNameFromEmail(firebaseUser.email || '');
        const usage = initializeUsage();
        
        const newUser = {
          name: userName,
          email: firebaseUser.email || '',
          plan: 'Gratuit' as const,
          avatar: firebaseUser.photoURL || null,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          usage
        };

        await setDoc(userRef, newUser);
        
        setUser({
          uid: firebaseUser.uid,
          ...newUser,
          avatar: newUser.avatar || undefined,
          usage
        });
      }
    } catch (err) {
      console.error('Erreur Firestore:', err);
      setError('Erreur de chargement des données');
      
      if (firebaseUser) {
        const usage = initializeUsage();
        setUser({
          uid: firebaseUser.uid,
          name: extractNameFromEmail(firebaseUser.email || ''),
          email: firebaseUser.email || '',
          plan: 'Gratuit',
          avatar: firebaseUser.photoURL || undefined,
          usage
        });
      }
    }
  };

  // Récupérer les limites du plan actuel
  const getPlanLimits = (): PlanLimits => {
    if (!user) return PLAN_LIMITS.Gratuit;
    return PLAN_LIMITS[user.plan];
  };

  // Vérifier si l'utilisateur peut générer un hook
  const canGenerateHook = (): boolean => {
    if (!user) return false;
    if (user.plan === 'Pro') return true;
    
    const limits = PLAN_LIMITS.Gratuit;
    return user.usage.hooksGeneratedToday < limits.hooksPerDay;
  };

  // Vérifier si l'utilisateur peut télécharger une vidéo
  const canDownloadVideo = (): boolean => {
    if (!user) return false;
    
    if (user.plan === 'Pro') {
      const limits = PLAN_LIMITS.Pro;
      return user.usage.downloadsThisMonth < limits.downloadsPerMonth;
    }
    
    const limits = PLAN_LIMITS.Gratuit;
    return user.usage.downloadsToday < limits.downloadsPerDay;
  };

  // Hooks restants aujourd'hui
  const getRemainingHooks = (): number => {
    if (!user) return 0;
    
    if (user.plan === 'Pro') {
      const limits = PLAN_LIMITS.Pro;
      return Math.max(0, limits.hooksPerDay - user.usage.hooksGeneratedToday);
    }
    
    const limits = PLAN_LIMITS.Gratuit;
    return Math.max(0, limits.hooksPerDay - user.usage.hooksGeneratedToday);
  };

  // Téléchargements restants
  const getRemainingDownloads = (): number => {
    if (!user) return 0;
    
    if (user.plan === 'Pro') {
      const limits = PLAN_LIMITS.Pro;
      return Math.max(0, limits.downloadsPerMonth - user.usage.downloadsThisMonth);
    }
    
    const limits = PLAN_LIMITS.Gratuit;
    return Math.max(0, limits.downloadsPerDay - user.usage.downloadsToday);
  };

  // Incrémenter le compteur de hooks générés
  const incrementHooksGenerated = async (): Promise<void> => {
    if (!user || !firebaseUser) return;
    
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const newUsage: UserUsage = {
        ...user.usage,
        hooksGeneratedToday: user.usage.hooksGeneratedToday + 1
      };
      
      await updateDoc(userRef, { usage: newUsage });
      setUser({ ...user, usage: newUsage });
    } catch (err) {
      console.error('Erreur mise à jour usage:', err);
    }
  };

  // Incrémenter le compteur de téléchargements
  const incrementDownloads = async (): Promise<void> => {
    if (!user || !firebaseUser) return;
    
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const newUsage: UserUsage = {
        ...user.usage,
        downloadsToday: user.usage.downloadsToday + 1,
        downloadsThisMonth: user.usage.downloadsThisMonth + 1
      };
      
      await updateDoc(userRef, { usage: newUsage });
      setUser({ ...user, usage: newUsage });
    } catch (err) {
      console.error('Erreur mise à jour usage:', err);
    }
  };

  // Réinitialiser l'usage quotidien
  const resetDailyUsage = async (): Promise<void> => {
    if (!user || !firebaseUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newUsage: UserUsage = {
      ...user.usage,
      hooksGeneratedToday: 0,
      downloadsToday: 0,
      lastResetDate: today
    };
    
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, { usage: newUsage });
      setUser({ ...user, usage: newUsage });
    } catch (err) {
      console.error('Erreur reset usage:', err);
    }
  };

  // Passer en Pro
  const upgradeToPro = async (stripeCustomerId: string, subscriptionId: string): Promise<void> => {
    if (!user || !firebaseUser) return;
    
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const updates = {
        plan: 'Pro' as const,
        stripeCustomerId,
        subscriptionId,
        upgradedAt: new Date().toISOString()
      };
      
      await updateDoc(userRef, updates);
      setUser({ ...user, ...updates });
    } catch (err) {
      console.error('Erreur upgrade:', err);
      throw err;
    }
  };

  // Connexion
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erreur connexion:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec cet email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Trop de tentatives. Réessayez plus tard');
      } else {
        setError('Erreur de connexion. Vérifiez vos identifiants');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Inscription
  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erreur inscription:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé');
      } else if (err.code === 'auth/weak-password') {
        setError('Le mot de passe doit contenir au moins 6 caractères');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else {
        setError("Erreur lors de l'inscription");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.error('Erreur déconnexion:', err);
      setError('Erreur lors de la déconnexion');
    }
  };

  // Réinitialisation mot de passe
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error('Erreur reset password:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec cet email');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else {
        setError("Erreur lors de l'envoi de l'email");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Rafraîchir les données utilisateur
  const refreshUser = async () => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser);
    }
  };

  // Effacer l'erreur
  const clearError = () => {
    setError(null);
  };

  // Vérifier et réinitialiser l'usage quotidien au démarrage
  useEffect(() => {
    if (user?.usage) {
      const today = new Date().toISOString().split('T')[0];
      if (user.usage.lastResetDate !== today) {
        resetDailyUsage();
      }
    }
  }, [user?.usage?.lastResetDate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setError(null);
      
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        await fetchUserData(firebaseUser);
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser, 
      isLoading, 
      error,
      login,
      register,
      logout,
      resetPassword,
      refreshUser,
      clearError,
      getPlanLimits,
      canGenerateHook,
      canDownloadVideo,
      getRemainingHooks,
      getRemainingDownloads,
      incrementHooksGenerated,
      incrementDownloads,
      resetDailyUsage,
      upgradeToPro
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}