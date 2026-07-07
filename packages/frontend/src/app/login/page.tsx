'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '../../lib/hooks/use-login';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => login(data);

  return (
    <section className="flex items-center justify-center min-h-[70vh] px-6">
      <div className="w-full max-w-md p-10 bg-bg rounded-card shadow-[0_4px_30px_rgba(0,0,0,0.06)]">
        <h1 className="text-3xl mb-8 text-center">Masuk</h1>

        {error && (
          <p className="text-sm mb-4 text-center text-error">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full px-5 py-3 text-base rounded-xl border border-border focus:border-primary outline-none text-text"
            />
            {errors.email && <p className="text-xs mt-1 text-error">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full px-5 py-3 text-base rounded-xl border border-border focus:border-primary outline-none text-text"
            />
            {errors.password && <p className="text-xs mt-1 text-error">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 text-base font-medium disabled:opacity-50 bg-primary text-text rounded-pill border-none cursor-pointer"
          >
            {isPending ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-sm mt-6 text-center text-text">
          Belum punya akun?{' '}
          <Link href="/register" className="underline text-bg-secondary">Daftar</Link>
        </p>
      </div>
    </section>
  );
}
