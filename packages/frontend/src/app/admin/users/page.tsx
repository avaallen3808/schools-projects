'use client';

import { useState } from 'react';
import { useAdminUsers, useAdminCreateUser, useAdminDeleteUser } from '../../../lib/hooks/use-admin-users';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';

const roles = [
  { value: 'SUPERADMIN', label: 'Superadmin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'OPERATOR', label: 'Operator' },
  { value: 'TEACHER', label: 'Guru' },
  { value: 'STUDENT', label: 'Siswa' },
  { value: 'ALUMNI', label: 'Alumni' },
];

export default function AdminUsersPage() {
  const { data: usersData } = useAdminUsers();
  const createMutation = useAdminCreateUser();
  const deleteMutation = useAdminDeleteUser();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'STUDENT' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form, { onSuccess: () => { setIsOpen(false); setForm({ email: '', password: '', name: '', role: 'STUDENT' }); } });
  };

  return (
    <section className="px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Users</h1>
        <button onClick={() => setIsOpen(true)} className="px-5 py-2 text-sm font-medium bg-primary text-text rounded-pill border-none cursor-pointer">+ Tambah User</button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Nama', render: (u: any) => u.name },
          { key: 'email', header: 'Email', render: (u: any) => <span className="text-xs text-text-secondary">{u.email}</span> },
          { key: 'role', header: 'Role', render: (u: any) => <Badge label={u.role} /> },
          { key: 'verified', header: 'Verifikasi', render: (u: any) => <Badge label={u.isVerified ? 'verified' : 'pending'} /> },
          { key: 'createdAt', header: 'Dibuat', render: (u: any) => <span className="text-xs text-text-secondary">{new Date(u.createdAt).toLocaleDateString('id-ID')}</span> },
          { key: 'actions', header: '', render: (u: any) => (
            <button onClick={() => deleteMutation.mutate(u.id)} className="text-xs underline text-error bg-transparent border-none cursor-pointer">Hapus</button>
          )},
        ]}
        data={usersData?.data || []}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Tambah User">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm border border-border outline-none focus:border-primary" required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm border border-border outline-none focus:border-primary" required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm border border-border outline-none focus:border-primary" required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm border border-border outline-none focus:border-primary bg-bg text-text">
            {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <button type="submit" disabled={createMutation.isPending}
            className="w-full py-2.5 text-sm font-medium disabled:opacity-50 bg-primary text-text rounded-pill border-none cursor-pointer">
            Simpan
          </button>
        </form>
      </Modal>
    </section>
  );
}
