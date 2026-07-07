'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
      <div className="w-full max-w-md p-10 text-center" style={{ background: '#ffffff', borderRadius: 50, boxShadow: 'rgba(0,0,0,0.06) 0px 4px 30px 0px' }}>
        {status === 'loading' && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <p>Memverifikasi email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-2xl mb-2" style={{ fontFamily: 'Prata, serif' }}>Email Terverifikasi</h1>
            <p className="mb-6" style={{ color: '#666' }}>{message}</p>
            <Link href="/login" className="px-6 py-2 text-sm font-medium inline-block"
              style={{ background: '#fdc72f', color: '#000', borderRadius: 100 }}>
              Masuk Sekarang
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-2xl mb-2" style={{ fontFamily: 'Prata, serif' }}>Verifikasi Gagal</h1>
            <p className="mb-6" style={{ color: '#666' }}>{message}</p>
            <Link href="/login" className="underline text-sm" style={{ color: '#07294d' }}>
              Kembali ke Login
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
