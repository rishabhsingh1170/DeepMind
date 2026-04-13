function FeatureCard({ feature, staggerIndex }) {
  const Icon = feature.icon;

  return (
    <article
      className={`section-reveal stagger-${Math.min(staggerIndex + 1, 3)} rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60`}
    >
      <div className="mb-4 inline-flex rounded-xl bg-indigo-100 p-3 text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
      <p className="mt-3 text-slate-600">{feature.description}</p>
    </article>
  );
}

export default FeatureCard;
