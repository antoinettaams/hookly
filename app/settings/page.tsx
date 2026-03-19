'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  Search, 
  Bell, 
  Camera,
  Save,
  ChevronRight,
  ChevronLeft,
  CheckCircle2, 
  AlertCircle,
  Crown,
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Lock,
  Bell as BellIcon,
  Moon,
  Settings as SettingsIcon,
  CreditCard,
  Download,
  HelpCircle,
  Trash2,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FadeIn from '../components/FadeIn';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import LogoutModal from '../components/LogoutModal';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './../lib/firebase';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { uploadToCloudinary } from './../lib/cloudinary';

interface NotificationSetting {
  email: boolean;
  push: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  danger?: boolean;
}

interface MenuSection {
  title: string;
  subtitle?: string;
  items: MenuItem[];
}

export default function Settings() {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState('profil');
  const [showMobileContent, setShowMobileContent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { user, firebaseUser, isLoading, logout, refreshUser, getRemainingHooks, getRemainingDownloads } = useAuth();

  // États des formulaires
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState<NotificationSetting>({
    email: true,
    push: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'dark',
    autoplay: true
  });

  // Charger la préférence de thème
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      setDarkMode(true);
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Fonction pour basculer le mode sombre
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

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
            bio: data.bio || '',
            avatar: data.avatar || user.avatar || ''
          });

          if (data.preferences) {
            setPreferences({
              language: data.preferences.language || 'fr',
              theme: data.preferences.theme || 'dark',
              autoplay: data.preferences.autoplay ?? true
            });
          }

          if (data.notifications) {
            setNotifications({
              email: data.notifications.email ?? true,
              push: data.notifications.push ?? true
            });
          }
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
        setShowMobileContent(false);
      } else {
        setSidebarOpen(true);
        setIsMobileSidebarOpen(false);
        setShowMobileContent(false);
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
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      console.log('URL reçue de Cloudinary:', avatarUrl);

      // Mettre à jour dans Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { avatar: avatarUrl });

      // Mettre à jour l'état local
      setProfileData({ ...profileData, avatar: avatarUrl });
      setSuccessMessage('Photo de profil mise à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Rafraîchir le contexte
      await refreshUser();
    } catch (error) {
      console.error('Erreur upload avatar:', error);
      alert('Erreur lors du téléchargement de la photo. Vérifie ta connexion et réessaie.');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  // Sauvegarder les informations du profil
  const handleSaveProfile = async () => {
    if (!user || !firebaseUser) return;
    
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        name: profileData.name,
        bio: profileData.bio,
        updatedAt: new Date().toISOString()
      });

      if (profileData.email !== firebaseUser.email) {
        await updateEmail(firebaseUser, profileData.email);
      }

      setSuccessMessage('Profil mis à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
      await refreshUser();
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder les préférences
  const handleSavePreferences = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        preferences: preferences
      });
      setSuccessMessage('Préférences mises à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur sauvegarde préférences:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder les notifications
  const handleSaveNotifications = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        notifications: notifications
      });
      setSuccessMessage('Notifications mises à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur sauvegarde notifications:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Changer le mot de passe
  const handlePasswordChange = async () => {
    if (!firebaseUser) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsSaving(true);
    try {
      const credential = EmailAuthProvider.credential(
        firebaseUser.email!,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, passwordData.newPassword);

      setSuccessMessage('Mot de passe modifié');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Erreur changement mot de passe:', error);
      if (error.code === 'auth/wrong-password') {
        alert('Mot de passe actuel incorrect');
      } else {
        alert('Erreur lors du changement de mot de passe');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Gérer la suppression du compte
  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(false);
    logout();
  };

  // Structure du menu latéral
  const menuSections: MenuSection[] = [
    {
      title: user?.name || 'Utilisateur',
      subtitle: user?.email || '',
      items: [
        { id: 'profil', label: 'Profil', icon: User },
        { id: 'motdepasse', label: 'Mot de passe', icon: Key },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'mode', label: 'Mode sombre', icon: Moon }
      ]
    },
    {
      title: 'Autres paramètres',
      items: [
        { id: 'preferences', label: 'Préférences', icon: SettingsIcon },
        { id: 'facturation', label: 'Facturation', icon: CreditCard },
        { id: 'donnees', label: 'Données', icon: Download }
      ]
    },
    {
      title: 'À propos',
      items: [
        { id: 'aide', label: 'Aide', icon: HelpCircle }
      ]
    },
    {
      title: '',
      items: [
        { id: 'desactiver', label: 'Désactiver mon compte', icon: Trash2, danger: true }
      ]
    }
  ];

  // Données utilisateur pour l'affichage
  const displayUser = {
    name: user?.name || 'Utilisateur',
    plan: user?.plan || 'Gratuit',
    remainingHooks: getRemainingHooks(),
    remainingDownloads: getRemainingDownloads(),
    avatar: user?.avatar || null
  };

  // Fonction pour obtenir le titre du menu actif
  const getActiveMenuTitle = () => {
    for (const section of menuSections) {
      const item = section.items.find(item => item.id === activeMenu);
      if (item) return item.label;
    }
    return 'Paramètres';
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
                aria-label="Menu"
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

              <Link 
                href="/profile" 
                className="flex items-center gap-2 pl-1 sm:pl-2 lg:pl-2 border-l border-[var(--border-color)] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-semibold">{displayUser.name}</p>
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-[#6C4DFF] to-purple-600 flex items-center justify-center text-white font-bold text-sm lg:text-base overflow-hidden ring-2 ring-[#6C4DFF]/20">
                  {displayUser.avatar ? (
                    <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover" />
                  ) : (
                    displayUser.name.charAt(0).toUpperCase()
                  )}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header avec titre et retour */}
            <FadeIn>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {isMobile && showMobileContent ? (
                    <button
                      onClick={() => setShowMobileContent(false)}
                      className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <ChevronLeft size={20} />
                      <h1 className="text-xl font-bold">{getActiveMenuTitle()}</h1>
                    </button>
                  ) : (
                    <h1 className="text-2xl font-bold">Paramètres</h1>
                  )}
                </div>

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

            {/* Layout à 2 colonnes */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Menu latéral gauche */}
              <FadeIn 
                delay={0.1} 
                className={`
                  md:w-80 shrink-0
                  ${isMobile && showMobileContent ? 'hidden' : 'block'}
                `}
              >
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
                  {menuSections.map((section, idx) => (
                    <div key={idx} className={idx > 0 ? 'border-t border-[var(--border-color)]' : ''}>
                      {section.title && (
                        <div className="px-4 py-3">
                          <h2 className="text-sm font-semibold text-[var(--text-secondary)]">{section.title}</h2>
                          {section.subtitle && (
                            <p className="text-xs text-[var(--text-secondary)] mt-1">{section.subtitle}</p>
                          )}
                        </div>
                      )}
                      <div className="px-2 pb-2">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeMenu === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (item.id === 'desactiver') {
                                  setShowDeleteConfirm(true);
                                } else {
                                  setActiveMenu(item.id);
                                  if (isMobile) {
                                    setShowMobileContent(true);
                                  }
                                }
                              }}
                              className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                                ${item.danger 
                                  ? 'text-red-400 hover:bg-red-500/10' 
                                  : isActive
                                    ? 'bg-[#6C4DFF]/10 text-[#6C4DFF]'
                                    : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                                }
                              `}
                            >
                              <Icon size={18} />
                              <span className="flex-1 text-left">{item.label}</span>
                              <ChevronRight size={16} className={isActive ? 'text-[#6C4DFF]' : 'text-[var(--text-secondary)]'} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Contenu droit */}
              <FadeIn 
                delay={0.2} 
                className={`
                  flex-1
                  ${isMobile && !showMobileContent ? 'hidden' : 'block'}
                `}
              >
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6">
                  {/* Profil */}
                  {activeMenu === 'profil' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold mb-6">Profil</h2>
                      
                      {/* Avatar avec upload Cloudinary */}
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#6C4DFF] to-purple-600 flex items-center justify-center text-white font-bold text-2xl lg:text-3xl overflow-hidden">
                            {profileData.avatar ? (
                              <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                            ) : (
                              profileData.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#6C4DFF] rounded-full flex items-center justify-center hover:bg-[#6C4DFF]/90 transition-colors border-2 border-[var(--bg-secondary)] cursor-pointer">
                            {uploadingAvatar ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Camera size={14} />
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleAvatarUpload} 
                              className="hidden" 
                              disabled={uploadingAvatar}
                            />
                          </label>
                        </div>
                        <div>
                          <p className="text-sm text-[var(--text-secondary)] mb-1">Photo de profil</p>
                          <p className="text-xs text-[var(--text-secondary)]">JPG, PNG • Max 2MB</p>
                        </div>
                      </div>

                      {/* Formulaire */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Nom complet</label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Email</label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Bio</label>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            rows={3}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] resize-none"
                            placeholder="Parle-nous un peu de toi..."
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
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
                    </motion.div>
                  )}

                  {/* Mot de passe */}
                  {activeMenu === 'motdepasse' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold mb-6">Changer le mot de passe</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Mot de passe actuel</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] pr-10"
                            />
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Nouveau mot de passe</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] pr-10"
                            />
                            <button
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">Minimum 6 caractères</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Confirmer le mot de passe</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)]"
                          />
                        </div>

                        <button
                          onClick={handlePasswordChange}
                          disabled={isSaving}
                          className="bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Mise à jour...
                            </>
                          ) : (
                            'Mettre à jour'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Notifications */}
                  {activeMenu === 'notifications' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold mb-6">Notifications</h2>
                      
                      <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
                            <div>
                              <p className="font-semibold">
                                {key === 'email' && 'Notifications par email'}
                                {key === 'push' && 'Notifications push'}
                              </p>
                              <p className="text-xs text-[var(--text-secondary)]">
                                {key === 'email' && 'Recevoir les emails importants'}
                                {key === 'push' && 'Notifications dans le navigateur'}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={() => setNotifications({ ...notifications, [key]: !value })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#6C4DFF] transition-colors"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveNotifications}
                          disabled={isSaving}
                          className="flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
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
                    </motion.div>
                  )}

                  {/* Mode sombre */}
                  {activeMenu === 'mode' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold mb-6">Mode sombre</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-semibold">Mode sombre</p>
                            <p className="text-xs text-[var(--text-secondary)]">Basculer entre le mode sombre et clair</p>
                          </div>
                          <button
                            onClick={toggleDarkMode}
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                              ${darkMode ? 'bg-[#6C4DFF]' : 'bg-[var(--border-color)]'}
                            `}
                          >
                            <span
                              className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${darkMode ? 'translate-x-6' : 'translate-x-1'}
                              `}
                            />
                          </button>
                        </div>
                        
                        <p className="text-xs text-[var(--text-secondary)] pt-2">
                          Actuellement : <span className="font-semibold">{darkMode ? 'Mode sombre' : 'Mode clair'}</span>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Préférences */}
                  {activeMenu === 'preferences' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold mb-6">Préférences</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Langue</label>
                          <select
                            value={preferences.language}
                            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)]"
                          >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
                          <div>
                            <p className="font-semibold">Lecture automatique</p>
                            <p className="text-xs text-[var(--text-secondary)]">Lancer les vidéos automatiquement</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.autoplay}
                              onChange={() => setPreferences({ ...preferences, autoplay: !preferences.autoplay })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#6C4DFF] transition-colors"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleSavePreferences}
                          disabled={isSaving}
                          className="flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
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
                    </motion.div>
                  )}

                  {/* Facturation */}
                  {activeMenu === 'facturation' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold mb-6">Facturation</h2>
    
                      <div className="bg-gradient-to-br from-[#6C4DFF]/20 to-transparent border border-[#6C4DFF]/20 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Crown size={24} className="text-[#6C4DFF]" />
                          <div>
                            <p className="text-sm text-[var(--text-secondary)]">Plan actuel</p>
                            <p className="text-2xl font-bold">{displayUser.plan}</p>
                          </div>
                        </div>
      
                        {displayUser.plan === 'Gratuit' ? (
                          <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
                          >
                            <Sparkles size={16} />
                            Passer en Pro
                          </Link>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-sm text-[var(--text-secondary)]">Prochain renouvellement : 15/02/2024</p>
                            <Link
                              href="/pricing"
                              className="inline-flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
                            >
                              Gérer mon abonnement
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="bg-white/5 rounded-xl p-4">
                        <h3 className="font-semibold mb-3">Utilisation aujourd'hui</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Hooks générés</span>
                            <span className="font-bold text-[#6C4DFF]">{user?.usage.hooksGeneratedToday || 0}/{user?.plan === 'Pro' ? '30' : '3'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Téléchargements</span>
                            <span className="font-bold text-[#6C4DFF]">{user?.usage.downloadsToday || 0}/{user?.plan === 'Pro' ? 'Illimité' : '1'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Données */}
                  {activeMenu === 'donnees' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold mb-6">Données</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
                          <div>
                            <p className="font-semibold">Exporter mes données</p>
                            <p className="text-xs text-[var(--text-secondary)]">Télécharger toutes vos données</p>
                          </div>
                          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                            <Download size={16} />
                            Exporter
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Aide */}
                  {activeMenu === 'aide' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold mb-6">Aide</h2>
                      
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4">
                          <h3 className="font-semibold mb-2">Comment générer un hook ?</h3>
                          <p className="text-sm text-[var(--text-secondary)]">
                            Rendez-vous sur la page Générateur, remplissez les champs et cliquez sur "Générer".
                          </p>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl p-4">
                          <h3 className="font-semibold mb-2">Combien de hooks puis-je générer ?</h3>
                          <p className="text-sm text-[var(--text-secondary)]">
                            Gratuit : 3 hooks/jour • Pro : 30 hooks/jour
                          </p>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl p-4">
                          <h3 className="font-semibold mb-2">Comment passer en Pro ?</h3>
                          <p className="text-sm text-[var(--text-secondary)]">
                            Allez dans l'onglet Facturation et cliquez sur "Gérer mon abonnement".
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de confirmation suppression */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-center mb-2">Désactiver le compte ?</h3>
              <p className="text-[var(--text-secondary)] text-center mb-6">
                Cette action est irréversible. Toutes vos données seront supprimées.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-[var(--text-primary)] py-3 rounded-xl font-semibold transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
                >
                  Désactiver
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={async () => {
          try {
            await logout();
          } catch (error) {
            console.error('Erreur:', error);
            setLogoutModalOpen(false);
          }
        }}
      />
    </div>
  );
}