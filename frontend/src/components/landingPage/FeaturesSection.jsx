import FeatureCard from "./FeatureCard";
import { features } from "./landingPageConstants";

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
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              staggerIndex={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
