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
      <h1 className="text-4xl mb-2" style={{ fontFamily: 'Prata, serif' }}>Status Pendaftaran</h1>
      <p className="mb-10" style={{ color: '#666' }}>Pantau status pendaftaran SPMB kamu</p>

      {isLoading ? (
        <p style={{ color: '#666' }}>Memuat data...</p>
      ) : regs.length === 0 ? (
        <div className="p-10 text-center" style={{ background: '#f6f4ee', borderRadius: 50 }}>
          <p className="mb-4" style={{ color: '#666' }}>Kamu belum mendaftar SPMB</p>
          <Link
            href="/spmb/apply"
            className="inline-block px-6 py-2.5 text-sm font-medium"
            style={{ background: '#fdc72f', color: '#000', borderRadius: 100, textDecoration: 'none' }}
          >
            Daftar Sekarang
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {regs.map((reg: any) => (
            <div
              key={reg.id}
              className="p-6"
              style={{ background: '#ffffff', borderRadius: 30, boxShadow: 'rgba(0,0,0,0.06) 0px 4px 30px 0px' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">{reg.offering?.branch?.name} — {reg.offering?.entryGrade?.name}</p>
                  <p className="text-xs" style={{ color: '#999' }}>
                    {reg.offering?.track?.name && `${reg.offering.track.name} · `}
                    {reg.offering?.period?.name || ''}
                  </p>
                </div>
                <Badge label={reg.status} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs" style={{ color: '#999' }}>No. Pendaftaran</p>
                  <code className="font-mono">{reg.number || '-'}</code>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#999' }}>Tanggal Daftar</p>
                  <p>{new Date(reg.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                {reg.totalScore != null && (
                  <div>
                    <p className="text-xs" style={{ color: '#999' }}>Nilai Total</p>
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
