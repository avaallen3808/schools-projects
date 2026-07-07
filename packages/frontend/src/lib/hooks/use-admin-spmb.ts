'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { useAuthStore } from '../stores/auth.store';

// ── Periods ──

export function useAdminPeriods() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'spmb', 'periods'],
    queryFn: () => apiClient('/spmb/periods', { token: token ?? undefined }),
    enabled: !!token,
  });
}

export function useAdminCreatePeriod() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { academicYearId: string; name: string; startDate: string; endDate: string }) =>
      apiClient('/spmb/periods', { method: 'POST', body: data, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'spmb', 'periods'] }),
  });
}

export function useAdminUpdatePeriod() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; startDate?: string; endDate?: string; isActive?: boolean }) =>
      apiClient(`/spmb/periods/${id}`, { method: 'PUT', body: data, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'spmb', 'periods'] }),
  });
}

// ── Offerings ──

export function useAdminOfferings(periodId?: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'spmb', 'offerings', periodId],
    queryFn: () => apiClient('/spmb/offerings', { token: token ?? undefined, params: { periodId } }),
    enabled: !!token,
  });
}

export function useAdminCreateOffering() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { periodId: string; branchId: string; entryGradeId: string; trackId: string; quota: number }) =>
      apiClient('/spmb/offerings', { method: 'POST', body: data, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'spmb', 'offerings'] }),
  });
}

export function useAdminUpdateOffering() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; quota?: number; isActive?: boolean }) =>
      apiClient(`/spmb/offerings/${id}`, { method: 'PUT', body: data, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'spmb', 'offerings'] }),
  });
}

// ── Registrations ──

export function useAdminRegistrations(params: { page?: number; offeringId?: string; status?: string } = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'spmb', 'registrations', params],
    queryFn: () =>
      apiClient('/spmb/registrations', {
        token: token ?? undefined,
        params: { page: params.page, offeringId: params.offeringId, status: params.status },
      }),
    enabled: !!token,
  });
}

export function useAdminUpdateRegistrationStatus() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient(`/spmb/registrations/${id}/status`, { method: 'PUT', body: { status }, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'spmb', 'registrations'] }),
  });
}

// ── Requirements ──

export function useAdminRequirements(offeringId: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['admin', 'spmb', 'requirements', offeringId],
    queryFn: () => apiClient(`/spmb/offerings/${offeringId}/requirements`, { token: token ?? undefined }),
    enabled: !!token && !!offeringId,
  });
}

export function useAdminCreateRequirement() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { offeringId: string; name: string; isMandatory?: boolean }) =>
      apiClient('/spmb/requirements', { method: 'POST', body: data, token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'spmb', 'requirements'] }),
  });
}

export function useAdminDeleteRequirement() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/spmb/requirements/${id}`, { method: 'DELETE', token: token ?? undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'spmb', 'requirements'] }),
  });
}

// ── Selection ──

export function useAdminRunSelection() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offeringId: string) =>
      apiClient('/spmb/selection/run', { method: 'POST', body: { offeringId }, token: token ?? undefined }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'spmb', 'registrations'] });
    },
  });
}

// ── Master Data (for dropdowns) ──

export function useMasterBranches() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['master', 'branches'],
    queryFn: () => apiClient('/master/branches', { token: token ?? undefined }),
    enabled: !!token,
  });
}

export function useMasterAcademicYears() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['master', 'academic-years'],
    queryFn: () => apiClient('/master/academic-years', { token: token ?? undefined }),
    enabled: !!token,
  });
}

export function useMasterEntryGrades() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['master', 'entry-grades'],
    queryFn: () => apiClient('/master/entry-grades', { token: token ?? undefined }),
    enabled: !!token,
  });
}

export function useMasterTracks() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['master', 'tracks'],
    queryFn: () => apiClient('/master/tracks', { token: token ?? undefined }),
    enabled: !!token,
  });
}
