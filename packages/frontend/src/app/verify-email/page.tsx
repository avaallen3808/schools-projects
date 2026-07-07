'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token tidak ditemukan');
      return;
    }

    apiClient<{ message: string }>('/auth/verify-email', { method: 'POST', body: { token } })
      .then((res) => {
        setStatus('success');
        setMessage(res.message);
      })
      .catch((err: Error) => {
        setStatus('error');
        setMessage(err.message);
      });
  }, [token]);

  return (
    <section className="flex items-center justify-center min-h-[70vh] px-6">
      <div className="w-full max-w-md p-10 text-center bg-bg rounded-card shadow-[0_4px_30px_rgba(0,0,0,0.06)]">
        {status === 'loading' && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <p>Memverifikasi email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-2xl mb-2">Email Terverifikasi</h1>
            <p className="mb-6 text-text-secondary">{message}</p>
            <Link href="/login" className="px-6 py-2 text-sm font-medium inline-block bg-primary text-text rounded-pill">
              Masuk Sekarang
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-2xl mb-2">Verifikasi Gagal</h1>
            <p className="mb-6 text-text-secondary">{message}</p>
            <Link href="/login" className="underline text-sm text-bg-secondary">
              Kembali ke Login
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
