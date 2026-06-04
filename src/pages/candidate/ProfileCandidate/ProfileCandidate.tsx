import { useState, useEffect, memo } from 'react';
import { Pencil, MapPin, Globe, Phone, Briefcase, Plus, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { axiosRequest } from '../../../utils/token';
import { toast } from 'sonner';

const ProfileCandidate = memo(() => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addSkillOpen, setAddSkillOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    headline: '',
    bio: '',
    location: '',
    website: '',
    phone: '',
    avatarUrl: '',
    bannerUrl: ''
  });

  const [newSkillName, setNewSkillName] = useState('');

  const fetchProfileData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const meRes = await axiosRequest.get('/api/User/me');
      const currentUser = meRes.data;
      setUser(currentUser);

      const profRes = await axiosRequest.get(`/api/Profile/by-user/${currentUser.id}`);
      setProfile(profRes.data);

      const skillRes = await axiosRequest.get(`/api/UserSkill/by-user/${currentUser.id}`);
      setSkills(skillRes.data || []);

      setEditForm({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        headline: profRes.data?.headline || '',
        bio: profRes.data?.bio || '',
        location: profRes.data?.location || '',
        website: profRes.data?.website || '',
        phone: profRes.data?.phone || '',
        avatarUrl: profRes.data?.avatarUrl || '',
        bannerUrl: profRes.data?.bannerUrl || ''
      });
    } catch (error) {
      console.error("Error fetching profile", error);
      toast.error("Failed to load profile data.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const { fullName, email, ...profileData } = editForm;
      
      if (user?.id) {
        await axiosRequest.patch(`/api/User/${user.id}`, { fullName, email });
      }

      if (profile?.id) {
        await axiosRequest.put(`/api/Profile/${profile.id}`, profileData);
      } else {
        await axiosRequest.post(`/api/Profile`, profileData);
      }
      
      toast.success("Profile updated successfully!");
      setEditProfileOpen(false);
      fetchProfileData(true);
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    try {
      await axiosRequest.post('/api/UserSkill', { name: newSkillName.trim() });
      toast.success("Skill added successfully!");
      setNewSkillName('');
      setAddSkillOpen(false);
      fetchProfileData(true);
    } catch (error) {
      console.error("Error adding skill", error);
      toast.error("Failed to add skill. Maybe it already exists.");
    }
  };

  const handleRemoveSkill = async (skillId: number) => {
    if (!user?.id) return;
    try {
      await axiosRequest.delete(`/api/UserSkill/user/${user.id}/skill/${skillId}`);
      toast.success("Skill removed.");
      fetchProfileData(true);
    } catch (error) {
      console.error("Error removing skill", error);
      toast.error("Failed to remove skill.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full flex justify-center items-center bg-slate-50">
        <span className="text-[#6b7280]">Loading profile...</span>
      </div>
    );
  }

  const name = user?.fullName || "Professional";
  const headline = profile?.headline || "No headline set";
  const bio = profile?.bio || "No bio available.";
  const location = profile?.location || "Location not set";
  const website = profile?.website || "";
  const phone = profile?.phone || "";
  const avatar = profile?.avatarUrl || "";
  const banner = profile?.bannerUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1520&q=80";

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-slate-50 py-[24px]">
      <div className="max-w-[1128px] mx-auto px-[24px] flex flex-col gap-[24px]">
        
        {/* TOP CARD: Banner + Avatar + Headline */}
        <div className="bg-[#ffffff] rounded-2xl border-[1px] border-[#e0dfdc] shadow-lg shadow-slate-200/40 overflow-hidden relative">
          <div className="h-[200px] w-full bg-[#eef2ff] overflow-hidden">
            <img src={banner} alt="Banner" className="w-full h-full object-cover" />
          </div>
          
          <div className="px-[24px] pb-[24px] relative">
            <div className="flex justify-between items-start">
              <Avatar className="w-[152px] h-[152px] rounded-full border-[4px] border-[#ffffff] shadow-lg shadow-slate-200/40 mt-[-76px] bg-slate-100">
                <AvatarImage src={avatar} className="object-cover" />
                <AvatarFallback className="text-[48px]">{name.charAt(0)}</AvatarFallback>
              </Avatar>

              <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-[24px] rounded-full w-[40px] h-[40px] p-0 border-indigo-600 text-indigo-600 hover:bg-[#eef2ff]">
                    <Pencil className="w-[18px] h-[18px]" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your personal information and bio.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" value={editForm.fullName} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} placeholder="John Doe" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="headline">Headline</Label>
                      <Input id="headline" value={editForm.headline} onChange={(e) => setEditForm({...editForm, headline: e.target.value})} placeholder="Software Engineer @ TechCorp" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">About (Bio)</Label>
                      <Textarea id="bio" value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} className="min-h-[120px]" placeholder="Tell us about your experience..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} placeholder="San Francisco, CA" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} placeholder="+1 234 567 890" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" value={editForm.website} onChange={(e) => setEditForm({...editForm, website: e.target.value})} placeholder="https://yourportfolio.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="avatarUrl">Avatar Image URL</Label>
                      <Input id="avatarUrl" value={editForm.avatarUrl} onChange={(e) => setEditForm({...editForm, avatarUrl: e.target.value})} placeholder="https://..." />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bannerUrl">Banner Image URL</Label>
                      <Input id="bannerUrl" value={editForm.bannerUrl} onChange={(e) => setEditForm({...editForm, bannerUrl: e.target.value})} placeholder="https://..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleUpdateProfile} className="bg-indigo-600 text-white hover:bg-[#001c66]">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-[16px]">
              <h1 className="text-[24px] font-bold text-slate-900">{name}</h1>
              <p className="text-[16px] text-[#000000] mt-[4px]">{headline}</p>
              
              <div className="flex flex-wrap items-center gap-[16px] mt-[12px] text-[14px] text-[#6b7280]">
                {location && (
                  <div className="flex items-center gap-[4px]">
                    <MapPin className="w-[16px] h-[16px]" />
                    <span>{location}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-[4px]">
                    <Phone className="w-[16px] h-[16px]" />
                    <span>{phone}</span>
                  </div>
                )}
                {website && (
                  <div className="flex items-center gap-[4px]">
                    <Globe className="w-[16px] h-[16px]" />
                    <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                      {website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {/* Main Column */}
          <div className="md:col-span-2 flex flex-col gap-[24px]">
            {/* ABOUT CARD */}
            <div className="bg-[#ffffff] rounded-2xl p-[24px] border-[1px] border-[#e0dfdc] shadow-lg shadow-slate-200/40">
              <h2 className="text-[20px] font-bold text-slate-900 mb-[16px]">About</h2>
              <p className="text-[14px] text-[#4b5563] whitespace-pre-wrap leading-[1.6]">
                {bio}
              </p>
            </div>
            
            {/* SKILLS CARD */}
            <div className="bg-[#ffffff] rounded-2xl p-[24px] border-[1px] border-[#e0dfdc] shadow-lg shadow-slate-200/40">
              <div className="flex justify-between items-center mb-[16px]">
                <h2 className="text-[20px] font-bold text-slate-900">Skills</h2>
                <Dialog open={addSkillOpen} onOpenChange={setAddSkillOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-full w-[40px] h-[40px] p-0 border-indigo-600 text-indigo-600 hover:bg-[#eef2ff]">
                      <Plus className="w-[18px] h-[18px]" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Skill</DialogTitle>
                      <DialogDescription>
                        Add a new skill to showcase on your profile.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="skillname">Skill Name</Label>
                        <Input id="skillname" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="e.g. React, Python, Project Management" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddSkill} className="bg-indigo-600 text-white hover:bg-[#001c66]">Add Skill</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {skills.length === 0 ? (
                <p className="text-[14px] text-[#6b7280]">No skills added yet.</p>
              ) : (
                <div className="flex flex-wrap gap-[8px]">
                  {skills.map((s: Skill) => (
                    <div key={s.id} className="group flex items-center bg-slate-100 text-indigo-600 border-[1px] border-[#cce0ff] px-[12px] py-[6px] rounded-full text-[14px] font-medium transition-all hover:border-indigo-600">
                      {s.skill?.name}
                      <button 
                        onClick={() => handleRemoveSkill(s.skillId)}
                        className="ml-[8px] opacity-0 group-hover:opacity-100 transition-opacity text-[#ff4d4d] hover:text-[#e60000]"
                        title="Remove skill"
                      >
                        <X className="w-[14px] h-[14px]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-1 flex flex-col gap-[24px]">
            <div className="bg-[#ffffff] rounded-2xl p-[24px] border-[1px] border-[#e0dfdc] shadow-lg shadow-slate-200/40">
              <h3 className="text-[16px] font-bold text-slate-900 mb-[12px]">Profile Strength</h3>
              <div className="w-full bg-[#f3f4f6] rounded-full h-[8px] mb-[8px]">
                <div className="bg-[#007a5a] h-[8px] rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-[12px] text-[#6b7280]">Intermediate • Add more details to reach All-Star</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default ProfileCandidate;
