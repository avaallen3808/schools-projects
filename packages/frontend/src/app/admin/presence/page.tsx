'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { useAuthStore } from '../../../lib/stores/auth.store';
import { DataTable } from '../../../components/ui/DataTable';

export default function AdminPresencePage() {
  const token = useAuthStore((s) => s.accessToken);
  const { data: rombels } = useQuery({
    queryKey: ['admin', 'rombels'],
    queryFn: () => apiClient('/presence/rombels', { token: token ?? undefined }),
    enabled: !!token,
  });

  return (
    <section className="px-8 py-10">
      <h1 className="text-3xl mb-8" style={{ fontFamily: 'Prata, serif' }}>Presensi</h1>

      <h2 className="text-xl mb-4">Rombel</h2>
      <DataTable
        columns={[
          { key: 'name', header: 'Nama', render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: 'branch', header: 'Cabang', render: (r: any) => r.branch?.name || '-' },
          { key: 'grade', header: 'Tingkat', render: (r: any) => r.entryGrade?.name || '-' },
          { key: 'count', header: 'Rekaman', render: (r: any) => r._count?.presenceRecords || 0 },
        ]}
        data={(rombels as any[]) || []}
        emptyMessage="Belum ada rombel"
      />
    </section>
  );
}
