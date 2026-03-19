'use client';

import React, { useState } from 'react';
import { LogOut, X, AlertTriangle, Loader2 } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            {isLoading ? (
              <Loader2 size={32} className="text-red-500 animate-spin" />
            ) : (
              <AlertTriangle size={32} className="text-red-500" />
            )}
          </div>
          <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
            {isLoading ? 'Déconnexion en cours...' : 'Déconnexion'}
          </h3>
          <p className="text-[var(--text-secondary)]">
            {isLoading 
              ? 'Veuillez patienter...' 
              : 'Es-tu sûr de vouloir te déconnecter de ton compte Hookly ?'
            }
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-transparent border border-[var(--border-color)] hover:bg-white/5 text-[var(--text-primary)] px-4 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Déconnexion...</span>
              </>
            ) : (
              'Se déconnecter'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}