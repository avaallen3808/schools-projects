'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { useAuthStore } from '../../../lib/stores/auth.store';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { useAdminCategories } from '../../../lib/hooks/use-admin-posts';

export default function AdminCategoriesPage() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  const { data: categories } = useAdminCategories();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: { name: string; slug: string }) =>
      apiClient('/cms/categories', { method: 'POST', body: data, token: token ?? undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categories'] }); setName(''); setSlug(''); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient(`/cms/categories/${id}`, { method: 'DELETE', token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });

  return (
    <section className="px-8 py-10">
      <h1 className="text-3xl mb-8">Kategori</h1>

      <div className="flex gap-3 mb-8 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text">Nama</label>
          <input value={name} onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
            className="px-4 py-2 rounded-xl text-sm border border-border outline-none focus:border-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm border border-border outline-none focus:border-primary" />
        </div>
        <button onClick={() => createMutation.mutate({ name, slug })}
          disabled={!name || !slug || createMutation.isPending}
          className="px-5 py-2 text-sm font-medium disabled:opacity-50 bg-primary text-text rounded-pill border-none cursor-pointer">
          + Tambah
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Nama', render: (c: any) => c.name },
          { key: 'slug', header: 'Slug', render: (c: any) => <code className="text-xs text-text-secondary">{c.slug}</code> },
          { key: 'count', header: 'Posts', render: (c: any) => <Badge label={String(c._count?.posts || 0)} /> },
          { key: 'actions', header: '', render: (c: any) => (
            <button onClick={() => deleteMutation.mutate(c.id)} className="text-xs underline text-error bg-transparent border-none cursor-pointer">
              Hapus
            </button>
          )},
        ]}
        data={(categories as any[]) || []}
      />
    </section>
  );
}
