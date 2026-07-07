'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: string };
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiClient<LoginResponse>('/auth/login', { method: 'POST', body: data }),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push('/admin');
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  return { ...mutation, error };
}
