import Link from 'next/link';

async function getPosts(page = 1) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${baseUrl}/cms/posts?page=${page}&limit=12`, { cache: 'no-store' });
    if (!res.ok) return { data: [], meta: { total: 0, page: 1, limit: 12 } };
    return res.json();
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: 12 } };
  }
}

export default async function BlogPage() {
  const { data: posts, meta } = await getPosts();

  return (
    <section className="px-8 py-16 max-w-5xl mx-auto">
      <h1 className="text-5xl mb-8">Blog</h1>

      {posts.length === 0 ? (
        <div className="p-8 text-center bg-surface rounded-card">
          <p className="text-text-secondary">Belum ada artikel.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block p-6 bg-surface rounded-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2 className="text-xl mb-2">{post.title}</h2>
              {post.excerpt && <p className="text-sm mb-3 text-text-secondary">{post.excerpt}</p>}
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                {post.category && <span>{post.category.name}</span>}
                <span>{new Date(post.createdAt).toLocaleDateString('id-ID')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {meta.total > meta.limit && (
        <div className="flex justify-center gap-4 mt-10">
          {Array.from({ length: Math.ceil(meta.total / meta.limit) }, (_, i) => (
            <Link key={i} href={`/blog?page=${i + 1}`}
              className={`px-4 py-2 text-sm rounded-full ${meta.page === i + 1 ? 'bg-primary text-text font-bold' : 'bg-surface text-text'}`}>
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
