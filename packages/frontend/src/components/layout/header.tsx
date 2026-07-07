'use client';

import Link from 'next/link';
import { useAuthStore } from '../../lib/stores/auth.store';
import { useLogout } from '../../lib/hooks/use-user';

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-bg border-b border-border">
      <Link href="/" className="text-xl font-heading font-semibold text-bg-secondary" style={{ textDecoration: 'none' }}>
        CMS Sekolah
      </Link>
      <nav className="flex gap-8">
        <Link href="/" className="text-sm text-text" style={{ textDecoration: 'none' }}>Beranda</Link>
        <Link href="/blog" className="text-sm text-text" style={{ textDecoration: 'none' }}>Blog</Link>
        <Link href="/spmb" className="text-sm text-text" style={{ textDecoration: 'none' }}>SPMB</Link>
      </nav>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              href="/admin"
              className="text-sm px-5 py-2 bg-primary text-text rounded-pill font-medium"
              style={{ textDecoration: 'none' }}
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="text-sm text-text bg-transparent border-none cursor-pointer"
            >
              Keluar
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm px-5 py-2 bg-primary text-text rounded-pill font-medium"
            style={{ textDecoration: 'none' }}
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}
