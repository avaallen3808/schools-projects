import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
});

export const createAcademicYearSchema = z.object({
  name: z.string().regex(/^\d{4}\/\d{4}$/, 'Format harus YYYY/YYYY'),
  isActive: z.boolean().optional(),
});

export const createEntryGradeSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
});

export const createTrackSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
});

export type CreateBranchDto = z.infer<typeof createBranchSchema>;
export type CreateAcademicYearDto = z.infer<typeof createAcademicYearSchema>;
export type CreateEntryGradeDto = z.infer<typeof createEntryGradeSchema>;
export type CreateTrackDto = z.infer<typeof createTrackSchema>;
