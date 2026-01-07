import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, Send, Users, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import MatchCard from '../components/Matches/MatchCard';
import { matchService } from '../services/matchService';
import { Match } from '../types';
import { toast } from 'sonner';

const MatchesPage: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'Incoming' | 'Sent' | 'Active'>('Incoming');
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingMore, hasMore]);

  const fetchMatches = async (pageNum: number, isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const res = await matchService.getMatches(activeTab, pageNum, 10);
      setMatches(prev => pageNum === 1 ? res.matches : [...prev, ...res.matches]);
      setHasMore(res.pagination.hasNextPage);
    } catch (err) { 
      toast.error("Failed to load matches"); 
    } finally { 
      setIsLoading(false); 
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setMatches([]);
    fetchMatches(1, true);
  }, [activeTab]);

  useEffect(() => {
    if (page > 1) {
      fetchMatches(page);
    }
  }, [page]);

  const handleUpdateStatus = async (matchId: string, status: 'ACCEPTED' | 'DECLINED') => {
    try {
      await matchService.updateStatus(matchId, status);
      toast.success(`Request ${status.toLowerCase()}!`);
      // Reset and refresh
      setPage(1);
      fetchMatches(1, true);
    } catch (err) { toast.error("Action failed"); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="hidden md:flex">
        <Navbar navigate={navigate}/>
      </div>
      <main className="flex-grow pt-5 md:pt-[120px] pb-24 md:pb-12 max-w-5xl mx-auto w-full px-4 md:px-6">
        <header className="mb-6 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">My Swaps</h1>
          <p className="text-slate-500 font-medium">Track your peer collaborations.</p>
        </header>

        <div className="flex p-1.5 bg-slate-100 rounded-3xl mb-12 w-full md:w-fit overflow-x-auto scrollbar-hide">
          {(['Incoming', 'Sent', 'Active'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
              {tab === 'Incoming' && <Inbox size={16} />}
              {tab === 'Sent' && <Send size={16} />}
              {tab === 'Active' && <Users size={16} />}
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div> : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.length > 0 ? matches.map((m) => (
                <MatchCard key={m.id} match={m} activeTab={activeTab} onStatusUpdate={handleUpdateStatus} onNavigate={navigate} />
              )) : (
                <div className="col-span-full py-20 text-center opacity-50"><Inbox size={48} className="mx-auto mb-4" /><p className="font-bold">No {activeTab.toLowerCase()} swaps found.</p></div>
              )}
            </div>
            
            <div ref={lastElementRef} className="h-10 flex items-center justify-center mt-8">
               {isFetchingMore && <Loader2 className="animate-spin text-blue-600" size={24} />}
               {!hasMore && matches.length > 0 && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">End of results</p>}
            </div>
          </>
        )}
      </main>
      <div className="hidden md:block"><Footer /></div>
      <MobileNav navigate={navigate} />
    </div>
  );
};

export default MatchesPage;