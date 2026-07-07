'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { useAuthStore } from '../../../lib/stores/auth.store';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';

export default function AdminPagesPage() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  const { data: pages } = useQuery({
    queryKey: ['admin', 'all-pages'],
    queryFn: () => apiClient('/cms/pages/.list', { token: token ?? undefined }),
    enabled: !!token,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', content: '', metaTitle: '', metaDesc: '' });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) =>
      apiClient('/cms/pages', { method: 'POST', body: { ...data, published: true }, token: token ?? undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'all-pages'] }); setIsOpen(false); setForm({ title: '', slug: '', content: '', metaTitle: '', metaDesc: '' }); },
  });

  return (
    <section className="px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Halaman</h1>
        <button onClick={() => setIsOpen(true)} className="px-5 py-2 text-sm font-medium bg-primary text-text rounded-pill border-none cursor-pointer">+ Halaman Baru</button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Judul', render: (p: any) => <span className="font-medium">{p.title}</span> },
          { key: 'slug', header: 'Slug', render: (p: any) => <code className="text-xs text-text-secondary">{p.slug}</code> },
          { key: 'published', header: 'Status', render: (p: any) => <Badge label={p.published ? 'published' : 'draft'} /> },
        ]}
        data={(pages as any[]) || []}
        emptyMessage="Belum ada halaman"
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Halaman Baru">
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="flex flex-col gap-4">
          <input placeholder="Judul" value={form.title} onChange={(e) => { const t = e.target.value; setForm({ ...form, title: t, slug: t.toLowerCase().replace(/\s+/g, '-') }); }}
            className="px-4 py-2.5 rounded-xl text-sm border border-border outline-none focus:border-primary" required />
          <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm border border-border outline-none focus:border-primary" required />
          <textarea placeholder="Konten" rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm border border-border outline-none focus:border-primary" required />
          <input placeholder="Meta Title (opsional)" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm border border-border outline-none focus:border-primary" />
          <input placeholder="Meta Description (opsional)" value={form.metaDesc} onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm border border-border outline-none focus:border-primary" />
          <button type="submit" disabled={createMutation.isPending} className="w-full py-2.5 text-sm font-medium disabled:opacity-50 bg-primary text-text rounded-pill border-none cursor-pointer">Simpan</button>
        </form>
      </Modal>
    </section>
  );
}
