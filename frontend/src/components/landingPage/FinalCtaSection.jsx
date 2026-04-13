import { Link } from "react-router-dom";
import Footer from "./Footer";

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
            <Link
              to="/signup"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              Let's Start
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default FinalCtaSection;
