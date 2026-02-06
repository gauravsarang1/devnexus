
import React from 'react';
import { FeedType as ProjectFeedTab } from '../../types';
import { FeedType } from '@/src/types/index';

interface ProjectFeedTabsProps {
  activeTab: ProjectFeedTab;
  onTabChange: (tab: ProjectFeedTab) => void;
}

export const ProjectFeedTabs: React.FC<ProjectFeedTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: ProjectFeedTab; label: string }[] = [
    { id: 'global', label: 'Global' },
    { id: 'personalized', label: 'For You' },
    { id: 'trending', label: 'Trending' },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
