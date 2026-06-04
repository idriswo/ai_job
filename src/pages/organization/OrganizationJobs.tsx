import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setJobs, addJob, setLoadingJobs } from '../../store/slices/organizationSlice';
import { axiosRequest } from '../../utils/token';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const OrganizationJobs = memo(() => {
  const dispatch = useDispatch();
  const { jobs, isLoadingJobs } = useSelector((state: RootState) => state.organization);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', description: '', location: '', type: 'Full-time', salary: '' });

  useEffect(() => {
    const fetchOrgJobs = async () => {
      dispatch(setLoadingJobs(true));
      try {
        const res = await axiosRequest.get('/api/Job');
        dispatch(setJobs(res.data || []));
      } catch (error) {
        toast.error('Failed to load jobs');
      }
    };
    fetchOrgJobs();
  }, [dispatch]);

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.description) return toast.error('Title and description are required');
    try {
      let orgId = 1;
      try {
        const orgRes = await axiosRequest.get('/api/Organization/mine');
        const orgs = Array.isArray(orgRes.data) ? orgRes.data : [orgRes.data];
        if (orgs.length > 0 && orgs[0]?.id) {
          orgId = orgs[0].id;
        }
      } catch (e) {
        console.warn("Could not fetch org, using default", e);
      }

      const payload = {
        title: newJob.title,
        description: newJob.description,
        location: newJob.location,
        employmentType: newJob.type,
        experienceLevel: 'Mid-Level',
        salary: newJob.salary,
        organizationId: orgId
      };

      const res = await axiosRequest.post('/api/Job', payload);
      dispatch(addJob(res.data));
      setIsCreateModalOpen(false);
      setNewJob({ title: '', description: '', location: '', type: 'Full-time', salary: '' });
      toast.success('Job posted successfully!');
    } catch (error: unknown) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <main className="max-w-[1000px] mx-auto px-[24px] py-[32px] min-h-screen">
      <div className="flex justify-between items-center mb-[24px]">
        <div>
          <h1 className="text-[24px] font-[700] text-slate-900">Job Postings</h1>
          <p className="text-[14px] text-slate-500 mt-[4px]">Manage your active job listings and applicants</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center gap-[8px]">
          <Plus className="w-[16px] h-[16px]" />
          Post New Job
        </Button>
      </div>

      {isLoadingJobs ? (
        <div className="flex justify-center p-[40px]"><div className="w-[32px] h-[32px] border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="space-y-[16px]">
          <AnimatePresence>
            {jobs.map((job) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="p-[24px] rounded-2xl shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[18px] font-[600] text-slate-900">{job.title}</h3>
                      <div className="flex items-center gap-[16px] mt-[8px]">
                        <span className="flex items-center gap-[4px] text-[13px] text-slate-500"><MapPin className="w-[14px] h-[14px]"/> {job.location || 'Remote'}</span>
                        <span className="flex items-center gap-[4px] text-[13px] text-slate-500"><Briefcase className="w-[14px] h-[14px]"/> {job.type || 'Full-time'}</span>
                        {job.salary && <span className="flex items-center gap-[4px] text-[13px] text-slate-500"><DollarSign className="w-[14px] h-[14px]"/> {job.salary}</span>}
                      </div>
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 px-[12px] py-[6px] rounded-full text-[12px] font-[600]">
                      Active
                    </div>
                  </div>
                  <div className="mt-[16px] pt-[16px] border-t border-slate-100 flex gap-[12px]">
                    <Button variant="outline" className="rounded-full text-[13px]">View Applicants (0)</Button>
                    <Button variant="ghost" className="rounded-full text-[13px] text-slate-500">Edit</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {jobs.length === 0 && !isLoadingJobs && (
            <div className="text-center py-[60px] bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <Briefcase className="w-[48px] h-[48px] text-slate-300 mx-auto mb-[16px]" />
              <h3 className="text-[16px] font-[600] text-slate-900">No active jobs</h3>
              <p className="text-[14px] text-slate-500 mt-[4px]">Post your first job to start receiving applications</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-xl w-full max-w-[600px] overflow-hidden">
              <div className="p-[24px] border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-[20px] font-[700] text-slate-900">Create New Job Listing</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600"><Plus className="w-[24px] h-[24px] rotate-45" /></button>
              </div>
              <div className="p-[24px] space-y-[16px]">
                <div>
                  <label className="text-[13px] font-[600] text-slate-700 mb-[4px] block">Job Title</label>
                  <input value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-[16px] py-[10px] text-[14px] focus:outline-none focus:border-indigo-600 transition-colors" placeholder="e.g. Senior Product Manager" />
                </div>
                <div>
                  <label className="text-[13px] font-[600] text-slate-700 mb-[4px] block">Job Description</label>
                  <textarea value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-[16px] py-[10px] text-[14px] focus:outline-none focus:border-indigo-600 transition-colors min-h-[120px] resize-none" placeholder="Describe the role and responsibilities..." />
                </div>
                <div className="grid grid-cols-2 gap-[16px]">
                  <div>
                    <label className="text-[13px] font-[600] text-slate-700 mb-[4px] block">Location</label>
                    <input value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-[16px] py-[10px] text-[14px] focus:outline-none focus:border-indigo-600 transition-colors" placeholder="e.g. Remote, Dushanbe" />
                  </div>
                  <div>
                    <label className="text-[13px] font-[600] text-slate-700 mb-[4px] block">Salary (Optional)</label>
                    <input value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-[16px] py-[10px] text-[14px] focus:outline-none focus:border-indigo-600 transition-colors" placeholder="e.g. $50,000 - $70,000" />
                  </div>
                </div>
              </div>
              <div className="p-[24px] bg-slate-50 flex justify-end gap-[12px]">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-full px-[24px]">Cancel</Button>
                <Button onClick={handleCreateJob} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-[24px]">Post Job</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
});

export default OrganizationJobs;
