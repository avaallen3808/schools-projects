'use client';

import { useState } from 'react';
import { useAdminSliders, useAdminCreateSlider, useAdminDeleteSlider } from '../../../lib/hooks/use-admin-pages';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';

export default function AdminSlidersPage() {
  const { data: sliders } = useAdminSliders();
  const createMutation = useAdminCreateSlider();
  const deleteMutation = useAdminDeleteSlider();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', link: '', sortOrder: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form, { onSuccess: () => { setIsOpen(false); setForm({ title: '', subtitle: '', imageUrl: '', link: '', sortOrder: 0 }); } });
  };

  return (
    <section className="px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl" style={{ fontFamily: 'Prata, serif' }}>Slider</h1>
        <button onClick={() => setIsOpen(true)} className="px-5 py-2 text-sm font-medium"
          style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}>+ Tambah Slider</button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Judul', render: (s: any) => s.title },
          { key: 'subtitle', header: 'Subtitle', render: (s: any) => <span className="text-xs" style={{ color: '#999' }}>{s.subtitle || '-'}</span> },
          { key: 'active', header: 'Status', render: (s: any) => <Badge label={s.isActive ? 'active' : 'inactive'} /> },
          { key: 'order', header: 'Urutan', render: (s: any) => s.sortOrder },
          { key: 'actions', header: '', render: (s: any) => (
            <button onClick={() => deleteMutation.mutate(s.id)} className="text-xs underline" style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Hapus</button>
          )},
        ]}
        data={(sliders as any[]) || []}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Tambah Slider">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required />
          <input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} />
          <input placeholder="URL Gambar" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required />
          <input placeholder="Link (opsional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} />
          <input type="number" placeholder="Urutan" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} />
          <button type="submit" disabled={createMutation.isPending}
            className="w-full py-2.5 text-sm font-medium disabled:opacity-50"
            style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
            Simpan
          </button>
        </form>
      </Modal>
    </section>
  );
}
