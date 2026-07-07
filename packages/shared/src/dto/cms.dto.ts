import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(2, 'Judul minimal 2 karakter'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  content: z.string().min(1, 'Konten wajib diisi'),
  excerpt: z.string().optional(),
  categoryId: z.string().optional(),
  imageUrl: z.string().optional(),
  published: z.boolean().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
});

export const createPageSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  content: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  published: z.boolean().optional(),
});

export const createSliderSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  subtitle: z.string().optional(),
  imageUrl: z.string().url('URL gambar tidak valid'),
  link: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const createCommentSchema = z.object({
  postId: z.string().min(1),
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  content: z.string().min(1, 'Komentar wajib diisi'),
});

export const createContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type CreatePageDto = z.infer<typeof createPageSchema>;
export type CreateSliderDto = z.infer<typeof createSliderSchema>;
export type CreateCommentDto = z.infer<typeof createCommentSchema>;
export type CreateContactDto = z.infer<typeof createContactSchema>;
