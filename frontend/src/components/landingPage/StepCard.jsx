function StepCard({ step, index, staggerIndex }) {
  const Icon = step.icon;

  return (
    <article
      className={`section-reveal stagger-${Math.min(staggerIndex + 1, 3)} relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60`}
    >
      <span className="absolute right-5 top-5 text-xs font-bold text-slate-400">
        0{index + 1}
      </span>
      <div className="inline-flex rounded-xl bg-indigo-100 p-3 text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-xl font-bold text-slate-900">{step.title}</h3>
      <p className="mt-3 text-slate-600">{step.description}</p>
    </article>
  );
}

export default StepCard;
