
import React, { useEffect, useState } from 'react';
import DashboardHero from '../components/DashboardHero';
import ResumeActivity from '../components/ResumeActivity';
import SkillDiscovery from '../components/SkillDiscovery';
import SuggestedMatches from '../components/SuggestedMatches';
import MobileNav from '../components/MobileNav';
import EmptyState from '../components/EmptyState';
import AICoach from '../components/AICoach';
import { userService } from '../services/userService';
import { useSelector, } from 'react-redux';
import { RootState } from '../store';
import HomeSkeleton from '../components/skeleton/HomeSkeleton';

interface HomePageProps {
  navigate: (to: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [activity, setActivity] = useState<any>(null);
  const [isActivityLoading, setIsActivityLoading] = useState(false);

  const {user:currentUser, isLoading} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadData = async () => {
      setIsActivityLoading(true);
      try {
        const res = await userService.getDashboardActivity();
        if (res) {
          setActivity(res);
        }
      } finally {
        setIsActivityLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <main className="grow pb-24 md:pb-0">
        <DashboardHero currentUser={currentUser}/>
          <>
            <ResumeActivity activity={activity} navigate={navigate} user={currentUser}/>
            <SkillDiscovery skills={activity?.trendingSkills} navigate={navigate}/>
            <SuggestedMatches suggestions={activity?.suggestions} navigate={navigate}/>
            {!isActivityLoading && Object.keys(activity || {}).length === 0 && (
              <EmptyState
                title="No Activity Yet"
                desc="Explore skills and connect with others to get started!"
              />
            )}
          </>
      </main>
      <MobileNav navigate={navigate} />
      <AICoach user={currentUser} />
    </>
  );
};

export default HomePage;
