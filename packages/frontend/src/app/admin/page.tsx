'use client';

import { useUser } from '../../lib/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <section className="px-8 py-16 text-center">
        <p style={{ color: '#666' }}>Memuat...</p>
      </section>
    );
  }

  if (!user) return null;

  return (
    <section className="px-8 py-16">
      <h1 className="text-4xl mb-2">Dashboard Admin</h1>
      <p className="mb-8" style={{ color: '#666' }}>Selamat datang, {user.name} ({user.role})</p>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <a href="/admin/users" className="p-6 block" style={{ background: '#f6f4ee', borderRadius: 20, color: '#07294d', textDecoration: 'none' }}>
          <h3 className="text-lg font-semibold mb-2">Users</h3>
          <p className="text-sm" style={{ color: '#666' }}>Kelola pengguna sistem</p>
        </a>
        <a href="/admin/posts" className="p-6 block" style={{ background: '#f6f4ee', borderRadius: 20, color: '#07294d', textDecoration: 'none' }}>
          <h3 className="text-lg font-semibold mb-2">Posts</h3>
          <p className="text-sm" style={{ color: '#666' }}>Kelola artikel & blog</p>
        </a>
        <a href="/admin/pages" className="p-6 block" style={{ background: '#f6f4ee', borderRadius: 20, color: '#07294d', textDecoration: 'none' }}>
          <h3 className="text-lg font-semibold mb-2">Pages</h3>
          <p className="text-sm" style={{ color: '#666' }}>Kelola halaman statis</p>
        </a>
        <a href="/admin/sliders" className="p-6 block" style={{ background: '#f6f4ee', borderRadius: 20, color: '#07294d', textDecoration: 'none' }}>
          <h3 className="text-lg font-semibold mb-2">Sliders</h3>
          <p className="text-sm" style={{ color: '#666' }}>Kelola banner homepage</p>
        </a>
        <a href="/admin/spmb" className="p-6 block" style={{ background: '#f6f4ee', borderRadius: 20, color: '#07294d', textDecoration: 'none' }}>
          <h3 className="text-lg font-semibold mb-2">SPMB</h3>
          <p className="text-sm" style={{ color: '#666' }}>Kelola pendaftaran siswa baru</p>
        </a>
        <a href="/admin/presence" className="p-6 block" style={{ background: '#f6f4ee', borderRadius: 20, color: '#07294d', textDecoration: 'none' }}>
          <h3 className="text-lg font-semibold mb-2">Presensi</h3>
          <p className="text-sm" style={{ color: '#666' }}>Kelola kehadiran siswa</p>
        </a>
      </div>
    </section>
  );
}
