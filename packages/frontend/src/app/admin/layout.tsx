'use client';

import { useAuthStore } from '../../lib/stores/auth.store';
import { useLogout } from '../../lib/hooks/use-user';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/posts', label: 'Posts', icon: '📄' },
  { href: '/admin/pages', label: 'Pages', icon: '📋' },
  { href: '/admin/categories', label: 'Kategori', icon: '📁' },
  { href: '/admin/sliders', label: 'Sliders', icon: '🖼' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/spmb', label: 'SPMB', icon: '🎓' },
  { href: '/admin/presence', label: 'Presensi', icon: '✅' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  const userName = user.name || user.email || 'User';

  return (
    <div className="flex min-h-screen" style={{ background: '#faf9f6' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.3)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ background: '#07294d', color: '#fff' }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Link href="/admin" className="text-xl font-semibold block" style={{ fontFamily: 'Prata, serif', color: '#fff' }}>
            CMS Sekolah
          </Link>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Panel Admin</p>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3 px-4 py-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
              style={{ background: '#fdc72f', color: '#07294d' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{userName}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-4 lg:px-10"
          style={{ background: '#fff', borderBottom: '1px solid #f6f4ee' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-xl"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#07294d' }}
          >
            ☰
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs underline text-text-secondary"
              style={{ textDecoration: 'none' }}
            >
              Lihat Situs
            </Link>
            <button
              onClick={logout}
              className="text-sm px-4 py-1.5"
              style={{
                background: 'none',
                border: '1px solid #f6f4ee',
                borderRadius: 100,
                cursor: 'pointer',
                color: '#4c4c4c',
              }}
            >
              Keluar
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
