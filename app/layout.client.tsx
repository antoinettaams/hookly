'use client';

import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Charger la préférence au démarrage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </AuthProvider>
  );
}