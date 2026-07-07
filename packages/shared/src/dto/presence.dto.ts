import { z } from 'zod';

export const createPresenceSchema = z.object({
  rombelId: z.string().min(1),
  studentId: z.string().min(1),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  status: z.enum(['HADIR', 'IZIN', 'SAKIT', 'ALPA']),
  note: z.string().optional(),
  createdBy: z.string().min(1),
});

export const bulkPresenceSchema = z.object({
  rombelId: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(['HADIR', 'IZIN', 'SAKIT', 'ALPA']),
  studentIds: z.array(z.string()).min(1, 'Minimal 1 siswa'),
  createdBy: z.string().min(1),
});

export type CreatePresenceDto = z.infer<typeof createPresenceSchema>;
export type BulkPresenceDto = z.infer<typeof bulkPresenceSchema>;
