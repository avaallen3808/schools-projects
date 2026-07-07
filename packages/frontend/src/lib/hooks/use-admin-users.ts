'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { useAuthStore } from '../stores/auth.store';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  phone: string | null;
  branchId: string | null;
  createdAt: string;
}

interface PaginatedUsers {
  data: User[];
  meta: { total: number; page: number; limit: number };
}

export function useAdminUsers(params: { page?: number; role?: string } = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => apiClient<PaginatedUsers>('/users', { token: token ?? undefined, params: { page: params.page, role: params.role } }),
    enabled: !!token,
  });
}

export function useAdminCreateUser() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string; role?: string; branchId?: string }) =>
      apiClient<User>('/users', { method: 'POST', body: data, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useAdminDeleteUser() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/users/${id}`, { method: 'DELETE', token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}
