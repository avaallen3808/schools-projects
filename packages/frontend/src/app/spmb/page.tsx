export default function SpmbPage() {
  return (
    <section className="px-8 py-16 max-w-4xl mx-auto">
      <h1 className="text-5xl mb-6">Penerimaan Murid Baru</h1>
      <p className="text-lg mb-8" style={{ color: '#666' }}>
        Selamat datang di portal Penerimaan Murid Baru (SPMB) Sekolah Nusantara.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-8" style={{ background: '#f6f4ee', borderRadius: 50 }}>
          <h2 className="text-2xl mb-3">Gelombang 1</h2>
          <p style={{ color: '#666' }}>Pendaftaran: 1 Jan - 28 Feb 2026</p>
        </div>
        <div className="p-8" style={{ background: '#f6f4ee', borderRadius: 50 }}>
          <h2 className="text-2xl mb-3">Gelombang 2</h2>
          <p style={{ color: '#666' }}>Pendaftaran: 1 Mar - 30 Apr 2026</p>
        </div>
      </div>
    </section>
  );
}
