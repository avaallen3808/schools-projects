'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/stores/auth.store';
import { useMyRegistrations } from '../../../lib/hooks/use-spmb-apply';
import { Badge } from '../../../components/ui/Badge';
import Link from 'next/link';

export default function SpmbStatusPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);
  const { data: registrations, isLoading } = useMyRegistrations();

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  if (!token) return null;

  const regs = (registrations as any)?.data || (registrations as any[]) || [];

  return (
    <section className="px-8 py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl mb-2">Status Pendaftaran</h1>
      <p className="mb-10 text-text-secondary">Pantau status pendaftaran SPMB kamu</p>

      {isLoading ? (
        <p className="text-text-secondary">Memuat data...</p>
      ) : regs.length === 0 ? (
        <div className="p-10 text-center bg-surface rounded-card">
          <p className="mb-4 text-text-secondary">Kamu belum mendaftar SPMB</p>
          <Link
            href="/spmb/apply"
            className="inline-block px-6 py-2.5 text-sm font-medium bg-primary text-text rounded-pill"
            style={{ textDecoration: 'none' }}
          >
            Daftar Sekarang
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {regs.map((reg: any) => (
            <div
              key={reg.id}
              className="p-6 bg-bg rounded-card shadow-[0_4px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">{reg.offering?.branch?.name} — {reg.offering?.entryGrade?.name}</p>
                  <p className="text-xs text-text-secondary">
                    {reg.offering?.track?.name && `${reg.offering.track.name} · `}
                    {reg.offering?.period?.name || ''}
                  </p>
                </div>
                <Badge label={reg.status} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs text-text-secondary">No. Pendaftaran</p>
                  <code className="font-mono">{reg.number || '-'}</code>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Tanggal Daftar</p>
                  <p>{new Date(reg.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                {reg.totalScore != null && (
                  <div>
                    <p className="text-xs text-text-secondary">Nilai Total</p>
                    <p className="font-semibold">{reg.totalScore.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
