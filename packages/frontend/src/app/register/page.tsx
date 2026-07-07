'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '../../lib/hooks/use-register';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { mutate: register, isPending, error } = useRegister();
  const { register: reg, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => register(data);

  return (
    <section className="flex items-center justify-center min-h-[70vh] px-6">
      <div className="w-full max-w-md p-10" style={{ background: '#ffffff', borderRadius: 50, boxShadow: 'rgba(0,0,0,0.06) 0px 4px 30px 0px' }}>
        <h1 className="text-3xl mb-8 text-center font-serif">Daftar</h1>

        {error && (
          <p className="text-sm mb-4 text-center" style={{ color: '#dc2626' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <input
              {...reg('name')}
              placeholder="Nama Lengkap"
              className="w-full px-5 py-3 text-base"
              style={{ border: '1px solid #f6f4ee', borderRadius: 12, color: '#4c4c4c' }}
            />
            {errors.name && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{errors.name.message}</p>}
          </div>

          <div>
            <input
              {...reg('email')}
              type="email"
              placeholder="Email"
              className="w-full px-5 py-3 text-base"
              style={{ border: '1px solid #f6f4ee', borderRadius: 12, color: '#4c4c4c' }}
            />
            {errors.email && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...reg('password')}
              type="password"
              placeholder="Password"
              className="w-full px-5 py-3 text-base"
              style={{ border: '1px solid #f6f4ee', borderRadius: 12, color: '#4c4c4c' }}
            />
            {errors.password && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 text-base font-medium disabled:opacity-50"
            style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}
          >
            {isPending ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-sm mt-6 text-center" style={{ color: '#4c4c4c' }}>
          Sudah punya akun?{' '}
          <Link href="/login" className="underline" style={{ color: '#07294d' }}>Masuk</Link>
        </p>
      </div>
    </section>
  );
}
