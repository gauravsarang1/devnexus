import React, { useState, useEffect, useRef } from 'react';
import { User, Folder, Search, AtSign, X } from 'lucide-react';
import { Mention } from '../../types';
import MentionSearchList from './MentionSearchList';
import { userService } from '../../services/userService';
import { projectService } from '../../services/projectService';

interface MentionPickerProps {
  onAdd: (mention: Mention) => void;
}

const MentionPicker: React.FC<MentionPickerProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'user' | 'project'>('user');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestRef = useRef(0);

  /* ---------------- Search Effect ---------------- */

  useEffect(() => {
    if (!isOpen) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const run = async (search?: string) => {
      const reqId = ++requestRef.current;
      setLoading(true);

      try {
        if (type === 'user') {
          const res = await userService.searchUsers({
            query: search ?? '',
            page: 1,
            limit: 10,
          });

          if (reqId === requestRef.current) {
            setResults(res.users);
          }
        } else {
          const res = await projectService.getAllProjects({
            search: search ?? '',
            page: 1,
            limit: 10,
          });

          if (reqId === requestRef.current) {
            setResults(res.projects);
          }
        }
      } finally {
        if (reqId === requestRef.current) {
          setLoading(false);
        }
      }
    };

    // 🔥 EMPTY QUERY = DEFAULT DATA
    if (!query.trim()) {
      run();
      return;
    }

    // 🔥 SEARCH WITH DEBOUNCE
    timeoutRef.current = setTimeout(() => {
      run(query);
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, type, isOpen]);

  /* ---------------- Select ---------------- */

  const handleSelect = (item: any) => {
    onAdd({
      id: item.id,
      name: item.name || item.title,
      avatar: item.avatar || item.logo?.url || null,
      uId: item.uId || item.slug,
      type,
    });

    setQuery('');
    setIsOpen(false);
  };

  /* ---------------- ESC Close ---------------- */

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  /* ---------------- UI (UNCHANGED) ---------------- */

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-full transition-all ${isOpen
            ? 'bg-blue-600 text-white shadow-lg scale-110'
            : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
          }`}
      >
        <AtSign className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.18)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                  <AtSign className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">
                  Mention Someone
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              {/* Type Switcher */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-[1.5rem] mb-6">
                <button
                  onClick={() => setType('user')}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-[1.2rem] text-xs font-black ${type === 'user'
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50'
                      : 'text-slate-500'
                    }`}
                >
                  <User className="w-4 h-4" />
                  Users
                </button>
                <button
                  onClick={() => setType('project')}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-[1.2rem] text-xs font-black ${type === 'project'
                      ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50'
                      : 'text-slate-500'
                    }`}
                >
                  <Folder className="w-4 h-4" />
                  Projects
                </button>
              </div>

              {/* Search */}
              <div className="relative flex items-center bg-white border-2 border-slate-100 rounded-2xl px-5 py-4">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder={`Search for a ${type}...`}
                  className="bg-transparent w-full outline-none font-bold"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[40vh] min-h-[250px] overflow-y-auto border-t bg-white">
              <MentionSearchList
                results={results}
                isLoading={loading}
                onSelect={handleSelect}
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 text-sm font-black text-slate-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentionPicker;
