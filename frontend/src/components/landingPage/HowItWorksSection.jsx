import StepCard from "./StepCard";
import { steps } from "./landingPageConstants";

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
          {steps.map((step, index) => (
            <StepCard
              key={step.title}
              step={step}
              index={index}
              staggerIndex={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
