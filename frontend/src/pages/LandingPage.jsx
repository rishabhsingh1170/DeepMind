import Navbar from "../components/landingPage/Navbar";
import HeroSection from "../components/landingPage/HeroSection";
import TrustBanner from "../components/landingPage/TrustBanner";
import FeaturesSection from "../components/landingPage/FeaturesSection";
import SecuritySection from "../components/landingPage/SecuritySection";
import HowItWorksSection from "../components/landingPage/HowItWorksSection";
import FinalCtaSection from "../components/landingPage/FinalCtaSection";

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <HeroSection />
        {/* <TrustBanner /> */}
        <FeaturesSection />
        <SecuritySection />
        <HowItWorksSection />
        <FinalCtaSection />
      </main>
    </div>
  );
}

export default LandingPage;
