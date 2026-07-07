import type { Metadata } from 'next';
import { Inter, Prata } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const prata = Prata({ subsets: ['latin'], weight: '400', variable: '--font-prata' });

export const metadata: Metadata = {
  title: 'CMS Sekolah - Sistem Manajemen Sekolah Terpadu',
  description: 'Platform manajemen sekolah terpadu untuk website publik, PPDB, presensi, dan direktori',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${prata.variable}`}>
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
