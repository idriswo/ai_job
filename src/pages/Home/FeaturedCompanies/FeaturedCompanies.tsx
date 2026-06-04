import { memo, useEffect, useState } from 'react';
import { MapPin, Users, ExternalLink } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { axiosRequest } from '../../../utils/token';

interface Organization {
  id: number;
  name: string;
  logo: string;
  description: string;
  location: string;
  employeeCount: string;
}

const FeaturedCompanies = memo(() => {
  const [companies, setCompanies] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axiosRequest.get('/api/Organization');
        // Get just the first 3 or 4 for featured section
        setCompanies(res.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch companies', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading || companies.length === 0) return null;

  return (
    <div className="w-full py-[80px] bg-[#f8f9ff] px-[24px] flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="text-[32px] font-bold text-[#0b1c30] text-center mb-[16px]">
          Top Hiring Companies
        </h2>
        <p className="text-[#6b7280] text-[16px] text-center mb-[48px] max-w-[600px]">
          Discover opportunities with industry-leading organizations actively looking for talent like you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full">
          {companies.map((company) => (
            <Card key={company.id} className="p-[24px] bg-white border-[#e0dfdc] shadow-sm hover:shadow-lg transition-all rounded-2xl flex flex-col items-center text-center group cursor-pointer">
              <Avatar className="w-[80px] h-[80px] mb-[16px] shadow-sm border border-slate-100">
                <AvatarImage src={company.logo} />
                <AvatarFallback className="text-[24px] font-bold bg-indigo-50 text-indigo-600">
                  {company.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-[20px] font-bold text-slate-900 mb-[8px] group-hover:text-indigo-600 transition-colors">
                {company.name}
              </h3>
              <p className="text-[14px] text-slate-500 line-clamp-2 mb-[16px]">
                {company.description || 'Leading organization in their respective industry, offering great opportunities for career growth.'}
              </p>
              <div className="flex items-center gap-[16px] text-[13px] font-medium text-slate-600 mb-[24px] w-full justify-center">
                <div className="flex items-center gap-[4px]">
                  <MapPin className="w-[14px] h-[14px] text-slate-400" />
                  {company.location || 'Global'}
                </div>
                <div className="flex items-center gap-[4px]">
                  <Users className="w-[14px] h-[14px] text-slate-400" />
                  {company.employeeCount || '100+'}
                </div>
              </div>
              <Button variant="outline" className="w-full mt-auto rounded-xl border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200">
                View Profile <ExternalLink className="w-[14px] h-[14px] ml-[8px]" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
});

export default FeaturedCompanies;
