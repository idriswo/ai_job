import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Building2, Globe, FileText, Briefcase, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { axiosRequest } from '../../utils/token';

const OrganizationProfile = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    location: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosRequest.get('/api/Organization/mine');
        const orgs = Array.isArray(res.data) ? res.data : [res.data];
        
        if (orgs.length > 0 && orgs[0] && orgs[0].name) {
          setHasProfile(true);
          setProfileId(orgs[0].id);
          setFormData({
            name: orgs[0].name || '',
            description: orgs[0].description || '',
            website: orgs[0].website || '',
            industry: orgs[0].industry || '',
            location: orgs[0].location || ''
          });
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!formData.name) return toast.error('Company name is required');
    setIsSaving(true);
    try {
      if (hasProfile && profileId) {
        await axiosRequest.put(`/api/Organization/${profileId}`, formData);
        toast.success('Profile updated successfully!');
      } else {
        const res = await axiosRequest.post('/api/Organization', formData);
        setHasProfile(true);
        setProfileId(res.data?.id);
        toast.success('Company profile created!');
      }
    } catch (error: unknown) {
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <main className="max-w-[800px] mx-auto px-[24px] py-[40px] min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-[32px]">
          <h1 className="text-[28px] font-[700] text-slate-900">{hasProfile ? 'Company Profile' : 'Create Company Profile'}</h1>
          <p className="text-[15px] text-slate-500 mt-[4px]">Manage your organization details to attract the best talent.</p>
        </div>

        <Card className="rounded-3xl shadow-sm border-slate-200 overflow-hidden bg-white">
          <div className="h-[120px] bg-gradient-to-r from-indigo-500 to-indigo-700 relative">
            <button className="absolute bottom-[16px] right-[16px] bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-[12px] py-[6px] rounded-xl text-[13px] font-[600] flex items-center gap-[8px] transition-colors">
              <Camera className="w-[16px] h-[16px]" /> Edit Cover
            </button>
          </div>
          
          <div className="px-[32px] pb-[32px]">
            <div className="relative flex justify-between items-end mb-[32px]">
              <div className="w-[100px] h-[100px] bg-white rounded-2xl shadow-sm border-[4px] border-white absolute -top-[50px] flex items-center justify-center overflow-hidden group cursor-pointer">
                <Building2 className="w-[40px] h-[40px] text-indigo-600 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-[24px] h-[24px] text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-[24px] pt-[20px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                <div className="space-y-[8px]">
                  <label className="text-[14px] font-[600] text-slate-700 flex items-center gap-[8px]">
                    <Building2 className="w-[16px] h-[16px] text-slate-400" /> Company Name *
                  </label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-[16px] py-[12px] text-[15px] focus:outline-none focus:border-indigo-600 transition-colors" placeholder="e.g. TechCorp Solutions" />
                </div>
                
                <div className="space-y-[8px]">
                  <label className="text-[14px] font-[600] text-slate-700 flex items-center gap-[8px]">
                    <Briefcase className="w-[16px] h-[16px] text-slate-400" /> Industry
                  </label>
                  <input value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-[16px] py-[12px] text-[15px] focus:outline-none focus:border-indigo-600 transition-colors" placeholder="e.g. Software Development" />
                </div>
              </div>

              <div className="space-y-[8px]">
                <label className="text-[14px] font-[600] text-slate-700 flex items-center gap-[8px]">
                  <FileText className="w-[16px] h-[16px] text-slate-400" /> About Company
                </label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-[16px] py-[12px] text-[15px] focus:outline-none focus:border-indigo-600 transition-colors min-h-[120px] resize-none" placeholder="Describe your company's mission and culture..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                <div className="space-y-[8px]">
                  <label className="text-[14px] font-[600] text-slate-700 flex items-center gap-[8px]">
                    <Globe className="w-[16px] h-[16px] text-slate-400" /> Website
                  </label>
                  <input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-[16px] py-[12px] text-[15px] focus:outline-none focus:border-indigo-600 transition-colors" placeholder="https://www.example.com" />
                </div>
                <div className="space-y-[8px]">
                  <label className="text-[14px] font-[600] text-slate-700 flex items-center gap-[8px]">
                    <Building2 className="w-[16px] h-[16px] text-slate-400" /> Headquarters Location
                  </label>
                  <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-[16px] py-[12px] text-[15px] focus:outline-none focus:border-indigo-600 transition-colors" placeholder="e.g. Dushanbe, Tajikistan" />
                </div>
              </div>
            </div>

            <div className="mt-[32px] pt-[24px] border-t border-slate-100 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-[32px] py-[24px] text-[15px] font-[600] shadow-md shadow-indigo-600/20 disabled:opacity-70 transition-all">
                {isSaving ? <Loader2 className="w-[20px] h-[20px] animate-spin" /> : (hasProfile ? 'Save Changes' : 'Create Profile')}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </main>
  );
});

export default OrganizationProfile;
