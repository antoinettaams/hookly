'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  Search, 
  Bell, 
  Download, 
  Trash2, 
  Filter, 
  X,
  Play,
  Eye,
  Copy,
  CheckCircle2,
  Calendar,
  Grid,
  List,
  MoreVertical,
  Sparkles,
  Tag,
  ChevronDown,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FadeIn from '../components/FadeIn';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import LogoutModal from '../components/LogoutModal';
import { collection, query, where, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Types
interface Hook {
  id: string;
  title: string;
  niche: string;
  platform: 'TikTok' | 'YouTube' | 'Instagram';
  style: 'choc' | 'curiosite' | 'emotion' | 'storytelling';
  duration: string;
  thumbnail: string;
  videoUrl: string;
  createdAt: string;
  views: number;
  downloads: number;
  project?: string;
  userId: string;
}

export default function MesHooks() {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedHooks, setSelectedHooks] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [isLoadingHooks, setIsLoadingHooks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isLoading: authLoading, logout } = useAuth();

  // État des filtres
  const [filters, setFilters] = useState({
    niche: '',
    platform: '',
    style: '',
    dateRange: '',
    project: ''
  });

  // Extraire les projets uniques des hooks
  const projects = ['Tous les hooks', ...new Set(hooks.map(h => h.niche))];

  // Charger les hooks depuis Firebase
  useEffect(() => {
    const loadHooks = async () => {
      if (!user) return;
      
      setIsLoadingHooks(true);
      setError(null);
      
      try {
        // Récupérer les hooks de l'utilisateur depuis Firestore
        const hooksRef = collection(db, 'hooks');
        const q = query(
          hooksRef, 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const loadedHooks: Hook[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          loadedHooks.push({
            id: doc.id,
            title: data.title,
            niche: data.niche,
            platform: data.platform,
            style: data.style,
            duration: data.duration,
            thumbnail: data.thumbnail || '/thumbnails/default.jpg',
            videoUrl: data.videoUrl,
            createdAt: data.createdAt,
            views: data.views || 0,
            downloads: data.downloads || 0,
            project: data.niche,
            userId: data.userId
          });
        });
        
        setHooks(loadedHooks);
      } catch (err) {
        console.error('Erreur chargement hooks:', err);
        setError('Impossible de charger tes hooks. Réessaie plus tard.');
      } finally {
        setIsLoadingHooks(false);
      }
    };

    if (user) {
      loadHooks();
    }
  }, [user]);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (mobile) {
        setSidebarOpen(false);
        setIsMobileSidebarOpen(false);
        setShowFilters(false);
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

  // Filtrer les hooks
  const filteredHooks = hooks.filter(hook => {
    if (filters.niche && hook.niche !== filters.niche) return false;
    if (filters.platform && hook.platform !== filters.platform) return false;
    if (filters.style && hook.style !== filters.style) return false;
    if (filters.project && filters.project !== 'Tous les hooks' && hook.niche !== filters.project) return false;
    
    // Filtre par date
    if (filters.dateRange) {
      const hookDate = new Date(hook.createdAt);
      const today = new Date();
      
      if (filters.dateRange === 'today') {
        if (hookDate.toDateString() !== today.toDateString()) return false;
      } else if (filters.dateRange === 'week') {
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        if (hookDate < weekAgo) return false;
      } else if (filters.dateRange === 'month') {
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
        if (hookDate < monthAgo) return false;
      }
    }
    
    return true;
  });

  // Gérer la sélection
  const toggleSelect = (id: string) => {
    setSelectedHooks(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedHooks.length === filteredHooks.length) {
      setSelectedHooks([]);
    } else {
      setSelectedHooks(filteredHooks.map(h => h.id));
    }
  };

  // Gérer la suppression
  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce hook définitivement ?')) return;
    
    try {
      await deleteDoc(doc(db, 'hooks', id));
      setHooks(prev => prev.filter(h => h.id !== id));
      setSelectedHooks(prev => prev.filter(h => h !== id));
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Impossible de supprimer le hook. Réessaie plus tard.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedHooks.length === 0) return;
    if (!confirm(`Supprimer ${selectedHooks.length} hook(s) définitivement ?`)) return;
    
    try {
      // Supprimer un par un (on pourrait faire un batch pour optimiser)
      for (const id of selectedHooks) {
        await deleteDoc(doc(db, 'hooks', id));
      }
      setHooks(prev => prev.filter(h => !selectedHooks.includes(h.id)));
      setSelectedHooks([]);
    } catch (err) {
      console.error('Erreur suppression multiple:', err);
      alert('Impossible de supprimer certains hooks. Réessaie plus tard.');
    }
  };

  // Gérer la copie
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Gérer le téléchargement
  const handleDownload = async (hook: Hook) => {
    try {
      // Logique de téléchargement (à implémenter)
      console.log('Téléchargement:', hook.title);
      
      // Mettre à jour le compteur de téléchargements dans Firestore
      // await updateDoc(doc(db, 'hooks', hook.id), {
      //   downloads: hook.downloads + 1
      // });
      
    } catch (err) {
      console.error('Erreur téléchargement:', err);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      niche: '',
      platform: '',
      style: '',
      dateRange: '',
      project: ''
    });
  };

  const niches = [...new Set(hooks.map(h => h.niche))];
  const platforms = ['TikTok', 'YouTube', 'Instagram'];
  const styles = ['choc', 'curiosite', 'emotion', 'storytelling'];

  if (authLoading) {
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
                  placeholder="Rechercher un hook..."
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
                  <p className="text-sm font-semibold">{user?.name || 'Joellaams'}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{user?.plan || 'Gratuit'}</p>
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-[#6C4DFF] to-purple-600 flex items-center justify-center text-white font-bold text-sm lg:text-base overflow-hidden ring-2 ring-[#6C4DFF]/20">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    (user?.name || 'J').charAt(0).toUpperCase()
                  )}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-5 sm:p-6 lg:p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header avec titre et retour */}
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold mb-2">Mes hooks</h1>
                  <p className="text-sm lg:text-base text-[var(--text-secondary)]">
                    {filteredHooks.length} hook{filteredHooks.length > 1 ? 's' : ''} généré{filteredHooks.length > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Actions de masse */}
                {selectedHooks.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-2"
                  >
                    <span className="text-sm text-[var(--text-secondary)] px-2">
                      {selectedHooks.length} sélectionné{selectedHooks.length > 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={handleDeleteSelected}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </motion.div>
                )}
              </div>
            </FadeIn>

            {/* Barre d'outils */}
            <FadeIn delay={0.1}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Projets dynamiques */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {projects.map((project) => (
                    <button
                      key={project}
                      onClick={() => setFilters({ ...filters, project })}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all
                        ${filters.project === project 
                          ? 'bg-[#6C4DFF] text-white shadow-[0_0_15px_rgba(108,77,255,0.3)]' 
                          : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)]'
                        }
                      `}
                    >
                      {project}
                    </button>
                  ))}
                </div>

                {/* Contrôles d'affichage */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Vue grille/liste */}
                  <div className="flex items-center bg-white/5 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#6C4DFF] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                      aria-label="Vue grille"
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#6C4DFF] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                      aria-label="Vue liste"
                    >
                      <List size={18} />
                    </button>
                  </div>

                  {/* Bouton filtres */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`
                      flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all
                      ${showFilters 
                        ? 'bg-[#6C4DFF] text-white shadow-[0_0_15px_rgba(108,77,255,0.3)]' 
                        : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)]'
                      }
                    `}
                  >
                    <Filter size={16} className="shrink-0" />
                    <span className="hidden xs:inline">Filtres</span>
                    <span className="xs:hidden">Filtre</span>
                    {(filters.niche || filters.platform || filters.style || filters.dateRange) && (
                      <span className="w-2 h-2 rounded-full bg-[#6C4DFF] animate-pulse shrink-0" />
                    )}
                  </button>

                  {/* Checkbox tout sélectionner */}
                  {filteredHooks.length > 0 && (
                    <button
                      onClick={toggleSelectAll}
                      className="px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
                    >
                      {selectedHooks.length === filteredHooks.length ? (
                        <>
                          <span className="hidden xs:inline">Tout désélectionner</span>
                          <span className="xs:hidden">Désél.</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden xs:inline">Tout sélectionner</span>
                          <span className="xs:hidden">Sél.</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Panneau de filtres */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Filtres avancés</h3>
                      <button
                        onClick={resetFilters}
                        className="text-sm text-[#6C4DFF] hover:underline"
                      >
                        Réinitialiser
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Filtre niche */}
                      <div>
                        <label className="block text-xs text-[var(--text-secondary)] mb-1">Niche</label>
                        <select
                          value={filters.niche}
                          onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
                          className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                        >
                          <option value="">Toutes</option>
                          {niches.map(niche => (
                            <option key={niche} value={niche}>{niche}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filtre plateforme */}
                      <div>
                        <label className="block text-xs text-[var(--text-secondary)] mb-1">Plateforme</label>
                        <select
                          value={filters.platform}
                          onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                          className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                        >
                          <option value="">Toutes</option>
                          {platforms.map(platform => (
                            <option key={platform} value={platform}>{platform}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filtre style */}
                      <div>
                        <label className="block text-xs text-[var(--text-secondary)] mb-1">Style</label>
                        <select
                          value={filters.style}
                          onChange={(e) => setFilters({ ...filters, style: e.target.value })}
                          className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                        >
                          <option value="">Tous</option>
                          {styles.map(style => (
                            <option key={style} value={style}>{style}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filtre date */}
                      <div>
                        <label className="block text-xs text-[var(--text-secondary)] mb-1">Date</label>
                        <select
                          value={filters.dateRange}
                          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                          className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                        >
                          <option value="">Toutes</option>
                          <option value="today">Aujourd'hui</option>
                          <option value="week">Cette semaine</option>
                          <option value="month">Ce mois</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* État de chargement */}
            {isLoadingHooks && (
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-12 text-center">
                <Loader2 size={32} className="animate-spin text-[#6C4DFF] mx-auto mb-3" />
                <p className="text-[var(--text-secondary)]">Chargement de tes hooks...</p>
              </div>
            )}

            {/* Message d'erreur */}
            {error && !isLoadingHooks && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
                <p className="text-[var(--text-secondary)]">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-[#6C4DFF] hover:underline text-sm"
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* Galerie des hooks */}
            {!isLoadingHooks && !error && filteredHooks.length === 0 && (
              <FadeIn delay={0.2}>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] border-dashed rounded-2xl p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full bg-[#6C4DFF]/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={32} className="text-[#6C4DFF]" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Aucun hook pour le moment</h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                      Génère ton premier hook pour le voir apparaître ici
                    </p>
                    <Link
                      href="/generator"
                      className="inline-flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white px-6 py-3 rounded-xl font-bold transition-all"
                    >
                      <Sparkles size={18} />
                      Générer un hook
                    </Link>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Affichage des hooks */}
            {!isLoadingHooks && !error && filteredHooks.length > 0 && (
              <>
                {/* Vue Grille */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredHooks.map((hook, index) => (
                      <motion.div
                        key={hook.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          group bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden relative
                          ${selectedHooks.includes(hook.id) ? 'ring-2 ring-[#6C4DFF]' : ''}
                          hover:border-[#6C4DFF]/30 transition-all
                        `}
                        onMouseEnter={() => setHoveredVideo(hook.id)}
                        onMouseLeave={() => setHoveredVideo(null)}
                      >
                        {/* Checkbox de sélection */}
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="checkbox"
                            checked={selectedHooks.includes(hook.id)}
                            onChange={() => toggleSelect(hook.id)}
                            className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#6C4DFF] focus:ring-0"
                          />
                        </div>

                        {/* Miniature vidéo */}
                        <div className="relative aspect-video bg-black/60">
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#6C4DFF]/20 to-purple-600/20">
                            {hoveredVideo === hook.id ? (
                              <Play size={32} className="text-white/60" />
                            ) : (
                              <span className="text-2xl font-bold text-white/20">
                                {hook.niche.charAt(0)}
                              </span>
                            )}
                          </div>

                          {/* Badge plateforme */}
                          <span className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
                            {hook.platform}
                          </span>

                          {/* Badge style */}
                          <span className="absolute bottom-2 left-2 bg-[#6C4DFF] text-white text-xs px-2 py-1 rounded-md">
                            {hook.style}
                          </span>

                          {/* Durée */}
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
                            {hook.duration}
                          </span>
                        </div>

                        {/* Infos */}
                        <div className="p-3">
                          <h3 className="text-sm font-semibold mb-2 line-clamp-2 text-[var(--text-primary)]">
                            {hook.title}
                          </h3>
                          
                          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
                            <span className="flex items-center gap-1">
                              <Tag size={12} />
                              {hook.niche}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(hook.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                              <span className="flex items-center gap-0.5">
                                <Eye size={12} />
                                {hook.views}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Download size={12} />
                                {hook.downloads}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleCopy(hook.title, hook.id)}
                                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                title="Copier le hook"
                              >
                                {copiedIndex === hook.id ? (
                                  <CheckCircle2 size={14} className="text-green-500" />
                                ) : (
                                  <Copy size={14} className="text-[var(--text-secondary)]" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleDownload(hook)}
                                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[#6C4DFF]"
                                title="Télécharger"
                              >
                                <Download size={14} />
                              </button>
                              
                              <button
                                onClick={() => handleDelete(hook.id)}
                                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-red-400"
                                title="Supprimer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Vue Liste */}
                {viewMode === 'list' && (
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-black/40 border-b border-[var(--border-color)]">
                        <tr>
                          <th className="p-4 text-left">
                            <input
                              type="checkbox"
                              checked={selectedHooks.length === filteredHooks.length}
                              onChange={toggleSelectAll}
                              className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#6C4DFF]"
                            />
                          </th>
                          <th className="p-4 text-left text-xs font-semibold text-[var(--text-secondary)]">Titre</th>
                          <th className="p-4 text-left text-xs font-semibold text-[var(--text-secondary)]">Niche</th>
                          <th className="p-4 text-left text-xs font-semibold text-[var(--text-secondary)]">Plateforme</th>
                          <th className="p-4 text-left text-xs font-semibold text-[var(--text-secondary)]">Style</th>
                          <th className="p-4 text-left text-xs font-semibold text-[var(--text-secondary)]">Date</th>
                          <th className="p-4 text-left text-xs font-semibold text-[var(--text-secondary)]">Vues</th>
                          <th className="p-4 text-left text-xs font-semibold text-[var(--text-secondary)]">Téléch.</th>
                          <th className="p-4 text-left text-xs font-semibold text-[var(--text-secondary)]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHooks.map((hook) => (
                          <tr key={hook.id} className="border-b border-[var(--border-color)] hover:bg-white/5">
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedHooks.includes(hook.id)}
                                onChange={() => toggleSelect(hook.id)}
                                className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#6C4DFF]"
                              />
                            </td>
                            <td className="p-4">
                              <span className="text-sm font-medium line-clamp-1 text-[var(--text-primary)]">{hook.title}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-[var(--text-secondary)]">{hook.niche}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-[var(--text-secondary)]">{hook.platform}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-xs px-2 py-1 bg-[#6C4DFF]/10 text-[#6C4DFF] rounded-full">
                                {hook.style}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-[var(--text-secondary)]">
                                {new Date(hook.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-[var(--text-secondary)]">{hook.views}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-[var(--text-secondary)]">{hook.downloads}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleCopy(hook.title, hook.id)}
                                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                  title="Copier"
                                >
                                  {copiedIndex === hook.id ? (
                                    <CheckCircle2 size={16} className="text-green-500" />
                                  ) : (
                                    <Copy size={16} className="text-[var(--text-secondary)]" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDownload(hook)}
                                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[#6C4DFF]"
                                  title="Télécharger"
                                >
                                  <Download size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(hook.id)}
                                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-red-400"
                                  title="Supprimer"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

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