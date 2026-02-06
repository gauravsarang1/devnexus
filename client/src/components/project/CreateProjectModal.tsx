import React, { useState, useEffect, useRef } from 'react';
import { X, Github, ExternalLink, Loader2, Search, Check, Image as ImageIcon, Upload, RefreshCw } from 'lucide-react';
import { Project, Skill } from '../../types';
import { projectService, CreateProjectInput } from '../../services/projectService';
import { skillService } from '../../services/skillService'; 

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Project & { skills: {
    id: string
  }[]};
}

const DEFAULT_TEMPORARY_LOGO = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=200&h=200&auto=format&fit=crop';

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  // We keep logo in local state even if not in Zod schema yet, 
  // as you likely want to support it eventually.
  const [formData, setFormData] = useState<CreateProjectInput & { logo?: string }>({
    title: '',
    description: '',
    tagline: '',
    slug: '',
    logo: DEFAULT_TEMPORARY_LOGO,
    githubUrl: '',
    previewUrl: '',
    skillIds: [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]); // Array of { id, name }
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initialData;

  // 1. Fetch Skills (Update this to your actual skill fetching service)
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await skillService.getAllSkills()
        setAvailableSkills(res.skills);
      } catch (err) {
        console.error("Failed to fetch skills", err);
      }
    };
    fetchSkills();
  }, []);

  // 2. Initialize Form Data
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        tagline: initialData.tagline || '',
        slug: initialData.slug,
        logo: initialData.logo || DEFAULT_TEMPORARY_LOGO,
        githubUrl: initialData.githubUrl || '',
        previewUrl: initialData.previewUrl || '',
        skillIds: initialData.skills?.map(s => typeof s === 'string' ? s : s.id) || [],
      });
    } else if (isOpen) {
      setFormData({
        title: '',
        description: '',
        tagline: '',
        slug: '',
        logo: DEFAULT_TEMPORARY_LOGO,
        githubUrl: '',
        previewUrl: '',
        skillIds: [],
      });
    }
  }, [initialData, isOpen]);

  // 3. Skill Filtering Logic
  useEffect(() => {
    if (!skillInput.trim()) {
      setFilteredSkills([]);
      return;
    }

    const filtered = availableSkills.filter(
      skill => 
        skill.name.toLowerCase().includes(skillInput.toLowerCase()) &&
        !formData.skillIds?.includes(skill.id)
    );
    setFilteredSkills(filtered);
    setShowSkillDropdown(true);
  }, [skillInput, availableSkills, formData.skillIds]);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSkillDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    setFormData({ ...formData, title, slug });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = (skill: Skill) => {
    if (!formData.skillIds?.includes(skill.id)) {
      setFormData({
        ...formData,
        skillIds: [...(formData.skillIds || []), skill.id],
      });
    }
    setSkillInput('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillId: string) => {
    setFormData({
      ...formData,
      skillIds: formData.skillIds?.filter((id) => id !== skillId) || [],
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSkills.length > 0) {
        addSkill(filteredSkills[0]);
      }
    }
    if (e.key === 'Escape') setShowSkillDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Prepare data for Zod validation:
    // Zod .url().optional() fails on empty strings, convert "" to undefined
    const submissionData: CreateProjectInput = {
        title: formData.title,
        description: formData.description,
        slug: formData.slug,
        tagline: formData.tagline || undefined,
        githubUrl: formData.githubUrl || undefined,
        previewUrl: formData.previewUrl || undefined,
        skillIds: formData.skillIds && formData.skillIds.length > 0 ? formData.skillIds : undefined,
    };

    try {
      if (isEdit && initialData?.id) {
        await projectService.updateProject(initialData.id, submissionData);
      } else {
        await projectService.createProject(submissionData);
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Something went wrong. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Project' : 'Showcase Your Project'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Logo Section */}
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <label className="block text-sm font-semibold text-gray-700">Project Logo</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative group w-32 h-32 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 transition-all"
              >
                {formData.logo ? (
                  <img src={formData.logo} className="w-full h-full object-cover" alt="Logo preview" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase leading-tight">Change Logo</span>
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder="e.g. Awesome SaaS Dashboard"
                  value={formData.title}
                  onChange={handleTitleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  placeholder="A one-sentence elevator pitch"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Slug & URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (Generated)</label>
              <input
                type="text"
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 font-mono text-sm"
                value={formData.slug}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Github className="w-4 h-4 text-gray-500" /> GitHub Repository
              </label>
              <input
                type="url"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
              placeholder="Tell the community about your project..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Skills Section */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Technologies & Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skillIds?.map((id) => {
                const skill = availableSkills.find(s => s.id === id);
                return (
                  <span
                    key={id}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold flex items-center gap-2 group transition-all hover:bg-blue-100"
                  >
                    {skill?.name || 'Loading...'}
                    <button type="button" onClick={() => removeSkill(id)} className="text-blue-400 hover:text-blue-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="relative" ref={dropdownRef}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                placeholder="Search technologies..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSkillDropdown(!!skillInput.trim())}
              />

              {showSkillDropdown && skillInput.trim() !== '' && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 max-h-60 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <span className="font-semibold">{skill.name}</span>
                        <Check className="w-4 h-4 opacity-50" />
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-center text-sm text-gray-500">
                      No matching skills found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-8 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Launch Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};