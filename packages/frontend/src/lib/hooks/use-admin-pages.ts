'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { useAuthStore } from '../stores/auth.store';

interface CmsPage {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  metaTitle: string | null;
  metaDesc: string | null;
  createdAt: string;
}

export function useAdminCreatePage() {
  const token = useAuthStore((s) => s.accessToken);
  return useMutation({
    mutationFn: (data: { title: string; slug: string; content: string; metaTitle?: string; metaDesc?: string; published?: boolean }) =>
      apiClient<CmsPage>('/cms/pages', { method: 'POST', body: data, token: token ?? undefined }),
  });
}

export function useAdminSliders() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'sliders'],
    queryFn: () => apiClient('/cms/sliders', { token: token ?? undefined }),
    enabled: !!token,
  });
}

export function useAdminCreateSlider() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; subtitle?: string; imageUrl: string; link?: string; sortOrder?: number }) =>
      apiClient('/cms/sliders', { method: 'POST', body: data, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'sliders'] }),
  });
}

export function useAdminDeleteSlider() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/cms/sliders/${id}`, { method: 'DELETE', token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'sliders'] }),
  });
}
