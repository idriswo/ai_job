import { memo, useEffect, useState } from 'react';
import { Card } from '../../../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import type { UserInfo, UserProfile, Skill, Language } from '../types';
import { Bookmark, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillLanguageService } from '../../../../services/skillLanguage.service';
import { toast } from 'sonner';

interface Props {
  currentUserInfo: UserInfo | null;
  currentUserProfile: UserProfile | null;
  currentUserId: number | null;
}

export const CandidateLeftSidebar = memo(({ currentUserInfo, currentUserProfile, currentUserId }: Props) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');

  const [languages, setLanguages] = useState<Language[]>([]);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [newLanguageName, setNewLanguageName] = useState('');

  useEffect(() => {
    if (currentUserId) {
      skillLanguageService.fetchSkills(currentUserId).then(res => setSkills([...res].reverse())).catch(console.error);
      skillLanguageService.fetchLanguages(currentUserId).then(res => setLanguages([...res].reverse())).catch(console.error);
    }
  }, [currentUserId]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      const data = await skillLanguageService.addSkill(newSkillName.trim());
      const newSkill = { id: data?.id || data?.data?.id || Date.now(), name: data?.name || data?.data?.name || newSkillName.trim() };
      setSkills(prev => [newSkill, ...prev]);
      setNewSkillName('');
      setIsAddingSkill(false);
      toast.success("Skill added!");
    } catch (e) {
      toast.error("Failed to add skill");
    }
  };

  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLanguageName.trim()) return;
    try {
      const data = await skillLanguageService.addLanguage(newLanguageName.trim());
      const newLang = { id: data?.id || data?.data?.id || Date.now(), name: data?.name || data?.data?.name || newLanguageName.trim() };
      setLanguages(prev => [newLang, ...prev]);
      setNewLanguageName('');
      setIsAddingLanguage(false);
      toast.success("Language added!");
    } catch (e) {
      toast.error("Failed to add language");
    }
  };

  return (
    <aside className="hidden md:flex flex-col md:col-span-3 space-y-[24px]">
      <Card className="rounded-2xl shadow-lg shadow-slate-200/40 border-slate-200 transition-all duration-200 overflow-hidden">
        <div 
          className="h-[64px] bg-[#d3e4fe] relative bg-cover bg-center"
          style={{ backgroundImage: currentUserProfile?.bannerUrl ? `url(${currentUserProfile.bannerUrl})` : undefined }}
        >
          <div className="absolute -bottom-[40px] left-1/2 -translate-x-1/2">
            <Avatar className="w-[80px] h-[80px] border-[4px] border-[#ffffff] bg-slate-100">
              <AvatarImage src={currentUserProfile?.avatarUrl || ''} alt={currentUserInfo?.fullName || 'User'} className="object-cover" />
              <AvatarFallback>{(currentUserInfo?.fullName || 'U').charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="pt-[48px] pb-[24px] px-[24px] text-center border-b-[1px] border-slate-200">
          <h2 className="text-[20px] leading-[28px] font-[600] text-slate-900">{currentUserInfo?.fullName || 'User'}</h2>
          <p className="text-[14px] leading-[20px] text-slate-500 mt-[4px]">{currentUserProfile?.headline || 'No headline set'}</p>
        </div>
        <div className="p-[16px] space-y-[8px]">
          <div className="flex justify-between items-center group cursor-pointer">
            <span className="text-[12px] leading-[16px] font-[500] text-slate-500 group-hover:text-indigo-600 transition-colors">Connections</span>
            <span className="text-[12px] leading-[16px] font-[700] text-indigo-600">1,429</span>
          </div>
          <div className="flex justify-between items-center group cursor-pointer">
            <span className="text-[12px] leading-[16px] font-[500] text-slate-500 group-hover:text-indigo-600 transition-colors">Profile viewers</span>
            <span className="text-[12px] leading-[16px] font-[700] text-indigo-600">342</span>
          </div>
        </div>
        <div className="border-t-[1px] border-slate-200 p-[16px]">
          <div className="flex items-center gap-[8px] cursor-pointer group">
            <Bookmark className="w-[16px] h-[16px] text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span className="text-[12px] leading-[16px] font-[600] text-slate-600 group-hover:text-indigo-600 transition-colors">My items</span>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl p-[16px] shadow-lg shadow-slate-200/40 border-slate-200 transition-all duration-200">
        <div className="flex justify-between items-center mb-[12px]">
          <h3 className="text-[14px] leading-[20px] font-[600] text-slate-900">Skills</h3>
          <button onClick={() => setIsAddingSkill(!isAddingSkill)} className="w-[24px] h-[24px] rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
            <Plus className="w-[16px] h-[16px]" />
          </button>
        </div>
        
        <AnimatePresence>
          {isAddingSkill && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }} 
              onSubmit={handleAddSkill} 
              className="mb-[12px] flex gap-[8px] overflow-hidden"
            >
              <input 
                type="text" 
                value={newSkillName} 
                onChange={(e) => setNewSkillName(e.target.value)} 
                placeholder="E.g. TypeScript" 
                className="flex-1 border border-slate-200 rounded-lg px-[12px] py-[6px] text-[12px] focus:outline-none focus:border-indigo-600"
                autoFocus
              />
              <button type="submit" disabled={!newSkillName.trim()} className="bg-indigo-600 text-white px-[12px] py-[6px] rounded-lg text-[12px] font-medium disabled:opacity-50">
                Add
              </button>
              <button type="button" onClick={() => setIsAddingSkill(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-[16px] h-[16px]" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-[6px]">
          {skills.map((skill: Skill) => (
            <span key={skill.id} className="text-[12px] px-[10px] py-[4px] bg-slate-100 text-slate-600 rounded-lg font-medium border border-slate-200/60 flex items-center gap-[4px]">
              {skill.name}
            </span>
          ))}
          {skills.length === 0 && !isAddingSkill && (
            <span className="text-[12px] text-slate-400">No skills added yet.</span>
          )}
        </div>
      </Card>

      <Card className="rounded-2xl p-[16px] shadow-lg shadow-slate-200/40 border-slate-200 transition-all duration-200">
        <div className="flex justify-between items-center mb-[12px]">
          <h3 className="text-[14px] leading-[20px] font-[600] text-slate-900">Languages</h3>
          <button onClick={() => setIsAddingLanguage(!isAddingLanguage)} className="w-[24px] h-[24px] rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
            <Plus className="w-[16px] h-[16px]" />
          </button>
        </div>
        
        <AnimatePresence>
          {isAddingLanguage && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }} 
              onSubmit={handleAddLanguage} 
              className="mb-[12px] flex gap-[8px] overflow-hidden"
            >
              <input 
                type="text" 
                value={newLanguageName} 
                onChange={(e) => setNewLanguageName(e.target.value)} 
                placeholder="E.g. English" 
                className="flex-1 border border-slate-200 rounded-lg px-[12px] py-[6px] text-[12px] focus:outline-none focus:border-indigo-600"
                autoFocus
              />
              <button type="submit" disabled={!newLanguageName.trim()} className="bg-indigo-600 text-white px-[12px] py-[6px] rounded-lg text-[12px] font-medium disabled:opacity-50">
                Add
              </button>
              <button type="button" onClick={() => setIsAddingLanguage(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-[16px] h-[16px]" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-[6px]">
          {languages.map((lang: Language) => (
            <span key={lang.id} className="text-[12px] px-[10px] py-[4px] bg-slate-100 text-slate-600 rounded-lg font-medium border border-slate-200/60 flex items-center gap-[4px]">
              {lang.name}
            </span>
          ))}
          {languages.length === 0 && !isAddingLanguage && (
            <span className="text-[12px] text-slate-400">No languages added yet.</span>
          )}
        </div>
      </Card>
    </aside>
  );
});
