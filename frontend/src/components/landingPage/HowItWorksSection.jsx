import { Upload, LockKeyhole, MessageSquareQuote } from "lucide-react";

const steps = [
  {
    title: "Admin Uploads Documents",
    description:
      "Ingest HR policies, SOPs, manuals, and team knowledge from approved company sources.",
    icon: Upload,
  },
  {
    title: "System encrypts and vectorizes",
    description:
      "Content is securely processed, embedded, and isolated by tenant for private retrieval.",
    icon: LockKeyhole,
  },
  {
    title: "Employees get instant, cited answers",
    description:
      "Users ask in natural language and receive grounded responses with document references.",
    icon: MessageSquareQuote,
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Three secure steps to enterprise AI answers
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className={`section-reveal stagger-${Math.min(index + 1, 3)} relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60`}
              >
                <span className="absolute right-5 top-5 text-xs font-bold text-slate-400">
                  0{index + 1}
                </span>
                <div className="inline-flex rounded-xl bg-indigo-100 p-3 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-slate-600">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
