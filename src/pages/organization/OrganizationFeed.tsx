import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, Briefcase, TrendingUp, Building2, Loader2 } from 'lucide-react';
import { axiosRequest } from '../../utils/token';

const OrganizationFeed = memo(() => {
  const [stats] = useState({
    activeJobs: 12,
    totalApplicants: 145,
    profileViews: 892
  });

  const [orgProfile, setOrgProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosRequest.get('/api/Organization/mine');
        const orgs = Array.isArray(res.data) ? res.data : [res.data];
        if (orgs.length > 0) {
          setOrgProfile(orgs[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <main className="max-w-[1400px] mx-auto px-[24px] py-[32px] grid grid-cols-1 lg:grid-cols-12 gap-[24px] bg-[#f8f9ff] min-h-screen">
      <aside className="lg:col-span-3 space-y-[24px]">
        <Card className="rounded-2xl shadow-sm border-slate-200 overflow-hidden">
          <div className="h-[80px] bg-indigo-600"></div>
          <div className="px-[20px] pb-[20px] relative">
            <div className="w-[64px] h-[64px] bg-white rounded-xl shadow-sm border-2 border-white absolute -top-[32px] flex items-center justify-center overflow-hidden">
              <Building2 className="w-[32px] h-[32px] text-indigo-600" />
            </div>
            <div className="pt-[40px]">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              ) : orgProfile ? (
                <>
                  <h2 className="text-[18px] font-[700] text-slate-900">{orgProfile.name}</h2>
                  <p className="text-[13px] text-slate-500 mt-[4px]">{orgProfile.industry || orgProfile.description || 'Add your company info'}</p>
                </>
              ) : (
                <>
                  <h2 className="text-[18px] font-[700] text-slate-900">No Company Profile</h2>
                  <p className="text-[13px] text-slate-500 mt-[4px]">Please create a profile</p>
                </>
              )}
            </div>
          </div>
          <div className="border-t border-slate-100 p-[20px] space-y-[16px]">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-500 font-[500]">Profile Views</span>
              <span className="text-[13px] font-[600] text-indigo-600">{stats.profileViews}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-500 font-[500]">Followers</span>
              <span className="text-[13px] font-[600] text-indigo-600">4,291</span>
            </div>
          </div>
        </Card>
      </aside>

      <section className="lg:col-span-6 space-y-[24px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-[16px]">
          <Card className="p-[16px] rounded-2xl border-transparent shadow-sm bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-100 text-[12px] font-[500] uppercase tracking-wider">Active Jobs</p>
                <h3 className="text-[28px] font-[700] mt-[4px]">{stats.activeJobs}</h3>
              </div>
              <div className="p-[8px] bg-white/20 rounded-xl">
                <Briefcase className="w-[20px] h-[20px]" />
              </div>
            </div>
          </Card>
          
          <Card className="p-[16px] rounded-2xl border-transparent shadow-sm bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-100 text-[12px] font-[500] uppercase tracking-wider">Applicants</p>
                <h3 className="text-[28px] font-[700] mt-[4px]">{stats.totalApplicants}</h3>
              </div>
              <div className="p-[8px] bg-white/20 rounded-xl">
                <Users className="w-[20px] h-[20px]" />
              </div>
            </div>
          </Card>

          <Card className="p-[16px] rounded-2xl border-transparent shadow-sm bg-gradient-to-br from-amber-500 to-amber-700 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-amber-100 text-[12px] font-[500] uppercase tracking-wider">Engagement</p>
                <h3 className="text-[28px] font-[700] mt-[4px]">+24%</h3>
              </div>
              <div className="p-[8px] bg-white/20 rounded-xl">
                <TrendingUp className="w-[20px] h-[20px]" />
              </div>
            </div>
          </Card>
        </motion.div>

        <Card className="p-[24px] rounded-2xl shadow-sm border-slate-200">
          <div className="flex items-center gap-[12px] border-b border-slate-100 pb-[16px] mb-[16px]">
             <div className="w-[40px] h-[40px] bg-slate-100 rounded-full flex items-center justify-center">
               <Building2 className="w-[20px] h-[20px] text-slate-500" />
             </div>
             <input type="text" placeholder="Share an update about your company..." className="flex-1 bg-transparent text-[14px] outline-none" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-[16px]">
              <button className="text-[13px] font-[600] text-slate-500 hover:text-indigo-600 transition-colors">Media</button>
              <button className="text-[13px] font-[600] text-slate-500 hover:text-indigo-600 transition-colors">Event</button>
              <button className="text-[13px] font-[600] text-slate-500 hover:text-indigo-600 transition-colors">Article</button>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-[24px] font-[600]">Post</Button>
          </div>
        </Card>
      </section>

      <aside className="lg:col-span-3 space-y-[24px]">
        <Card className="p-[20px] rounded-2xl shadow-sm border-slate-200">
           <h3 className="text-[15px] font-[600] text-slate-900 mb-[16px]">Recent Activity</h3>
           <div className="space-y-[16px]">
             {[1,2,3].map(i => (
               <div key={i} className="flex gap-[12px]">
                 <div className="w-[8px] h-[8px] rounded-full bg-indigo-500 mt-[6px]"></div>
                 <div>
                   <p className="text-[13px] text-slate-700">New application received for <span className="font-[600]">Senior Frontend Engineer</span></p>
                   <span className="text-[11px] text-slate-400">2 hours ago</span>
                 </div>
               </div>
             ))}
           </div>
        </Card>
      </aside>
    </main>
  );
});

export default OrganizationFeed;
