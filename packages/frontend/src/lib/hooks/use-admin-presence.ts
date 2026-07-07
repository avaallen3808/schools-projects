'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { useAuthStore } from '../stores/auth.store';

// ── Rombels ──

export function useAdminRombels() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'rombels'],
    queryFn: () => apiClient('/presence/rombels', { token: token ?? undefined }),
    enabled: !!token,
  });
}

export function useAdminCreateRombel() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { branchId: string; academicYearId: string; entryGradeId: string; name: string }) =>
      apiClient('/presence/rombels', { method: 'POST', body: data, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'rombels'] }),
  });
}

export function useAdminDeleteRombel() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/presence/rombels/${id}`, { method: 'DELETE', token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'rombels'] }),
  });
}

// ── Records ──

export function useAdminPresenceRecords(params: { rombelId?: string; date?: string; page?: number } = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'presence-records', params],
    queryFn: () =>
      apiClient<{ data: Record<string, unknown>[]; meta: { total: number; page: number; limit: number } }>(
        '/presence/records',
        { token: token ?? undefined, params: { rombelId: params.rombelId, date: params.date, page: params.page } },
      ),
    enabled: !!token && !!params.rombelId,
  });
}

export function useAdminCreateRecord() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { rombelId: string; studentId: string; date: string; status: string; createdBy: string; note?: string }) =>
      apiClient('/presence/records', { method: 'POST', body: data, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'presence-records'] }),
  });
}

export function useAdminBulkRecords() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { rombelId: string; date: string; status: string; createdBy: string; studentIds: string[]; note?: string }) =>
      apiClient('/presence/records/bulk', { method: 'POST', body: data, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'presence-records'] }),
  });
}

// ── Stats ──

export function useAdminPresenceStats(rombelId: string, startDate: string, endDate: string, studentId?: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'presence-stats', rombelId, startDate, endDate, studentId],
    queryFn: () =>
      apiClient(`/presence/stats/${rombelId}`, {
        token: token ?? undefined,
        params: { startDate, endDate, studentId },
      }),
    enabled: !!token && !!rombelId && !!startDate && !!endDate,
  });
}

// ── Students (Users with STUDENT role) ──

export function useAdminStudents() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'students'],
    queryFn: () => apiClient('/users', { token: token ?? undefined, params: { role: 'STUDENT' } }),
    enabled: !!token,
  });
}
