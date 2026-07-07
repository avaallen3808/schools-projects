export default function LoginPage() {
  return (
    <section className="flex items-center justify-center min-h-[70vh] px-6">
      <div className="w-full max-w-md p-10" style={{ background: '#ffffff', borderRadius: 50, boxShadow: 'rgba(0,0,0,0.06) 0px 4px 30px 0px' }}>
        <h1 className="text-3xl mb-8 text-center">Masuk</h1>
        <form className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-5 py-3 text-base"
            style={{ border: '1px solid #f6f4ee', borderRadius: 12, color: '#4c4c4c' }}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 text-base"
            style={{ border: '1px solid #f6f4ee', borderRadius: 12, color: '#4c4c4c' }}
          />
          <button
            type="submit"
            className="w-full py-3 text-base font-medium"
            style={{ background: '#fdc72f', color: '#000', borderRadius: 100, border: 'none', cursor: 'pointer' }}
          >
            Masuk
          </button>
        </form>
      </div>
    </section>
  );
}
