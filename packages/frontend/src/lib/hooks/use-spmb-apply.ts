'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { useAuthStore } from '../stores/auth.store';

export function useActiveOfferings() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['spmb', 'active-offerings'],
    queryFn: () => apiClient('/spmb/offerings', { token: token ?? undefined }),
    enabled: !!token,
  });
}

export function useRegisterForOffering() {
  const token = useAuthStore((s) => s.accessToken);
  return useMutation({
    mutationFn: (data: { userId: string; offeringId: string }) =>
      apiClient('/spmb/registrations', { method: 'POST', body: data, token: token ?? undefined }),
  });
}

export function useMyRegistrations() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['spmb', 'my-registrations'],
    queryFn: () => apiClient('/spmb/registrations', { token: token ?? undefined }),
    enabled: !!token,
  });
}

export function useActivePeriods() {
  return useQuery({
    queryKey: ['spmb', 'periods'],
    queryFn: () => apiClient('/spmb/periods'),
  });
}
