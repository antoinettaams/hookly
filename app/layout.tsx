import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientLayout from './layout.client';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hookly - Générateur de hooks vidéo IA',
  description: 'Crée des hooks vidéo irrésistibles en quelques secondes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}