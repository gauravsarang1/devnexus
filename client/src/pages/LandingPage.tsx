
import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import LandingHero from '../components/LandingHero';
import ProblemSolution from '../components/ProblemSolution';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Audience from '../components/Audience';
import TrustSection from '../components/TrustSection';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import LandingAIAssistant from '../components/LandingAIAssistant';

interface LandingPageProps {
  navigate: (to: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar navigate={navigate} />
      <LandingHero navigate={navigate} />
      <ProblemSolution />
      <HowItWorks />
      <Features />
      <Audience />
      <TrustSection />
      <FinalCTA navigate={navigate} />
      <Footer />
      <LandingAIAssistant />
    </div>
  );
};

export default LandingPage;
