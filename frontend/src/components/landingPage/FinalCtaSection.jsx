function FinalCtaSection() {
  return (
    <>
      <section className="px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-12 text-center text-white shadow-2xl shadow-indigo-500/30 sm:px-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to automate your corporate knowledge?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
            Launch DocuMind AI to reduce support overhead, prevent compliance
            mistakes, and empower every employee with secure instant answers.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">
              Let's Start
            </button>
            {/* <button className="rounded-2xl border border-indigo-200/60 bg-indigo-500/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500/35">
              Book a Demo
            </button> */}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <p>
            (c) {new Date().getFullYear()} DocuMind AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-slate-700">
              Privacy
            </a>
            <a href="#" className="transition hover:text-slate-700">
              Terms
            </a>
            <a href="#" className="transition hover:text-slate-700">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default FinalCtaSection;
