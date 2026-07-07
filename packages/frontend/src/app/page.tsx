import Link from 'next/link';

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24" style={{ background: '#ffffff' }}>
      <h1 className="text-5xl md:text-7xl max-w-3xl">
        Foundation of your future starts here
      </h1>
      <p className="mt-6 text-lg" style={{ color: '#666', fontFamily: 'Inter, sans-serif' }}>
        Sistem Penerimaan Murid Baru — Mudah, Transparan, dan Terintegrasi
      </p>
      <div className="mt-10 flex gap-6">
        <Link
          href="/spmb"
          className="inline-block px-8 py-4 text-base font-medium"
          style={{
            background: '#fdc72f',
            color: '#000',
            borderRadius: 100,
          }}
        >
          View Our Programs
        </Link>
        <Link
          href="/login"
          className="inline-block px-8 py-4 text-base font-medium"
          style={{
            background: 'transparent',
            color: '#4c4c4c',
            border: '1px solid #f6f4ee',
            borderRadius: 100,
          }}
        >
          Login
        </Link>
      </div>
    </section>
  );
}
