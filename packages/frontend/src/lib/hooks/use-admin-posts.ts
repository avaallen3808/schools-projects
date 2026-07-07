'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { useAuthStore } from '../stores/auth.store';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  author: { id: string; name: string } | null;
  category: { id: string; name: string; slug: string } | null;
  createdAt: string;
}

interface PaginatedPosts {
  data: Post[];
  meta: { total: number; page: number; limit: number };
}

export function useAdminPosts(params: { page?: number } = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'posts', params],
    queryFn: () => apiClient<PaginatedPosts>('/cms/admin/posts', { token: token ?? undefined, params: { page: params.page } }),
    enabled: !!token,
  });
}

export function useAdminCreatePost() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; slug: string; content: string; excerpt?: string; categoryId?: string; published?: boolean }) =>
      apiClient<Post>('/cms/posts', { method: 'POST', body: data, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'posts'] }),
  });
}

export function useAdminDeletePost() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/cms/posts/${id}`, { method: 'DELETE', token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'posts'] }),
  });
}

export function useAdminCategories() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => apiClient('/cms/categories', { token: token ?? undefined }),
    enabled: !!token,
  });
}
