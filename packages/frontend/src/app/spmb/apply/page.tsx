'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/stores/auth.store';
import { useActiveOfferings, useRegisterForOffering } from '../../../lib/hooks/use-spmb-apply';
import Link from 'next/link';

export default function SpmbApplyPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);
  const { data: offerings, isLoading } = useActiveOfferings();
  const register = useRegisterForOffering();

  const [selectedOffering, setSelectedOffering] = useState<string>('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  if (!token) return null;

  if (success) {
    return (
      <section className="flex items-center justify-center min-h-[70vh] px-6">
        <div className="w-full max-w-lg p-10 text-center bg-bg rounded-card shadow-[0_4px_30px_rgba(0,0,0,0.06)]">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl mb-4">Pendaftaran Berhasil!</h1>
          <p className="mb-6 text-text-secondary">
            Data kamu sudah terdaftar. Tim kami akan memverifikasi berkas dan menghubungi kamu.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/spmb/status"
              className="w-full py-3 text-sm font-medium text-center bg-primary text-text rounded-pill"
              style={{ textDecoration: 'none' }}
            >
              Cek Status Pendaftaran
            </Link>
            <Link
              href="/"
              className="w-full py-3 text-sm font-medium text-center bg-surface text-text rounded-pill"
              style={{ textDecoration: 'none' }}
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const handleRegister = async () => {
    if (!selectedOffering || !user) return;
    try {
      await register.mutateAsync({ userId: user.id, offeringId: selectedOffering });
      setSuccess(true);
    } catch {
      // error shown via register.error
    }
  };

  const filteredOfferings = (offerings as any[])?.filter((o: any) => o.isActive !== false) || [];

  return (
    <section className="px-8 py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl mb-2">Daftar SPMB</h1>
      <p className="mb-10 text-text-secondary">Pilih program yang tersedia untuk mendaftar</p>

      <div className="p-8 mb-8 bg-bg rounded-card shadow-[0_4px_30px_rgba(0,0,0,0.06)]">
        <h2 className="text-lg font-semibold mb-4">Identitas Kamu</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs mb-1 text-text-secondary">Nama</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs mb-1 text-text-secondary">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="p-8 bg-bg rounded-card shadow-[0_4px_30px_rgba(0,0,0,0.06)]">
        <h2 className="text-lg font-semibold mb-4">Pilih Program</h2>

        {isLoading ? (
          <p className="text-text-secondary">Memuat data...</p>
        ) : filteredOfferings.length === 0 ? (
          <div className="p-6 text-center bg-surface rounded-card">
            <p className="text-text-secondary">Belum ada program pendaftaran dibuka.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {filteredOfferings.map((o: any) => (
              <label
                key={o.id}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-colors"
                style={{
                  border: selectedOffering === o.id ? '2px solid #fdc72f' : '1px solid #f6f4ee',
                  background: selectedOffering === o.id ? '#fffdf5' : '#ffffff',
                }}
              >
                <input
                  type="radio"
                  name="offering"
                  value={o.id}
                  checked={selectedOffering === o.id}
                  onChange={(e) => setSelectedOffering(e.target.value)}
                  style={{ accentColor: '#fdc72f' }}
                />
                <div className="flex-1">
                  <p className="font-medium">{o.branch?.name} — {o.entryGrade?.name}</p>
                  <p className="text-xs text-text-secondary">
                    {o.track?.name && `${o.track.name} · `}
                    Kuota: {o.quota} siswa · {o.period?.name || ''}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}

        {register.error && (
          <p className="text-sm mb-4 text-error">{(register.error as Error).message}</p>
        )}

        <button
          onClick={handleRegister}
          disabled={!selectedOffering || register.isPending}
          className="w-full py-3 text-base font-medium disabled:opacity-50 bg-primary text-text rounded-pill border-none cursor-pointer"
        >
          {register.isPending ? 'Memproses...' : 'Daftar Sekarang'}
        </button>
      </div>
    </section>
  );
}
