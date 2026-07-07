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
        <div className="w-full max-w-lg p-10 text-center" style={{ background: '#ffffff', borderRadius: 50, boxShadow: 'rgba(0,0,0,0.06) 0px 4px 30px 0px' }}>
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl mb-4" style={{ fontFamily: 'Prata, serif' }}>Pendaftaran Berhasil!</h1>
          <p className="mb-6" style={{ color: '#666' }}>
            Data kamu sudah terdaftar. Tim kami akan memverifikasi berkas dan menghubungi kamu.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/spmb/status"
              className="w-full py-3 text-sm font-medium text-center"
              style={{ background: '#fdc72f', color: '#000', borderRadius: 100, textDecoration: 'none' }}
            >
              Cek Status Pendaftaran
            </Link>
            <Link
              href="/"
              className="w-full py-3 text-sm font-medium text-center"
              style={{ background: '#f6f4ee', color: '#4c4c4c', borderRadius: 100, textDecoration: 'none' }}
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
      <h1 className="text-4xl mb-2" style={{ fontFamily: 'Prata, serif' }}>Daftar SPMB</h1>
      <p className="mb-10" style={{ color: '#666' }}>Pilih program yang tersedia untuk mendaftar</p>

      <div className="p-8 mb-8" style={{ background: '#ffffff', borderRadius: 50, boxShadow: 'rgba(0,0,0,0.06) 0px 4px 30px 0px' }}>
        <h2 className="text-lg font-semibold mb-4">Identitas Kamu</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs mb-1" style={{ color: '#999' }}>Nama</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: '#999' }}>Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="p-8" style={{ background: '#ffffff', borderRadius: 50, boxShadow: 'rgba(0,0,0,0.06) 0px 4px 30px 0px' }}>
        <h2 className="text-lg font-semibold mb-4">Pilih Program</h2>

        {isLoading ? (
          <p style={{ color: '#666' }}>Memuat data...</p>
        ) : filteredOfferings.length === 0 ? (
          <div className="p-6 text-center" style={{ background: '#f6f4ee', borderRadius: 30 }}>
            <p style={{ color: '#666' }}>Belum ada program pendaftaran dibuka.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {filteredOfferings.map((o: any) => (
              <label
                key={o.id}
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-colors ${selectedOffering === o.id ? '' : ''}`}
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
                  <p className="text-xs" style={{ color: '#999' }}>
                    {o.track?.name && `${o.track.name} · `}
                    Kuota: {o.quota} siswa · {o.period?.name || ''}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}

        {register.error && (
          <p className="text-sm mb-4" style={{ color: '#dc2626' }}>{(register.error as Error).message}</p>
        )}

        <button
          onClick={handleRegister}
          disabled={!selectedOffering || register.isPending}
          className="w-full py-3 text-base font-medium disabled:opacity-50"
          style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}
        >
          {register.isPending ? 'Memproses...' : 'Daftar Sekarang'}
        </button>
      </div>
    </section>
  );
}
