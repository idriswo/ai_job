import { memo } from 'react';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { BrainCircuit, Info, ArrowRight, Building2, MapPin, Briefcase } from 'lucide-react';

export const CandidateRightSidebar = memo(() => {
  return (
    <aside className="hidden lg:block lg:col-span-3 space-y-[24px]">
      <Card className="rounded-2xl p-[24px] border-[2px] border-dashed border-[#006c49]/30 bg-[#006c49]/5 relative overflow-hidden transition-all duration-200">
        <div className="flex justify-between items-start mb-[16px]">
          <div>
            <Badge className="bg-[#006c49] text-[#ffffff] text-[10px] font-[700] px-[8px] py-[2px] rounded-full uppercase tracking-widest hover:bg-[#006c49]">AI Match Insight</Badge>
            <h3 className="text-[20px] leading-[28px] font-[600] text-[#006c49] mt-[8px]">Your profile is trending in Fintech</h3>
          </div>
          <BrainCircuit className="w-[24px] h-[24px] text-[#006c49]" />
        </div>
        <p className="text-[14px] leading-[20px] text-[#006c49]/80 mb-[24px]">Based on your latest skills, you have a 92% match with 3 new roles at Stripe and Plaid.</p>
        <Button className="w-full bg-[#006c49] hover:bg-[#005a3c] text-white rounded-xl py-[20px] shadow-md shadow-[#006c49]/20 font-[600]">
          Review Matches
        </Button>
      </Card>

      <Card className="rounded-2xl shadow-lg shadow-slate-200/40 border-slate-200 overflow-hidden">
        <div className="p-[16px] border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-[14px] font-[600] text-slate-900">Recent Jobs</h3>
          <Info className="w-[16px] h-[16px] text-slate-400" />
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-[16px] hover:bg-slate-50 transition-colors group cursor-pointer">
              <h4 className="text-[14px] font-[600] text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">Senior Frontend Developer</h4>
              <div className="flex items-center gap-[4px] mt-[4px] text-slate-500">
                <Building2 className="w-[12px] h-[12px]" />
                <span className="text-[12px]">TechCorp Inc.</span>
              </div>
              <div className="flex items-center gap-[12px] mt-[8px]">
                <div className="flex items-center gap-[4px] text-slate-400">
                  <MapPin className="w-[12px] h-[12px]" />
                  <span className="text-[10px]">Remote</span>
                </div>
                <div className="flex items-center gap-[4px] text-slate-400">
                  <Briefcase className="w-[12px] h-[12px]" />
                  <span className="text-[10px]">Full-time</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-[12px] border-t border-slate-100">
          <button className="w-full text-center text-[13px] font-[600] text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-[4px]">
            View all recommendations
            <ArrowRight className="w-[14px] h-[14px]" />
          </button>
        </div>
      </Card>
    </aside>
  );
});
