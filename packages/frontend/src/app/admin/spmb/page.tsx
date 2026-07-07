'use client';

import { useState } from 'react';
import {
  useAdminPeriods, useAdminCreatePeriod, useAdminUpdatePeriod,
  useAdminOfferings, useAdminCreateOffering, useAdminUpdateOffering,
  useAdminRegistrations, useAdminUpdateRegistrationStatus,
  useAdminRunSelection,
  useMasterBranches, useMasterAcademicYears, useMasterEntryGrades, useMasterTracks,
} from '../../../lib/hooks/use-admin-spmb';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';

type TPeriod = Record<string, unknown>;
type TOffering = Record<string, unknown>;
type TReg = Record<string, unknown>;

const statusOptions = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'ACCEPTED', label: 'Diterima' },
  { value: 'REJECTED', label: 'Ditolak' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
];

export default function AdminSpmbPage() {
  const { data: periods, isLoading: periodsLoading } = useAdminPeriods();
  const { data: offerings, isLoading: offeringsLoading } = useAdminOfferings();
  const { data: registrations, isLoading: regsLoading } = useAdminRegistrations();
  const createPeriod = useAdminCreatePeriod();
  const updatePeriod = useAdminUpdatePeriod();
  const createOffering = useAdminCreateOffering();
  const updateOffering = useAdminUpdateOffering();
  const updateStatus = useAdminUpdateRegistrationStatus();
  const runSelection = useAdminRunSelection();

  const { data: branches } = useMasterBranches();
  const { data: academicYears } = useMasterAcademicYears();
  const { data: entryGrades } = useMasterEntryGrades();
  const { data: tracks } = useMasterTracks();

  const [periodModal, setPeriodModal] = useState(false);
  const [offeringModal, setOfferingModal] = useState(false);
  const [editPeriod, setEditPeriod] = useState<TPeriod | null>(null);
  const [editOffering, setEditOffering] = useState<TOffering | null>(null);
  const [runningSelection, setRunningSelection] = useState<string | null>(null);

  const [periodForm, setPeriodForm] = useState({ academicYearId: '', name: '', startDate: '', endDate: '' });
  const [offeringForm, setOfferingForm] = useState({ periodId: '', branchId: '', entryGradeId: '', trackId: '', quota: 30 });

  const resetPeriodForm = () => {
    setPeriodForm({ academicYearId: '', name: '', startDate: '', endDate: '' });
    setEditPeriod(null);
  };

  const resetOfferingForm = () => {
    setOfferingForm({ periodId: '', branchId: '', entryGradeId: '', trackId: '', quota: 30 });
    setEditOffering(null);
  };

  const handlePeriodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPeriod) {
      updatePeriod.mutate({ id: editPeriod.id as string, ...periodForm }, { onSuccess: () => { setPeriodModal(false); resetPeriodForm(); } });
    } else {
      createPeriod.mutate(periodForm, { onSuccess: () => { setPeriodModal(false); resetPeriodForm(); } });
    }
  };

  const handleOfferingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editOffering) {
      updateOffering.mutate({ id: editOffering.id as string, quota: offeringForm.quota }, { onSuccess: () => { setOfferingModal(false); resetOfferingForm(); } });
    } else {
      createOffering.mutate(offeringForm, { onSuccess: () => { setOfferingModal(false); resetOfferingForm(); } });
    }
  };

  const handleRunSelection = async (offeringId: string) => {
    setRunningSelection(offeringId);
    try { await runSelection.mutateAsync(offeringId); } finally { setRunningSelection(null); }
  };

  const openEditPeriod = (p: TPeriod) => {
    setEditPeriod(p);
    setPeriodForm({
      academicYearId: (p.academicYear as any)?.id || '',
      name: p.name as string,
      startDate: (p.startDate as string)?.slice(0, 10) || '',
      endDate: (p.endDate as string)?.slice(0, 10) || '',
    });
    setPeriodModal(true);
  };

  return (
    <section className="px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl" style={{ fontFamily: 'Prata, serif' }}>SPMB</h1>
      </div>

      {/* Summary cards */}
      <div className="grid gap-6 mb-10 grid-cols-1 sm:grid-cols-4">
        <div className="p-6 rounded-2xl" style={{ background: '#f6f4ee' }}>
          <p className="text-sm mb-1" style={{ color: '#666' }}>Periode Aktif</p>
          <p className="text-2xl font-semibold">{(periods as TPeriod[])?.filter((p: any) => p.isActive)?.length || 0}</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ background: '#f6f4ee' }}>
          <p className="text-sm mb-1" style={{ color: '#666' }}>Total Offering</p>
          <p className="text-2xl font-semibold">{(offerings as TPeriod[])?.length || 0}</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ background: '#f6f4ee' }}>
          <p className="text-sm mb-1" style={{ color: '#666' }}>Pendaftar</p>
          <p className="text-2xl font-semibold">{(registrations as any)?.data?.length || 0}</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ background: '#f6f4ee' }}>
          <p className="text-sm mb-1" style={{ color: '#666' }}>Diterima</p>
          <p className="text-2xl font-semibold">
            {(registrations as any)?.data?.filter((r: any) => r.status === 'ACCEPTED')?.length || 0}
          </p>
        </div>
      </div>

      {/* Periods */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Periode Pendaftaran</h2>
        <button
          onClick={() => { resetPeriodForm(); setPeriodModal(true); }}
          className="px-4 py-1.5 text-sm font-medium"
          style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}
        >
          + Periode Baru
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Nama', render: (p: any) => <span className="font-medium">{p.name}</span> },
          { key: 'year', header: 'T.A.', render: (p: any) => p.academicYear?.name || '-' },
          { key: 'start', header: 'Mulai', render: (p: any) => new Date(p.startDate).toLocaleDateString('id-ID') },
          { key: 'end', header: 'Selesai', render: (p: any) => new Date(p.endDate).toLocaleDateString('id-ID') },
          { key: 'active', header: 'Status', render: (p: any) => <Badge label={p.isActive ? 'Aktif' : 'Nonaktif'} /> },
          { key: 'offerings', header: 'Offering', render: (p: any) => p._count?.offerings || 0 },
          { key: 'actions', header: '', render: (p: any) => (
            <button
              onClick={() => openEditPeriod(p)}
              className="text-xs underline"
              style={{ color: '#07294d', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Edit
            </button>
          )},
        ]}
        data={(periods as TPeriod[]) || []}
        emptyMessage="Belum ada periode"
        isLoading={periodsLoading}
      />

      {/* Offerings */}
      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-xl">Offering</h2>
        <button
          onClick={() => { resetOfferingForm(); setOfferingModal(true); }}
          className="px-4 py-1.5 text-sm font-medium"
          style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}
        >
          + Offering Baru
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'period', header: 'Periode', render: (o: any) => o.period?.name || '-' },
          { key: 'branch', header: 'Cabang', render: (o: any) => o.branch?.name || '-' },
          { key: 'grade', header: 'Tingkat', render: (o: any) => o.entryGrade?.name || '-' },
          { key: 'track', header: 'Jurusan', render: (o: any) => o.track?.name || '-' },
          { key: 'quota', header: 'Kuota', render: (o: any) => o.quota },
          { key: 'pendaftar', header: 'Pendaftar', render: (o: any) => o._count?.registrations || 0 },
          { key: 'active', header: 'Status', render: (o: any) => <Badge label={o.isActive ? 'Aktif' : 'Tutup'} /> },
          { key: 'actions', header: '', render: (o: any) => (
            <div className="flex gap-2">
              <button
                onClick={() => { setEditOffering(o); setOfferingForm({ ...offeringForm, quota: o.quota }); setOfferingModal(true); }}
                className="text-xs underline"
                style={{ color: '#07294d', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleRunSelection(o.id)}
                disabled={runningSelection === o.id}
                className="text-xs underline disabled:opacity-50"
                style={{ color: '#fdc72f', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {runningSelection === o.id ? 'Memproses...' : 'Seleksi'}
              </button>
            </div>
          )},
        ]}
        data={(offerings as TOffering[]) || []}
        emptyMessage="Belum ada offering"
        isLoading={offeringsLoading}
      />

      {/* Registrations */}
      <h2 className="text-xl mt-10 mb-4">Pendaftar</h2>
      <DataTable
        columns={[
          { key: 'number', header: 'No. Daftar', render: (r: any) => <code className="text-xs font-mono">{r.number}</code> },
          { key: 'user', header: 'Nama', render: (r: any) => r.user?.name || '-' },
          { key: 'offering', header: 'Pilihan', render: (r: any) => r.offering?.branch?.name ? `${r.offering.branch.name} - ${r.offering.entryGrade?.name}` : '-' },
          { key: 'score', header: 'Nilai', render: (r: any) => r.totalScore ? r.totalScore.toFixed(2) : '-' },
          { key: 'status', header: 'Status', render: (r: any) => <Badge label={r.status} /> },
          { key: 'date', header: 'Tanggal', render: (r: any) => new Date(r.createdAt).toLocaleDateString('id-ID') },
          { key: 'actions', header: '', render: (r: any) => (
            <select
              value={r.status}
              onChange={(e) => updateStatus.mutate({ id: r.id, status: e.target.value })}
              className="text-xs px-2 py-1 rounded"
              style={{ border: '1px solid #f6f4ee', background: '#fff' }}
            >
              {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          )},
        ]}
        data={(registrations as any)?.data || []}
        emptyMessage="Belum ada pendaftar"
        isLoading={regsLoading}
      />

      {/* Period Modal */}
      <Modal isOpen={periodModal} onClose={() => { setPeriodModal(false); resetPeriodForm(); }} title={editPeriod ? 'Edit Periode' : 'Periode Baru'}>
        <form onSubmit={handlePeriodSubmit} className="flex flex-col gap-4">
          <select value={periodForm.academicYearId} onChange={(e) => setPeriodForm({ ...periodForm, academicYearId: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required>
            <option value="">Pilih Tahun Ajaran</option>
            {((academicYears as any[]) || []).map((y: any) => <option key={y.id} value={y.id}>{y.name}</option>)}
          </select>
          <input placeholder="Nama Periode (contoh: Gelombang 1)" value={periodForm.name}
            onChange={(e) => setPeriodForm({ ...periodForm, name: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required />
          <input type="date" value={periodForm.startDate} onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required />
          <input type="date" value={periodForm.endDate} onChange={(e) => setPeriodForm({ ...periodForm, endDate: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required />
          <div className="flex gap-3">
            <button type="submit" disabled={createPeriod.isPending || updatePeriod.isPending}
              className="flex-1 py-2.5 text-sm font-medium disabled:opacity-50"
              style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
              {editPeriod ? 'Update' : 'Simpan'}
            </button>
            {editPeriod && (
              <button type="button" onClick={() => updatePeriod.mutate({ id: editPeriod.id as string, isActive: !(editPeriod.isActive as boolean) })}
                className="px-4 py-2.5 text-sm"
                style={{ background: '#f6f4ee', color: '#4c4c4c', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
                {(editPeriod.isActive as boolean) ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            )}
          </div>
        </form>
      </Modal>

      {/* Offering Modal */}
      <Modal isOpen={offeringModal} onClose={() => { setOfferingModal(false); resetOfferingForm(); }} title={editOffering ? 'Edit Offering' : 'Offering Baru'}>
        <form onSubmit={handleOfferingSubmit} className="flex flex-col gap-4">
          <select value={offeringForm.periodId} onChange={(e) => setOfferingForm({ ...offeringForm, periodId: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required>
            <option value="">Pilih Periode</option>
            {((periods as any[]) || []).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={offeringForm.branchId} onChange={(e) => setOfferingForm({ ...offeringForm, branchId: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required>
            <option value="">Pilih Cabang</option>
            {((branches as any[]) || []).map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select value={offeringForm.entryGradeId} onChange={(e) => setOfferingForm({ ...offeringForm, entryGradeId: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required>
            <option value="">Pilih Tingkat</option>
            {((entryGrades as any[]) || []).map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <select value={offeringForm.trackId} onChange={(e) => setOfferingForm({ ...offeringForm, trackId: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required>
            <option value="">Pilih Jurusan</option>
            {((tracks as any[]) || []).map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="number" placeholder="Kuota" value={offeringForm.quota}
            onChange={(e) => setOfferingForm({ ...offeringForm, quota: Number(e.target.value) })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required min={1} />
          {editOffering && (
            <button type="button" onClick={() => updateOffering.mutate({ id: editOffering.id as string, isActive: !(editOffering.isActive as boolean) })}
              className="py-2.5 text-sm"
              style={{ background: '#f6f4ee', color: '#4c4c4c', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
              {(editOffering.isActive as boolean) ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
            </button>
          )}
          <button type="submit" disabled={createOffering.isPending || updateOffering.isPending}
            className="w-full py-2.5 text-sm font-medium disabled:opacity-50"
            style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
            {editOffering ? 'Update' : 'Simpan'}
          </button>
        </form>
      </Modal>
    </section>
  );
}
