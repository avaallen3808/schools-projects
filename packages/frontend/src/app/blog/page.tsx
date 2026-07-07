export default function BlogPage() {
  return (
    <section className="px-8 py-16 max-w-4xl mx-auto">
      <h1 className="text-5xl mb-8">Blog</h1>
      <div className="grid gap-6">
        <article className="p-8" style={{ background: '#f6f4ee', borderRadius: 50 }}>
          <h2 className="text-2xl mb-2">Coming Soon</h2>
          <p style={{ color: '#666' }}>Artikel akan segera hadir.</p>
        </article>
      </div>
    </section>
  );
}
