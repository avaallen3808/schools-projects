import Link from 'next/link';

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24">
      <h1 className="text-5xl md:text-7xl max-w-3xl">
        Foundation of your future starts here
      </h1>
      <p className="mt-6 text-lg text-text-secondary">
        Sistem Penerimaan Murid Baru — Mudah, Transparan, dan Terintegrasi
      </p>
      <div className="mt-10 flex gap-6">
        <Link
          href="/spmb"
          className="inline-block px-8 py-4 text-base font-medium bg-primary text-text rounded-pill"
        >
          View Our Programs
        </Link>
        <Link
          href="/login"
          className="inline-block px-8 py-4 text-base font-medium text-text border border-border rounded-pill"
        >
          Login
        </Link>
      </div>
    </section>
  );
}
