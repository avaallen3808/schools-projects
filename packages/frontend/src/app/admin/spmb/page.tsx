'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { useAuthStore } from '../../../lib/stores/auth.store';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';

export default function AdminSpmbPage() {
  const token = useAuthStore((s) => s.accessToken);
  const { data: periods } = useQuery({
    queryKey: ['admin', 'periods'],
    queryFn: () => apiClient('/spmb/periods', { token: token ?? undefined }),
    enabled: !!token,
  });
  const { data: offerings } = useQuery({
    queryKey: ['admin', 'offerings'],
    queryFn: () => apiClient('/spmb/offerings', { token: token ?? undefined }),
    enabled: !!token,
  });
  const { data: registrations } = useQuery({
    queryKey: ['admin', 'registrations'],
    queryFn: () => apiClient('/spmb/registrations', { token: token ?? undefined }),
    enabled: !!token,
  });

  const regData = (registrations as any)?.data || [];

  return (
    <section className="px-8 py-10">
      <h1 className="text-3xl mb-8" style={{ fontFamily: 'Prata, serif' }}>SPMB</h1>

      <div className="grid gap-6 mb-10 grid-cols-1 sm:grid-cols-3">
        <div className="p-6 rounded-2xl" style={{ background: '#f6f4ee' }}>
          <p className="text-sm mb-1" style={{ color: '#666' }}>Periode Aktif</p>
          <p className="text-2xl font-semibold">{(periods as any)?.length || 0}</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ background: '#f6f4ee' }}>
          <p className="text-sm mb-1" style={{ color: '#666' }}>Offering</p>
          <p className="text-2xl font-semibold">{(offerings as any)?.length || 0}</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ background: '#f6f4ee' }}>
          <p className="text-sm mb-1" style={{ color: '#666' }}>Pendaftar</p>
          <p className="text-2xl font-semibold">{regData.length}</p>
        </div>
      </div>

      <h2 className="text-xl mb-4">Pendaftar Terbaru</h2>
      <DataTable
        columns={[
          { key: 'number', header: 'Nomor', render: (r: any) => <code className="text-xs font-mono">{r.number}</code> },
          { key: 'user', header: 'Siswa', render: (r: any) => r.user?.name || '-' },
          { key: 'status', header: 'Status', render: (r: any) => <Badge label={r.status} /> },
          { key: 'date', header: 'Tanggal', render: (r: any) => new Date(r.createdAt).toLocaleDateString('id-ID') },
        ]}
        data={regData}
        emptyMessage="Belum ada pendaftar"
      />
    </section>
  );
}
