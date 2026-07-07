import { z } from 'zod';

export const createPeriodSchema = z.object({
  academicYearId: z.string().min(1, 'Tahun akademik wajib diisi'),
  name: z.string().min(1, 'Nama periode wajib diisi'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
});

export const createOfferingSchema = z.object({
  periodId: z.string().min(1),
  branchId: z.string().min(1),
  entryGradeId: z.string().min(1),
  trackId: z.string().min(1),
  quota: z.number().int().positive('Kuota harus lebih dari 0'),
  selectionConfig: z.record(z.unknown()).optional(),
});

export const createRegistrationSchema = z.object({
  userId: z.string().min(1),
  offeringId: z.string().min(1),
});

export const addGradeSchema = z.object({
  registrationId: z.string().min(1),
  subject: z.string().min(1),
  semester: z.number().int().positive().optional(),
  score: z.number().min(0).max(100),
});

export type CreatePeriodDto = z.infer<typeof createPeriodSchema>;
export type CreateOfferingDto = z.infer<typeof createOfferingSchema>;
export type CreateRegistrationDto = z.infer<typeof createRegistrationSchema>;
export type AddGradeDto = z.infer<typeof addGradeSchema>;
