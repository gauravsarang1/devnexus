
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardHero from '../components/DashboardHero';
import ResumeActivity from '../components/ResumeActivity';
import SkillDiscovery from '../components/SkillDiscovery';
import SuggestedMatches from '../components/SuggestedMatches';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import AICoach from '../components/AICoach';
import { userService } from '../services/userService';
import { Loader2 } from 'lucide-react';

interface HomePageProps {
  navigate: (to: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await userService.getDashboardActivity();
        if (res) {
          setActivity(res);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar navigate={navigate} />
      <main className="flex-grow pb-24 md:pb-0">
        <DashboardHero />
        {activity ? (
          <>
            <ResumeActivity activity={activity} navigate={navigate} />
            <SkillDiscovery skills={activity.trendingSkills} navigate={navigate} />
            <SuggestedMatches suggestions={activity.suggestions} navigate={navigate} />
          </>
        ) : (
          <EmptyState 
            title="Start your journey" 
            desc="Explore skills and find your first swap partner to see your dashboard come to life." 
            ctaText="Find Partners"
          />
        )}
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav navigate={navigate} />
      <AICoach />
    </div>
  );
};

export default HomePage;
