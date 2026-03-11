import { ShieldCheck, Crosshair, FolderUp } from "lucide-react";

const features = [
  {
    title: "Multi-Tenant Data Isolation",
    description:
      "Company A can never access Company B knowledge because retrieval is hard-filtered by tenant metadata before generation.",
    icon: ShieldCheck,
  },
  {
    title: "Zero Hallucinations",
    description:
      "A strict similarity threshold blocks weak matches, so the assistant answers only when grounded in trusted enterprise documents.",
    icon: Crosshair,
  },
  {
    title: "Admin-Controlled Knowledge Base",
    description:
      "Securely upload and manage document folders manually. Ensure your AI only answers from verified, admin-approved company data.",
    icon: FolderUp,
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
            Core Capabilities
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Built for enterprise-grade trust and speed
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className={`section-reveal stagger-${Math.min(idx + 1, 3)} rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60`}
              >
                <div className="mb-4 inline-flex rounded-xl bg-indigo-100 p-3 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-slate-600">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
