'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  Search, 
  Bell, 
  Camera,
  Mail,
  User,
  LogOut,
  ArrowLeft,
  Save,
  Key,
  Moon,
  Bell as BellIcon,
  Loader2,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FadeIn from '../components/FadeIn';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import LogoutModal from '../components/LogoutModal';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { uploadToCloudinary } from '../lib/cloudinary';
import { updateEmail } from 'firebase/auth';

export default function Profile() {
  const router = useRouter();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  
  const { user, firebaseUser, isLoading, logout, refreshUser, getRemainingHooks, getRemainingDownloads } = useAuth();

  // Données du profil
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  // Charger les données utilisateur depuis Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (!user || !firebaseUser) return;
      
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setProfileData({
            name: data.name || user.name || '',
            email: data.email || firebaseUser.email || '',
            avatar: data.avatar || user.avatar || ''
          });
        }
      } catch (error) {
        console.error('Erreur chargement données:', error);
      }
    };

    loadUserData();
  }, [user, firebaseUser]);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (mobile) {
        setSidebarOpen(false);
        setIsMobileSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setIsMobileSidebarOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Gérer le clic sur le menu burger
  const handleMenuClick = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Upload d'avatar vers Cloudinary
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !firebaseUser) return;

    // Validation
    if (file.size > 2 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 2MB');
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Le fichier doit être une image');
      e.target.value = '';
      return;
    }

    setUploadingAvatar(true);
    
    try {
      // Upload vers Cloudinary
      const avatarUrl = await uploadToCloudinary(file);

      // Mettre à jour dans Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { avatar: avatarUrl });

      // Mettre à jour l'état local
      setProfileData({ ...profileData, avatar: avatarUrl });
      setSuccessMessage('Photo mise à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Rafraîchir le contexte
      await refreshUser();
    } catch (error) {
      console.error('Erreur upload avatar:', error);
      alert('Erreur lors du téléchargement de la photo');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  // Sauvegarder les informations du profil
  const handleSave = async () => {
    if (!user || !firebaseUser) return;
    
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Mettre à jour dans Firestore
      await updateDoc(userRef, {
        name: profileData.name,
        updatedAt: new Date().toISOString()
      });

      // Si l'email a changé, mettre à jour dans Firebase Auth
      if (profileData.email !== firebaseUser.email) {
        await updateEmail(firebaseUser, profileData.email);
      }

      setSuccessMessage('Profil mis à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsEditing(false);
      await refreshUser();
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Données utilisateur pour l'affichage
  const displayUser = {
    name: user?.name || 'Utilisateur',
    plan: user?.plan || 'Gratuit',
    remainingHooks: getRemainingHooks(),
    remainingDownloads: getRemainingDownloads(),
    avatar: user?.avatar || null
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C4DFF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex">
      <Sidebar 
        isOpen={sidebarOpen}
        isMobileOpen={isMobileSidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onLogout={() => setLogoutModalOpen(true)}
      />

      <main className={`
        flex-1 transition-all duration-300
        ${sidebarOpen && !isMobile ? 'ml-64' : ''}
        ${!sidebarOpen && !isMobile ? 'ml-20' : ''}
        w-full
      `}>
        {/* Header */}
        <header className="h-16 lg:h-20 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-40">
          <div className="h-full px-3 sm:px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <button
                onClick={handleMenuClick}
                className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Menu size={20} className="text-[var(--text-secondary)]" />
              </button>

              <div className="relative flex-1 max-w-[180px] sm:max-w-[250px] md:max-w-sm lg:max-w-md">
                <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg lg:rounded-xl pl-8 pr-3 py-2 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#6C4DFF]/50 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Bell size={18} className="text-[var(--text-secondary)]" />
              </button>
              
              <div className="flex items-center gap-2 pl-1 sm:pl-2 lg:pl-2 border-l border-[var(--border-color)]">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-semibold">{displayUser.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{displayUser.plan}</p>
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-[#6C4DFF] to-purple-600 flex items-center justify-center text-white font-bold text-sm lg:text-base overflow-hidden ring-2 ring-[#6C4DFF]/20">
                  {displayUser.avatar ? (
                    <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover" />
                  ) : (
                    displayUser.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header avec retour */}
            <FadeIn>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                  >
                    <ArrowLeft size={20} className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                  </button>
                  <h1 className="text-2xl font-bold">Mon profil</h1>
                </div>

                {/* Message de succès */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg"
                    >
                      <CheckCircle2 size={18} />
                      <span className="text-sm font-semibold">{successMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>

            {/* Carte de profil */}
            <FadeIn delay={0.1}>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
                {/* Avatar et bouton modifier */}
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    {/* Avatar avec upload */}
                    <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6C4DFF] to-purple-600 flex items-center justify-center text-white font-bold text-3xl overflow-hidden ring-4 ring-[#6C4DFF]/20">
                        {profileData.avatar ? (
                          <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                        ) : (
                          profileData.name.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#6C4DFF] rounded-full flex items-center justify-center hover:bg-[#6C4DFF]/90 transition-colors border-2 border-[var(--bg-secondary)] cursor-pointer">
                          {uploadingAvatar ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Camera size={14} />
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAvatarChange} 
                            className="hidden" 
                            disabled={uploadingAvatar}
                          />
                        </label>
                      )}
                    </div>

                    {/* Badge du plan */}
                    <div className="flex items-center gap-1 bg-[#6C4DFF]/10 text-[#6C4DFF] px-3 py-1 rounded-full text-xs font-semibold mb-4">
                      <Crown size={12} />
                      <span>Plan {displayUser.plan}</span>
                    </div>

                    {/* Bouton modifier */}
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-white/5 hover:bg-white/10 text-[var(--text-primary)] px-4 py-2 rounded-lg text-sm font-semibold transition-all mb-4"
                      >
                        Modifier le profil
                      </button>
                    )}

                    {/* Mode édition ou visualisation */}
                    {isEditing ? (
                      // Formulaire d'édition
                      <div className="w-full space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Nom complet</label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)]"
                            placeholder="Votre nom"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Email</label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)]"
                            placeholder="votre@email.com"
                          />
                        </div>

                        {/* Limites selon le plan */}
                        <div className="bg-white/5 rounded-lg p-3 text-sm">
                          <p className="text-[var(--text-secondary)] mb-1">Tes limites aujourd'hui :</p>
                          <div className="flex justify-between">
                            <span className="text-[var(--text-primary)]">Hooks : <span className="text-[#6C4DFF] font-bold">{displayUser.remainingHooks}</span> restants</span>
                            <span className="text-[var(--text-primary)]">Téléchargements : <span className="text-[#6C4DFF] font-bold">{displayUser.remainingDownloads}</span> restants</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              // Recharger les données originales
                              setProfileData({
                                name: user?.name || '',
                                email: firebaseUser?.email || '',
                                avatar: user?.avatar || ''
                              });
                            }}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-[var(--text-primary)] py-3 rounded-xl font-semibold transition-all"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Sauvegarde...
                              </>
                            ) : (
                              <>
                                <Save size={16} />
                                Enregistrer
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Informations du profil
                      <div className="w-full space-y-4">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold mb-1">{profileData.name || 'Utilisateur'}</h2>
                          <p className="text-[var(--text-secondary)]">{profileData.email}</p>
                        </div>

                        {/* Liens rapides vers les paramètres importants */}
                        <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
                          <Link
                            href="/settings"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                          >
                            <Key size={18} className="text-[var(--text-secondary)]" />
                            <span className="flex-1 text-left text-[var(--text-primary)]">Changer le mot de passe</span>
                            <span className="text-xs text-[#6C4DFF]">→</span>
                          </Link>

                          <Link
                            href="/settings"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                          >
                            <BellIcon size={18} className="text-[var(--text-secondary)]" />
                            <span className="flex-1 text-left text-[var(--text-primary)]">Notifications</span>
                            <span className="text-xs text-[#6C4DFF]">→</span>
                          </Link>

                          <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors w-full"
                          >
                            <Moon size={18} className="text-[var(--text-secondary)]" />
                            <span className="flex-1 text-left text-[var(--text-primary)]">Mode sombre</span>
                            <span className="text-xs text-[var(--text-secondary)]">{darkMode ? 'Activé' : 'Désactivé'}</span>
                          </button>
                        </div>

                        {/* Bouton déconnexion */}
                        <button
                          onClick={() => setLogoutModalOpen(true)}
                          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl font-semibold transition-all mt-4"
                        >
                          <LogOut size={16} />
                          Se déconnecter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={async () => {
          await logout();
          setLogoutModalOpen(false);
        }}
      />
    </div>
  );
}