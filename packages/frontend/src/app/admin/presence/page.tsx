'use client';

import { useState } from 'react';
import { useAuthStore } from '../../../lib/stores/auth.store';
import {
  useAdminRombels, useAdminCreateRombel, useAdminDeleteRombel,
  useAdminPresenceRecords, useAdminCreateRecord, useAdminBulkRecords,
  useAdminStudents,
} from '../../../lib/hooks/use-admin-presence';
import {
  useMasterBranches, useMasterAcademicYears, useMasterEntryGrades,
} from '../../../lib/hooks/use-admin-spmb';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';

type TRombel = Record<string, unknown>;

const statusColors: Record<string, string> = {
  HADIR: 'success',
  IZIN: 'warning',
  SAKIT: 'warning',
  ALPA: 'error',
};

export default function AdminPresencePage() {
  const user = useAuthStore((s) => s.user);
  const { data: rombels, isLoading: rombelsLoading } = useAdminRombels();
  const createRombel = useAdminCreateRombel();
  const deleteRombel = useAdminDeleteRombel();

  const { data: branches } = useMasterBranches();
  const { data: academicYears } = useMasterAcademicYears();
  const { data: entryGrades } = useMasterEntryGrades();

  const [selectedRombel, setSelectedRombel] = useState<string | null>(null);
  const [recordDate, setRecordDate] = useState(new Date().toISOString().slice(0, 10));
  const { data: records, isLoading: recordsLoading } = useAdminPresenceRecords({
    rombelId: selectedRombel || undefined,
    date: recordDate,
  });
  const createRecord = useAdminCreateRecord();
  const bulkRecords = useAdminBulkRecords();
  const { data: students } = useAdminStudents();

  const [rombelModal, setRombelModal] = useState(false);
  const [recordModal, setRecordModal] = useState(false);
  const [rombelForm, setRombelForm] = useState({ branchId: '', academicYearId: '', entryGradeId: '', name: '' });
  const [recordForm, setRecordForm] = useState({ studentId: '', status: 'HADIR', note: '' });

  const handleRombelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRombel.mutate(rombelForm, {
      onSuccess: () => { setRombelModal(false); setRombelForm({ branchId: '', academicYearId: '', entryGradeId: '', name: '' }); },
    });
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRombel || !user) return;
    const data = {
      rombelId: selectedRombel,
      studentId: recordForm.studentId,
      date: recordDate,
      status: recordForm.status,
      createdBy: user.id,
      note: recordForm.note || undefined,
    };
    createRecord.mutate(data as any, {
      onSuccess: () => { setRecordModal(false); setRecordForm({ studentId: '', status: 'HADIR', note: '' }); },
    });
  };

  const handleBulkHadir = () => {
    if (!selectedRombel || !user) return;
    const studentList = (students as any)?.data || [];
    const studentIds = studentList.map((s: any) => s.id);
    if (!studentIds.length) return;

    const total = studentIds.length;
    if (confirm(`Catat HADIR untuk ${total} siswa di rombel ini?`)) {
      bulkRecords.mutate({
        rombelId: selectedRombel,
        date: recordDate,
        status: 'HADIR',
        createdBy: user.id,
        studentIds,
      });
    }
  };

  const selectedRombelName = (rombels as TRombel[])?.find((r: any) => r.id === selectedRombel)?.name as string || '';

  return (
    <section className="px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl" style={{ fontFamily: 'Prata, serif' }}>Presensi</h1>
        <button
          onClick={() => setRombelModal(true)}
          className="px-4 py-1.5 text-sm font-medium"
          style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}
        >
          + Rombel Baru
        </button>
      </div>

      {/* Rombels list */}
      <h2 className="text-xl mb-4">Rombel</h2>
      <DataTable
        columns={[
          { key: 'name', header: 'Nama', render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: 'branch', header: 'Cabang', render: (r: any) => r.branch?.name || '-' },
          { key: 'grade', header: 'Tingkat', render: (r: any) => r.entryGrade?.name || '-' },
          { key: 'year', header: 'T.A.', render: (r: any) => r.academicYear?.name || '-' },
          { key: 'count', header: 'Rekaman', render: (r: any) => r._count?.presenceRecords || 0 },
          { key: 'actions', header: '', render: (r: any) => (
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedRombel(r.id)}
                className="text-xs underline"
                style={{ color: selectedRombel === r.id ? '#fdc72f' : '#07294d', background: 'none', border: 'none', cursor: 'pointer', fontWeight: selectedRombel === r.id ? 600 : 400 }}
              >
                {selectedRombel === r.id ? 'Dipilih' : 'Pilih'}
              </button>
              <button
                onClick={() => { if (confirm('Hapus rombel?')) deleteRombel.mutate(r.id); }}
                className="text-xs underline"
                style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Hapus
              </button>
            </div>
          )},
        ]}
        data={(rombels as TRombel[]) || []}
        emptyMessage="Belum ada rombel"
        isLoading={rombelsLoading}
      />

      {/* Records section */}
      {selectedRombel && (
        <>
          <div className="flex items-center justify-between mt-10 mb-4">
            <h2 className="text-xl">Rekaman Presensi — {selectedRombelName}</h2>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-sm"
                style={{ border: '1px solid #f6f4ee' }}
              />
              <button
                onClick={handleBulkHadir}
                disabled={bulkRecords.isPending}
                className="px-4 py-1.5 text-sm font-medium disabled:opacity-50"
                style={{ background: '#e8f5e9', color: '#2e7d32', borderRadius: 100, border: 'none', cursor: 'pointer' }}
              >
                {bulkRecords.isPending ? 'Memproses...' : 'Semua Hadir'}
              </button>
              <button
                onClick={() => setRecordModal(true)}
                className="px-4 py-1.5 text-sm font-medium"
                style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}
              >
                + Catat Presensi
              </button>
            </div>
          </div>

          <DataTable
            columns={[
              { key: 'student', header: 'Siswa', render: (r: any) => r.student?.name || '-' },
              { key: 'date', header: 'Tanggal', render: (r: any) => new Date(r.date).toLocaleDateString('id-ID') },
              { key: 'status', header: 'Status', render: (r: any) => <Badge label={r.status} /> },
              { key: 'note', header: 'Keterangan', render: (r: any) => r.note || '-' },
              { key: 'createdAt', header: 'Dicatat', render: (r: any) => new Date(r.createdAt).toLocaleString('id-ID') },
            ]}
            data={(records as any)?.data || []}
            emptyMessage="Belum ada data presensi"
            isLoading={recordsLoading}
          />
        </>
      )}

      {/* Rombel Modal */}
      <Modal isOpen={rombelModal} onClose={() => { setRombelModal(false); setRombelForm({ branchId: '', academicYearId: '', entryGradeId: '', name: '' }); }} title="Rombel Baru">
        <form onSubmit={handleRombelSubmit} className="flex flex-col gap-4">
          <input placeholder="Nama Rombel (contoh: X-A)" value={rombelForm.name}
            onChange={(e) => setRombelForm({ ...rombelForm, name: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required />
          <select value={rombelForm.branchId} onChange={(e) => setRombelForm({ ...rombelForm, branchId: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required>
            <option value="">Pilih Cabang</option>
            {((branches as any[]) || []).map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select value={rombelForm.academicYearId} onChange={(e) => setRombelForm({ ...rombelForm, academicYearId: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required>
            <option value="">Pilih Tahun Ajaran</option>
            {((academicYears as any[]) || []).map((y: any) => <option key={y.id} value={y.id}>{y.name}</option>)}
          </select>
          <select value={rombelForm.entryGradeId} onChange={(e) => setRombelForm({ ...rombelForm, entryGradeId: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required>
            <option value="">Pilih Tingkat</option>
            {((entryGrades as any[]) || []).map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <button type="submit" disabled={createRombel.isPending}
            className="w-full py-2.5 text-sm font-medium disabled:opacity-50"
            style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
            Simpan
          </button>
        </form>
      </Modal>

      {/* Record Modal */}
      <Modal isOpen={recordModal} onClose={() => { setRecordModal(false); setRecordForm({ studentId: '', status: 'HADIR', note: '' }); }} title="Catat Presensi">
        <form onSubmit={handleRecordSubmit} className="flex flex-col gap-4">
          <select value={recordForm.studentId} onChange={(e) => setRecordForm({ ...recordForm, studentId: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required>
            <option value="">Pilih Siswa</option>
            {((students as any)?.data || []).map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
          </select>
          <select value={recordForm.status} onChange={(e) => setRecordForm({ ...recordForm, status: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} required>
            <option value="HADIR">Hadir</option>
            <option value="IZIN">Izin</option>
            <option value="SAKIT">Sakit</option>
            <option value="ALPA">Alpa</option>
          </select>
          <input placeholder="Keterangan (opsional)" value={recordForm.note}
            onChange={(e) => setRecordForm({ ...recordForm, note: e.target.value })}
            className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1px solid #f6f4ee' }} />
          <button type="submit" disabled={createRecord.isPending}
            className="w-full py-2.5 text-sm font-medium disabled:opacity-50"
            style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
            Simpan
          </button>
        </form>
      </Modal>
    </section>
  );
}
