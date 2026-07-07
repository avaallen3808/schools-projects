import Link from 'next/link';

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
      <h1 className="text-5xl mb-6">
        {page?.title || 'Penerimaan Murid Baru'}
      </h1>

      {page?.content && (
        <div className="prose mb-10" dangerouslySetInnerHTML={{ __html: page.content }} />
      )}

      {!page && (
        <p className="text-lg mb-8 text-text-secondary">
          Selamat datang di portal Penerimaan Murid Baru (SPMB).
        </p>
      )}

      {/* Steps info */}
      <div className="grid gap-4 mb-10 md:grid-cols-4">
        {[
          { step: '1', title: 'Daftar Akun', desc: 'Buat akun siswa atau orangtua' },
          { step: '2', title: 'Pilih Program', desc: 'Pilih cabang dan jurusan' },
          { step: '3', title: 'Submit Berkas', desc: 'Unggah dokumen persyaratan' },
          { step: '4', title: 'Pengumuman', desc: 'Cek hasil seleksi online' },
        ].map((s) => (
          <div key={s.step} className="p-5 text-center bg-surface rounded-card">
            <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center font-semibold text-sm bg-primary text-text rounded-pill">
              {s.step}
            </div>
            <p className="text-sm font-medium mb-1">{s.title}</p>
            <p className="text-xs text-text-secondary">{s.desc}</p>
          </div>
        ))}
      </div>

      {periods.length === 0 ? (
        <div className="p-8 text-center bg-surface rounded-card">
          <p className="text-text-secondary">Belum ada periode pendaftaran dibuka.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {periods.map((p: any) => (
            <div key={p.id} className="p-8 bg-surface rounded-card">
              <h2 className="text-2xl mb-2">{p.name}</h2>
              <p className="text-sm mb-2 text-text-secondary">
                {new Date(p.startDate).toLocaleDateString('id-ID')} — {new Date(p.endDate).toLocaleDateString('id-ID')}
              </p>
              {p.academicYear && <p className="text-xs text-text-secondary">T.A. {p.academicYear.name}</p>}
              {p._count?.offerings != null && p._count.offerings > 0 && (
                <p className="text-xs text-text-secondary">{p._count.offerings} program tersedia</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-10">
        <Link
          href="/spmb/apply"
          className="inline-block px-8 py-3 text-base font-medium bg-primary text-text rounded-pill"
        >
          Daftar Sekarang
        </Link>
        <div className="mt-4">
          <Link href="/spmb/status" className="text-sm underline text-text">
            Sudah mendaftar? Cek status
          </Link>
        </div>
      </div>
    </section>
  );
}
