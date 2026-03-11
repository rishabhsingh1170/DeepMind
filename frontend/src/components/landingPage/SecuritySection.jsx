import { Shield, ServerCog, DatabaseZap, CheckCircle2 } from "lucide-react";

const securityPoints = [
  "Role-Based Access Control (RBAC) for admins and users.",
  "Enterprise-grade inference powered by the secure Mistral API, ensuring your data is never used for model training.",
  "Encrypted ChromaDB vector storage with tenant-scoped retrieval.",
];

function SecuritySection() {
  return (
    <section id="security" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl bg-slate-950 px-6 py-12 text-slate-100 shadow-2xl shadow-slate-900/40 sm:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="section-reveal">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">
              <Shield className="h-4 w-4" />
              Enterprise Security
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Your Data is not the product.
            </h2>
            <p className="mt-4 max-w-xl text-slate-300">
              DocuMind AI is designed for organizations that need secure data
              handling and answers supported by references.
            </p>

            <ul className="mt-7 space-y-4">
              {securityPoints.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-slate-200"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="section-reveal stagger-1 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <ServerCog className="h-8 w-8 text-indigo-300" />
              <h3 className="mt-4 text-lg font-bold text-white">
                Deployment Flexibility
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Cloud, private VPC, or fully offline environments.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <DatabaseZap className="h-8 w-8 text-indigo-300" />
              <h3 className="mt-4 text-lg font-bold text-white">
                Encrypted Vectors
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Secure storage and audited data access paths.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Built for CIO and IT teams
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Every response can include source citations so your teams can
                verify before acting.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default SecuritySection;
