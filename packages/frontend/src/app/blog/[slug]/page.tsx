import Link from 'next/link';
import { headers } from 'next/headers';

async function getPost(slug: string) {
  const h = await headers();
  const host = h.get('host') || 'localhost:3000';
  const proto = h.get('x-forwarded-proto') || 'http';
  const res = await fetch(`${proto}://${host}/api/cms/posts/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <section className="px-8 py-16 text-center">
        <h1 className="text-4xl mb-4">Artikel tidak ditemukan</h1>
        <Link href="/blog" className="underline" style={{ color: '#fdc72f' }}>Kembali ke Blog</Link>
      </section>
    );
  }

  return (
    <article className="px-8 py-16 max-w-3xl mx-auto">
      <Link href="/blog" style={{ color: '#666' }}>&larr; Kembali</Link>
      <h1 className="text-4xl mt-6 mb-4">{post.title}</h1>
      <div className="text-sm mb-8" style={{ color: '#666' }}>
        {post.category && <span>Kategori: {post.category.name} · </span>}
        {new Date(post.createdAt).toLocaleDateString('id-ID')}
      </div>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
