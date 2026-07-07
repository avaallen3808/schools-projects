'use client';

import { useState } from 'react';
import { useAdminPosts, useAdminCreatePost, useAdminDeletePost, useAdminCategories } from '../../../lib/hooks/use-admin-posts';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';

export default function AdminPostsPage() {
  const { data: postsData } = useAdminPosts();
  const { data: categories } = useAdminCategories();
  const createMutation = useAdminCreatePost();
  const deleteMutation = useAdminDeletePost();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', content: '', excerpt: '', categoryId: '', published: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form, { onSuccess: () => { setIsOpen(false); setForm({ title: '', slug: '', content: '', excerpt: '', categoryId: '', published: false }); } });
  };

  return (
    <section className="px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl" style={{ fontFamily: 'Prata, serif' }}>Posts</h1>
        <button onClick={() => setIsOpen(true)} className="px-5 py-2 text-sm font-medium"
          style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}>+ Tambah Post</button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Judul', render: (p: any) => <span className="font-medium">{p.title}</span> },
          { key: 'category', header: 'Kategori', render: (p: any) => p.category?.name || <span className="text-xs" style={{ color: '#999' }}>-</span> },
          { key: 'published', header: 'Status', render: (p: any) => <Badge label={p.published ? 'published' : 'draft'} /> },
          { key: 'date', header: 'Tanggal', render: (p: any) => <span className="text-xs" style={{ color: '#999' }}>{new Date(p.createdAt).toLocaleDateString('id-ID')}</span> },
          { key: 'actions', header: '', render: (p: any) => (
            <button onClick={() => deleteMutation.mutate(p.id)} className="text-xs underline" style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Hapus</button>
          )},
        ]}
        data={postsData?.data || []}
        emptyMessage="Belum ada post"
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Post Baru">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input placeholder="Judul" value={form.title} onChange={(e) => {
            const t = e.target.value;
            setForm({ ...form, title: t, slug: t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') });
          }} className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required />
          <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required />
          <textarea placeholder="Ringkasan" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} />
          <textarea placeholder="Konten" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required />
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }}>
            <option value="">Tanpa kategori</option>
            {((categories as any[]) || []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm" style={{ color: '#4c4c4c' }}>
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Publikasikan
          </label>
          <button type="submit" disabled={createMutation.isPending} className="w-full py-2.5 text-sm font-medium disabled:opacity-50"
            style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}>Simpan</button>
        </form>
      </Modal>
    </section>
  );
}
