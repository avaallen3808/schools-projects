import Link from 'next/link';
import { headers } from 'next/headers';

async function getPage(slug: string) {
  const h = await headers();
  const host = h.get('host') || 'localhost:3000';
  const proto = h.get('x-forwarded-proto') || 'http';
  const res = await fetch(`${proto}://${host}/api/cms/pages/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function PageDetail({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);

  if (!page) {
    return (
      <section className="px-8 py-16 text-center">
        <h1 className="text-4xl mb-4">Halaman tidak ditemukan</h1>
        <Link href="/" className="underline" style={{ color: '#fdc72f' }}>Kembali ke Beranda</Link>
      </section>
    );
  }

  return (
    <section className="px-8 py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl mb-6">{page.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: page.content }} />
    </section>
  );
}
