import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hookly - Générateur de hooks vidéos IA',
  description: 'Crée des hooks vidéos viraux en quelques secondes avec l\'IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-[#0A0A0A] text-white font-sans selection:bg-[#6C4DFF] selection:text-white overflow-x-hidden">
        <Navbar />
        {children}  {/* C'est ici que le contenu de page.tsx sera injecté */}
        <Footer />
      </body>
    </html>
  );
}