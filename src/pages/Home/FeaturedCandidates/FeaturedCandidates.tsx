import type { Skill } from '../../../types';
import { memo, useEffect, useState } from 'react';
import { Briefcase, Star, UserPlus } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { axiosRequest } from '../../../utils/token';

interface Skill {
  name: string;
}

interface Candidate {
  id: number;
  fullName: string;
  profilePicture: string;
  avatarUrl: string;
  speciality: string;
  skills: Skill[] | string[];
}

const FeaturedCandidates = memo(() => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axiosRequest.get('/api/User/directory');
        // Filter out non-candidates if necessary, but assuming directory is candidates.
        setCandidates(res.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch candidates', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  if (loading || candidates.length === 0) return null;

  return (
    <div className="w-full py-[80px] bg-white px-[24px] flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="text-[32px] font-bold text-[#0b1c30] text-center mb-[16px]">
          Exceptional Talent Ready to Work
        </h2>
        <p className="text-[#6b7280] text-[16px] text-center mb-[48px] max-w-[600px]">
          Connect with highly-rated professionals handpicked by our AI matching system.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] w-full">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="p-[20px] bg-white border-[#e0dfdc] shadow-sm hover:shadow-lg transition-all rounded-2xl flex flex-col items-center text-center group cursor-pointer">
              <div className="relative mb-[16px]">
                <Avatar className="w-[90px] h-[90px] shadow-md border-2 border-white">
                  <AvatarImage src={candidate.profilePicture || candidate.avatarUrl} />
                  <AvatarFallback className="text-[28px] font-bold bg-indigo-50 text-indigo-600">
                    {candidate.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-[10px] left-[50%] translate-x-[-50%] bg-white rounded-full px-[8px] py-[2px] shadow-sm border border-slate-100 flex items-center gap-[4px]">
                  <Star className="w-[12px] h-[12px] fill-yellow-400 text-yellow-400" />
                  <span className="text-[11px] font-bold text-slate-700">Top Match</span>
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-[4px] group-hover:text-indigo-600 transition-colors">
                {candidate.fullName}
              </h3>
              <div className="flex items-center justify-center gap-[6px] text-[#007a5a] text-[13px] font-semibold mb-[12px]">
                <Briefcase className="w-[14px] h-[14px]" />
                {candidate.speciality || 'Software Engineer'}
              </div>
              
              <div className="flex flex-wrap justify-center gap-[6px] mb-[24px]">
                {candidate.skills?.slice(0, 3).map((skill: Skill, idx: number) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 text-[11px] px-[8px] py-[4px] rounded-md font-medium">
                    {skill.name || skill}
                  </span>
                )) || (
                  <>
                    <span className="bg-slate-100 text-slate-600 text-[11px] px-[8px] py-[4px] rounded-md font-medium">React</span>
                    <span className="bg-slate-100 text-slate-600 text-[11px] px-[8px] py-[4px] rounded-md font-medium">Node.js</span>
                  </>
                )}
              </div>

              <Button className="w-full mt-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-[40px] font-semibold flex items-center justify-center gap-[8px]">
                <UserPlus className="w-[16px] h-[16px]" /> Connect
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
});

export default FeaturedCandidates;
