export const dynamic = 'force-dynamic';

async function getPeriods() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${baseUrl}/spmb/periods`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getPageContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${baseUrl}/cms/pages/spmb`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function SpmbPage() {
  const [periods, page] = await Promise.all([getPeriods(), getPageContent()]);

  return (
    <section className="px-8 py-16 max-w-4xl mx-auto">
      <h1 className="text-5xl mb-6" style={{ fontFamily: 'Prata, serif' }}>
        {page?.title || 'Penerimaan Murid Baru'}
      </h1>

      {page?.content && (
        <div className="prose mb-10" dangerouslySetInnerHTML={{ __html: page.content }} />
      )}

      {!page && (
        <p className="text-lg mb-8" style={{ color: '#666' }}>
          Selamat datang di portal Penerimaan Murid Baru (SPMB).
        </p>
      )}

      {periods.length === 0 ? (
        <div className="p-8 text-center" style={{ background: '#f6f4ee', borderRadius: 50 }}>
          <p style={{ color: '#666' }}>Belum ada periode pendaftaran dibuka.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {periods.map((p: any) => (
            <div key={p.id} className="p-8" style={{ background: '#f6f4ee', borderRadius: 50 }}>
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'Prata, serif' }}>{p.name}</h2>
              <p className="text-sm mb-2" style={{ color: '#666' }}>
                {new Date(p.startDate).toLocaleDateString('id-ID')} — {new Date(p.endDate).toLocaleDateString('id-ID')}
              </p>
              {p.academicYear && <p className="text-xs" style={{ color: '#999' }}>T.A. {p.academicYear.name}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
