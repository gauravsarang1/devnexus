
import React, { useEffect, useState } from 'react';
import DashboardHero from '../components/DashboardHero';
import ResumeActivity from '../components/ResumeActivity';
import SkillDiscovery from '../components/SkillDiscovery';
import SuggestedMatches from '../components/SuggestedMatches';
import MobileNav from '../components/MobileNav';
import EmptyState from '../components/EmptyState';
import AICoach from '../components/AICoach';
import { userService } from '../services/userService';
import { Loader2 } from 'lucide-react';
import { useSelector, UseSelector } from 'react-redux';
import { RootState } from '../store';

interface HomePageProps {
  navigate: (to: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<any>(null);

  const currentUser = useSelector((state: RootState) => state.auth.user);

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
    <>
      <main className="flex-grow pb-24 md:pb-0">
        <DashboardHero currentUser={currentUser}/>
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
      <MobileNav navigate={navigate} />
      <AICoach user={currentUser} />
    </>
  );
};

export default HomePage;
