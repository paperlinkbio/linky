import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-16 text-slate-950">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Linky
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Your links, beautifully organized.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-600">
          Create and share a rich link-in-bio page from one simple place.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/new"
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create your page
          </Link>
          <Link
            href="/e"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Open editor
          </Link>
        </div>
      </section>
    </main>
  );
}
