'use client';

import Link from 'next/link';
import { useAuthStore } from '../../lib/stores/auth.store';
import { useLogout } from '../../lib/hooks/use-user';

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="flex items-center justify-between px-8 py-5" style={{ background: '#ffffff', borderBottom: '1px solid #f6f4ee' }}>
      <Link href="/" className="text-xl font-semibold" style={{ color: '#07294d', fontFamily: 'Prata, serif' }}>
        CMS Sekolah
      </Link>
      <nav className="flex gap-8">
        <Link href="/" className="text-sm" style={{ color: '#4c4c4c' }}>Beranda</Link>
        <Link href="/blog" className="text-sm" style={{ color: '#4c4c4c' }}>Blog</Link>
        <Link href="/spmb" className="text-sm" style={{ color: '#4c4c4c' }}>SPMB</Link>
      </nav>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              href="/admin"
              className="text-sm px-5 py-2"
              style={{ background: '#fdc72f', color: '#000', borderRadius: 100 }}
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="text-sm"
              style={{ color: '#4c4c4c', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Keluar
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm px-5 py-2"
            style={{ background: '#fdc72f', color: '#000', borderRadius: 100 }}
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}
