import Link from 'next/link';

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-5" style={{ background: '#ffffff', borderBottom: '1px solid #f6f4ee' }}>
      <Link href="/" className="text-xl font-semibold" style={{ color: '#07294d', fontFamily: 'Prata, serif' }}>
        CMS Sekolah
      </Link>
      <nav className="flex gap-8">
        <Link href="/" className="text-sm" style={{ color: '#4c4c4c' }}>Beranda</Link>
        <Link href="/blog" className="text-sm" style={{ color: '#4c4c4c' }}>Blog</Link>
        <Link href="/spmb" className="text-sm" style={{ color: '#4c4c4c' }}>SPMB</Link>
      </nav>
      <Link
        href="/login"
        className="text-sm px-5 py-2"
        style={{ background: '#fdc72f', color: '#000', borderRadius: 100 }}
      >
        Masuk
      </Link>
    </header>
  );
}
