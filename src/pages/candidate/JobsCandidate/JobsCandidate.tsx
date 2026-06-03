import { memo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Search, Building, Clock, DollarSign, Bookmark, ArrowRight } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { axiosRequest } from '../../../utils/token';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';

const JobsCandidate = memo(() => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosRequest.get('/api/Job');
        setJobs(res.data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
      toast.success("Job removed from saved");
    } else {
      setSavedJobs(prev => [...prev, jobId]);
      toast.success("Job saved successfully!");
    }
  };

  const handleApply = (jobId: number) => {
    if (appliedJobs.includes(jobId)) return;
    setAppliedJobs(prev => [...prev, jobId]);
    toast.success("Application submitted successfully!");
  };

  const filteredJobs = jobs.filter(job => 
    (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (job.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-[80px] pb-[40px] px-[20px] md:px-[40px]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header & Search */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-[32px] text-center"
        >
          <h1 className="text-[32px] md:text-[40px] font-[700] text-slate-900 mb-[16px]">
            Find your next <span className="text-indigo-600">dream job</span>
          </h1>
          <p className="text-[16px] text-slate-500 mb-[32px] max-w-[600px] mx-auto">
            Discover opportunities tailored to your skills and career goals.
          </p>

          <div className="max-w-[800px] mx-auto flex flex-col md:flex-row gap-[12px]">
            <div className="relative flex-1">
              <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#6b7280] w-[20px] h-[20px]" />
              <Input 
                type="text" 
                placeholder="Search by job title, company, or location..." 
                className="w-full pl-[48px] h-[54px] rounded-[4px] border-slate-200 bg-white text-[16px] focus-visible:ring-[#0a66c2]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-[54px] px-[32px] rounded-[4px] bg-indigo-600 hover:bg-indigo-700 text-white text-[16px] font-[600] shrink-0">
              Find Jobs
            </Button>
          </div>
        </motion.div>

        {/* Jobs Grid */}
        {isLoading ? (
          <div className="text-center py-[60px] text-slate-500">Loading amazing opportunities...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-[60px] text-slate-500">No jobs found matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[16px]">
            <AnimatePresence>
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
                >
                  <Card className="flex flex-col h-full rounded-2xl border-slate-200 hover:border-indigo-600/30 shadow-lg shadow-slate-200/40 transition-all duration-300 overflow-hidden bg-white p-[24px] group">
                    <div className="flex justify-between items-start mb-[20px]">
                      <div className="flex gap-[16px]">
                        <div className="w-[56px] h-[56px] rounded-2xl bg-slate-50 flex items-center justify-center border border-[#e2e4f0] shrink-0 overflow-hidden">
                          <Building className="w-[24px] h-[24px] text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-[18px] font-[700] text-slate-900 leading-[24px] group-hover:text-indigo-600 transition-colors line-clamp-1">{job.title || 'Untitled Position'}</h3>
                          <p className="text-[14px] text-slate-500 mt-[4px]">{job.companyName || job.organizationName || 'Confidential Company'}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-slate-50"
                        onClick={() => handleSaveJob(job.id)}
                      >
                        <Bookmark className={`w-[20px] h-[20px] ${savedJobs.includes(job.id) ? 'fill-[#0a66c2] text-indigo-600' : 'text-[#6b7280]'}`} />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-[8px] mb-[20px]">
                      {job.location && (
                        <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-[500] hover:bg-[#e2e4f0] flex items-center gap-[4px] py-[4px] px-[10px]">
                          <MapPin className="w-[12px] h-[12px]" />
                          {job.location}
                        </Badge>
                      )}
                      {(job.employmentType || job.experienceLevel) && (
                        <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-[500] hover:bg-[#e2e4f0] flex items-center gap-[4px] py-[4px] px-[10px]">
                          <Clock className="w-[12px] h-[12px]" />
                          {job.employmentType || job.experienceLevel || 'Full-time'}
                        </Badge>
                      )}
                      {job.salary && (
                        <Badge variant="secondary" className="bg-[#eef2ff] text-indigo-600 font-[600] flex items-center gap-[4px] py-[4px] px-[10px]">
                          <DollarSign className="w-[12px] h-[12px]" />
                          {job.salary}
                        </Badge>
                      )}
                    </div>

                    <p className="text-[14px] text-slate-500 leading-[22px] line-clamp-3 mb-[24px] flex-grow">
                      {job.description || 'No description provided for this position.'}
                    </p>

                    <div className="mt-auto pt-[20px] border-t border-[#f4f7fb] flex justify-between items-center">
                      <span className="text-[12px] text-[#6b7280]">
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently posted'}
                      </span>
                      <Button 
                        onClick={() => handleApply(job.id)}
                        disabled={appliedJobs.includes(job.id)}
                        className={`rounded-full h-[36px] px-[20px] text-[14px] font-[600] gap-[8px] transition-colors ${
                          appliedJobs.includes(job.id) 
                            ? 'bg-[#e2e4f0] text-slate-500 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {appliedJobs.includes(job.id) ? 'Applied' : 'Easy Apply'}
                        {!appliedJobs.includes(job.id) && <ArrowRight className="w-[16px] h-[16px]" />}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
});

export default JobsCandidate;