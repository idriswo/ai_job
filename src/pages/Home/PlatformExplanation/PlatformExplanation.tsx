import { memo } from 'react';
import { Building2, UserCircle2, ArrowRight, Zap, Target, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const PlatformExplanation = memo(() => {
  const navigate = useNavigate();

  return (
    <div className="w-full py-[100px] bg-white px-[24px] flex justify-center border-t border-slate-100">
      <div className="w-full max-w-[1200px]">
        <div className="text-center mb-[64px]">
          <h2 className="text-[36px] font-bold text-[#0b1c30] mb-[16px]">
            One Platform, Two Powerful Experiences
          </h2>
          <p className="text-[#6b7280] text-[18px] max-w-[700px] mx-auto">
            Whether you are looking for your next career move or searching for the perfect candidate, 
            our AI-driven platform bridges the gap with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px]">
          {/* For Candidates Section */}
          <div className="bg-[#f8f9ff] rounded-[32px] p-[40px] border border-indigo-50 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
            
            <div className="w-[64px] h-[64px] bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center mb-[32px]">
              <UserCircle2 className="w-[32px] h-[32px] text-indigo-600" />
            </div>
            
            <h3 className="text-[28px] font-bold text-slate-900 mb-[16px]">For Candidates</h3>
            <p className="text-[16px] text-slate-600 mb-[32px] leading-relaxed">
              Create a standout profile and let our AI match you with jobs that perfectly align with your skills, experience, and career goals. Stop searching and start interviewing.
            </p>
            
            <ul className="space-y-[16px] mb-[40px]">
              <li className="flex items-center gap-[12px] text-slate-700 font-medium">
                <div className="w-[24px] h-[24px] rounded-full bg-indigo-100 flex items-center justify-center">
                  <Zap className="w-[12px] h-[12px] text-indigo-600" />
                </div>
                AI-powered resume parsing and skill matching
              </li>
              <li className="flex items-center gap-[12px] text-slate-700 font-medium">
                <div className="w-[24px] h-[24px] rounded-full bg-indigo-100 flex items-center justify-center">
                  <Target className="w-[12px] h-[12px] text-indigo-600" />
                </div>
                Personalized job recommendations daily
              </li>
              <li className="flex items-center gap-[12px] text-slate-700 font-medium">
                <div className="w-[24px] h-[24px] rounded-full bg-indigo-100 flex items-center justify-center">
                  <ShieldCheck className="w-[12px] h-[12px] text-indigo-600" />
                </div>
                Direct messaging with verified recruiters
              </li>
            </ul>

            <Button onClick={() => navigate('/register')} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-[32px] h-[48px] font-semibold text-[15px] flex items-center gap-[8px]">
              Join as a Candidate <ArrowRight className="w-[18px] h-[18px]" />
            </Button>
          </div>

          {/* For Organizations Section */}
          <div className="bg-[#f0fdf4] rounded-[32px] p-[40px] border border-green-50 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors"></div>
            
            <div className="w-[64px] h-[64px] bg-white rounded-2xl shadow-sm border border-green-100 flex items-center justify-center mb-[32px]">
              <Building2 className="w-[32px] h-[32px] text-[#007a5a]" />
            </div>
            
            <h3 className="text-[28px] font-bold text-slate-900 mb-[16px]">For Organizations</h3>
            <p className="text-[16px] text-slate-600 mb-[32px] leading-relaxed">
              Find the top 1% of talent tailored to your company's needs. Post jobs, manage applicants, and interview top-tier professionals all in one seamless ecosystem.
            </p>
            
            <ul className="space-y-[16px] mb-[40px]">
              <li className="flex items-center gap-[12px] text-slate-700 font-medium">
                <div className="w-[24px] h-[24px] rounded-full bg-green-100 flex items-center justify-center">
                  <Zap className="w-[12px] h-[12px] text-[#007a5a]" />
                </div>
                Instantly match with top pre-screened talent
              </li>
              <li className="flex items-center gap-[12px] text-slate-700 font-medium">
                <div className="w-[24px] h-[24px] rounded-full bg-green-100 flex items-center justify-center">
                  <Target className="w-[12px] h-[12px] text-[#007a5a]" />
                </div>
                Streamlined applicant tracking system
              </li>
              <li className="flex items-center gap-[12px] text-slate-700 font-medium">
                <div className="w-[24px] h-[24px] rounded-full bg-green-100 flex items-center justify-center">
                  <ShieldCheck className="w-[12px] h-[12px] text-[#007a5a]" />
                </div>
                Dedicated company branding & profile
              </li>
            </ul>

            <Button onClick={() => navigate('/register')} className="bg-[#007a5a] hover:bg-[#006046] text-white rounded-full px-[32px] h-[48px] font-semibold text-[15px] flex items-center gap-[8px]">
              Register Your Company <ArrowRight className="w-[18px] h-[18px]" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
});

export default PlatformExplanation;
