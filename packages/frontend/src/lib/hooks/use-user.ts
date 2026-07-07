'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { useAuthStore } from '../stores/auth.store';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  phone: string | null;
  avatar: string | null;
  createdAt: string;
}

export function useUser() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => apiClient<UserProfile>('/auth/profile', { token: accessToken ?? undefined }),
    enabled: !!accessToken,
    retry: false,
    staleTime: 300_000,
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return () => {
    clearAuth();
    window.location.href = '/login';
  };
}
