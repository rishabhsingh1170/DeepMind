const logos = ["NexaCorp", "Atlas Systems", "BlueGrid", "Coreline", "MediAxis"];

function TrustBanner() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white/70 px-6 py-8 shadow-xl shadow-slate-200/50 backdrop-blur">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Trusted by forward-thinking enterprises
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          {logos.map((logo, index) => (
            <div
              key={logo}
              className={`section-reveal stagger-${Math.min(index + 1, 3)} flex h-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-500`}
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustBanner;
