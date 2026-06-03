import { Bookmark, BrainCircuit, Calendar, Image as ImageIcon, Info, MessageSquare, MoreHorizontal, Plus, Send, Share2, Sparkles, ThumbsUp, Users, X } from 'lucide-react';
import { memo, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { axiosRequest } from '../../../utils/token';
import { motion, AnimatePresence } from 'framer-motion';

const getFullImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://backendaijob-1.onrender.com';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const CandidateFeed = memo(() => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserInfo, setCurrentUserInfo] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [feedType, setFeedType] = useState<'feed' | 'all'>('all');
  const [postImageUrl, setPostImageUrl] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [commentsByPost, setCommentsByPost] = useState<Record<number, any[]>>({});
  
  const [skills, setSkills] = useState<any[]>([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');

  const [languages, setLanguages] = useState<any[]>([]);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [newLanguageName, setNewLanguageName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async (type = feedType) => {
    setIsLoading(true);
    try {
      const endpoint = type === 'feed' ? '/api/Post/feed' : '/api/Post';
      const { data } = await axiosRequest.get(endpoint);
      setPosts(data?.data || data || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("Failed to load feed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(feedType);
  }, [feedType]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const meRes = await axiosRequest.get('/api/User/me');
        setCurrentUserInfo(meRes.data);
        setCurrentUserId(meRes.data.id);
        const profRes = await axiosRequest.get(`/api/Profile/by-user/${meRes.data.id}`);
        setCurrentUserProfile(profRes.data);
        
        try {
          const skillRes = await axiosRequest.get(`/api/UserSkill/by-user/${meRes.data.id}`);
          const skillsArr = Array.isArray(skillRes.data) ? skillRes.data : (skillRes.data?.data || []);
          setSkills([...skillsArr].reverse());
        } catch (e) {
          console.error("No skills found", e);
        }

        try {
          const langRes = await axiosRequest.get(`/api/UserLanguage/by-user/${meRes.data.id}`);
          const langsArr = Array.isArray(langRes.data) ? langRes.data : (langRes.data?.data || []);
          setLanguages([...langsArr].reverse());
        } catch (e) {
          console.error("No languages found", e);
        }
      } catch (e) {
        console.error("Error fetching user data", e);
      }
    };
    fetchUserData();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      const { data } = await axiosRequest.post('/api/UserSkill', { name: newSkillName.trim() });
      
      const newSkill = {
        id: data?.id || data?.data?.id || Date.now(),
        name: data?.name || data?.data?.name || newSkillName.trim()
      };
      
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
      const { data } = await axiosRequest.post('/api/UserLanguage', { name: newLanguageName.trim() });
      
      const newLang = {
        id: data?.id || data?.data?.id || Date.now(),
        name: data?.name || data?.data?.name || newLanguageName.trim()
      };
      
      setLanguages(prev => [newLang, ...prev]);
      setNewLanguageName('');
      setIsAddingLanguage(false);
      toast.success("Language added!");
    } catch (e) {
      toast.error("Failed to add language");
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await axiosRequest.post(`/api/Post/${postId}/like`);
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedByMe;
          return {
            ...post,
            likedByMe: !isLiked,
            likeCount: (post.likeCount || 0) + (isLiked ? -1 : 1)
          };
        }
        return post;
      }));
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleRepost = async (postId: number) => {
    try {
      await axiosRequest.post(`/api/Post/${postId}/repost`);
      toast.success("Post reposted!");
      setPosts(prev => prev.map(post => post.id === postId ? { ...post, repostCount: (post.repostCount || 0) + 1 } : post));
    } catch (error) {
      toast.error("Failed to repost");
    }
  };



  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await axiosRequest.delete(`/api/Post/${postToDelete}`);
      toast.success("Post deleted");
      setPostToDelete(null);
      fetchPosts();
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleComment = async (postId: number) => {
    if (!commentText.trim()) return;
    try {
      await axiosRequest.post(`/api/Post/${postId}/comments`, { content: commentText });
      toast.success("Comment added!");
      setCommentText('');

      axiosRequest.get(`/api/Post/${postId}/comments`)
        .then(res => setCommentsByPost(prev => ({ ...prev, [postId]: res.data.data || res.data || [] })));

      setPosts(prev => prev.map(post => post.id === postId ? { ...post, commentCount: (post.commentCount || 0) + 1 } : post));
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploadingImage(true);
    try {
      const response = await axiosRequest.post('/api/Upload/photo', formData);
      const uploadedUrl = response.data?.url || response.data?.path || response.data;
      if (typeof uploadedUrl === 'string') {
        setPostImageUrl(uploadedUrl);
        toast.success("Image uploaded!");
      } else {
        toast.error("Upload succeeded, but could not read URL");
      }
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePostSubmit = async () => {
    if (!newPostContent.trim() && !postImageUrl) return;
    setIsPosting(true);
    try {
      await axiosRequest.post('/api/Post', { content: newPostContent, imageUrl: postImageUrl });
      toast.success("Post published successfully!");
      setNewPostContent('');
      setPostImageUrl('');
      fetchPosts();
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to publish post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleEditPostSubmit = async () => {
    if (!editPostContent.trim() || editingPostId === null) return;
    setIsSavingEdit(true);
    try {
      await axiosRequest.put(`/api/Post/${editingPostId}`, { content: editPostContent });
      toast.success("Post updated!");
      setEditingPostId(null);
      setEditPostContent('');
      fetchPosts();
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error("Failed to update post");
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <main className="max-w-[1400px] mx-auto px-[24px] py-[32px] grid grid-cols-1 md:grid-cols-12 gap-[24px] text-slate-900 font-sans">

      <aside className="md:col-span-3 space-y-[24px]">
        <Card className="rounded-2xl shadow-lg shadow-slate-200/40 border-slate-200   transition-all duration-200 overflow-hidden">
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
              <span className="text-[12px] leading-[16px] font-[500] text-slate-500 group-hover:text-indigo-600 transition-colors">Profile views</span>
              <span className="text-[12px] leading-[16px] font-[700] text-indigo-600">342</span>
            </div>
          </div>
          <div className="p-[16px] bg-slate-100 border-t-[1px] border-slate-200">
            <a className="flex items-center gap-[8px] text-[12px] leading-[16px] text-slate-900 font-[600] hover:text-indigo-600" href="#">
              <Bookmark className="w-[16px] h-[16px]" />
              My Items
            </a>
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
                className="mb-[12px] flex flex-col gap-[8px] overflow-hidden"
              >
                <input 
                  type="text" 
                  value={newSkillName} 
                  onChange={(e) => setNewSkillName(e.target.value)} 
                  placeholder="Skill Name (e.g. TypeScript)" 
                  className="w-full text-[13px] border border-slate-200 rounded-lg px-[8px] py-[6px] outline-none focus:border-indigo-600"
                  autoFocus
                />
                <Button type="submit" size="sm" className="w-full h-[32px] rounded-lg bg-indigo-600 hover:bg-indigo-700">Add Skill</Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap gap-[6px]">
            {skills.map((skill: any) => (
              <span key={skill.id} className="text-[12px] px-[10px] py-[4px] bg-slate-100 text-slate-600 rounded-lg font-medium border border-slate-200/60 flex items-center gap-[4px]">
                {skill.name}
              </span>
            ))}
            {skills.length === 0 && !isAddingSkill && (
              <span className="text-[12px] text-slate-400">No skills added yet.</span>
            )}
          </div>
        </Card>

        {/* Languages Section */}
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
                className="mb-[12px] flex flex-col gap-[8px] overflow-hidden"
              >
                <input 
                  type="text" 
                  value={newLanguageName} 
                  onChange={(e) => setNewLanguageName(e.target.value)} 
                  placeholder="Language (e.g. English)" 
                  className="w-full text-[13px] border border-slate-200 rounded-lg px-[8px] py-[6px] outline-none focus:border-indigo-600"
                  autoFocus
                />
                <Button type="submit" size="sm" className="w-full h-[32px] rounded-lg bg-indigo-600 hover:bg-indigo-700">Add Language</Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap gap-[6px]">
            {languages.map((lang: any) => (
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

      <div className="md:col-span-6 space-y-[24px]">
        <Card className="rounded-2xl p-[24px] shadow-lg shadow-slate-200/40 border-slate-200   transition-all duration-200">
          <div className="flex gap-[16px] mb-[16px]">
            <Avatar className="w-[48px] h-[48px]">
              <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl6jtXCyK-gTR6etgKAkQ4hGi2nJdjskngL4heZOtt3StOUt2wZsiOs0xOw6yMLO4Z2lPtWfxfbm5n_VogarL4fJohEMmgNgkWgM1hvhI-oZ_0jHblawHmm-co1-QGhOgSGXoWfKVdsXoZV-wEhV7BjloLzNfixS6JLyMCPbaHeaEg2WjCfCvPF00vZj-P8FNkSePV0cpk-YCfsAV42x5ne4XE4VsBJLoM3vFcs8c39eQ_ewWd5CXf8Oah05Zh6iR2MYWXJIJvcHeO" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                className="w-full px-[24px] py-[12px] bg-slate-100 border-[1px] border-slate-200 rounded-[24px] text-slate-900 hover:bg-[#eff4ff] focus:outline-none focus:border-indigo-600 focus:ring-[2px] focus:ring-[#00288e]/20 transition-all text-[16px] leading-[24px] resize-none min-h-[50px]"
                placeholder="Start a post with AI assistance..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={newPostContent ? 3 : 1}
              />
              {isUploadingImage && <div className="mt-[12px] text-[14px] leading-[20px] text-indigo-600 animate-pulse font-[500]">Uploading image...</div>}
              {postImageUrl && (
                <div className="relative inline-block mt-[12px]">
                  <img src={getFullImageUrl(postImageUrl)} alt="Upload preview" className="h-[140px] rounded-2xl object-cover border-[1px] border-slate-200" />
                  <button
                    onClick={() => setPostImageUrl('')}
                    className="absolute top-[8px] right-[8px] bg-black/50 hover:bg-black/70 text-[#ffffff] rounded-full p-[4px] transition-colors"
                  >
                    <X className="w-[16px] h-[16px]" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center pt-[8px]">
            <div className="flex gap-[8px]">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              <Button
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-[8px] text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <ImageIcon className="w-[20px] h-[20px] text-indigo-600" />
                <span className="hidden sm:inline">Media</span>
              </Button>
              <Button variant="ghost" className="flex items-center gap-[8px] text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                <Calendar className="w-[20px] h-[20px] text-[#006c49]" />
                <span className="hidden sm:inline">Event</span>
              </Button>
            </div>
            {(newPostContent.trim() || postImageUrl) && (
              <Button
                onClick={handlePostSubmit}
                disabled={isPosting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] px-[24px] flex items-center gap-[8px]"
              >
                {isPosting ? 'Posting...' : (
                  <>
                    <Send className="w-[16px] h-[16px]" />
                    Publish
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        <div className="flex gap-[12px] pb-[8px]">
          <Button
            variant={feedType === 'feed' ? 'default' : 'outline'}
            onClick={() => setFeedType('feed')}
            className={`rounded-full px-[24px] ${feedType === 'feed' ? 'bg-indigo-600 text-[#ffffff] hover:bg-indigo-700' : 'text-slate-500 border-slate-200 hover:bg-slate-100'}`}
          >
            My Feed
          </Button>
          <Button
            variant={feedType === 'all' ? 'default' : 'outline'}
            onClick={() => setFeedType('all')}
            className={`rounded-full px-[24px] ${feedType === 'all' ? 'bg-indigo-600 text-[#ffffff] hover:bg-indigo-700' : 'text-slate-500 border-slate-200 hover:bg-slate-100'}`}
          >
            All Posts
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-[40px] text-slate-500">Loading feed...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-[40px] text-slate-500">No posts yet. Be the first to share!</div>
        ) : (
          posts.map((post, index) => (
            <motion.div 
              key={post.id || Math.random()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="rounded-2xl shadow-lg shadow-slate-200/40 border-slate-200   transition-all duration-300 overflow-hidden">
                <div className="p-[24px]">
                  <div className="flex justify-between items-start mb-[16px]">
                    <div className="flex gap-[16px]">
                      <Avatar className="w-[48px] h-[48px] rounded-2xl">
                        <AvatarImage src={post.authorImageUrl ? getFullImageUrl(post.authorImageUrl) : `https://ui-avatars.com/api/?name=${post.authorName || 'U'}&background=random`} />
                        <AvatarFallback className="rounded-2xl">{(post.authorName || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    <div>
                      <h4 className="text-[16px] leading-[24px] font-[600] text-slate-900">{post.authorName || 'Unknown User'}</h4>
                      <p className="text-[12px] leading-[16px] text-slate-500">
                        Professional • {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px] relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpenDropdownId(openDropdownId === post.id ? null : post.id)}
                      className="text-slate-500 hover:bg-slate-100 rounded-full"
                    >
                      <MoreHorizontal className="w-[20px] h-[20px]" />
                    </Button>

                    {openDropdownId === post.id && (
                      <div className="absolute right-0 top-[100%] mt-[4px] w-[140px] bg-white rounded-2xl shadow-lg border-[1px] border-slate-200 py-[8px] z-10">
                        {(post.userId === currentUserId || post.user?.id === currentUserId) && currentUserId ? (
                          <>
                            <button
                              onClick={() => {
                                setOpenDropdownId(null);
                                setEditingPostId(post.id);
                                setEditPostContent(post.content);
                              }}
                              className="w-full text-left px-[16px] py-[8px] text-[14px] font-[500] text-slate-900 hover:bg-slate-100 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdownId(null);
                                setPostToDelete(post.id);
                              }}
                              className="w-full text-left px-[16px] py-[8px] text-[14px] font-[500] text-[#e11d48] hover:bg-[#ffe4e6] transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setOpenDropdownId(null);
                              toast.success("Post reported");
                            }}
                            className="w-full text-left px-[16px] py-[8px] text-[14px] font-[500] text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            Report Post
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[16px] leading-[24px] text-slate-900 mb-[24px] whitespace-pre-wrap">
                  {post.content}
                </p>

                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border-[1px] border-slate-200 mb-[24px]">
                    <img
                      alt="Post Image"
                      className="w-[100%] h-[256px] object-cover"
                      src={getFullImageUrl(post.imageUrl)}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between py-[8px] border-b-[1px] border-slate-200 mb-[8px]">
                  <div className="flex items-center gap-[4px]">
                    <div className="flex -space-x-[4px]">
                      <span className="w-[20px] h-[20px] bg-indigo-600 rounded-full flex items-center justify-center ring-[2px] ring-[#ffffff]">
                        <ThumbsUp className="w-[10px] h-[10px] text-[#ffffff] fill-current" />
                      </span>
                    </div>
                    <span className="text-[12px] leading-[16px] text-slate-500">{post.likeCount || 0} likes</span>
                  </div>
                  <span className="text-[12px] leading-[16px] text-slate-500">{post.commentCount || 0} comments</span>
                </div>

                <div className="flex justify-between items-center pt-[8px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleLike(post.id)}
                    className={`flex-1 flex items-center gap-[8px] text-[14px] font-[600] ${post.likedByMe ? 'text-indigo-600' : 'text-slate-500'} hover:text-indigo-600`}
                  >
                    <ThumbsUp className={`w-[20px] h-[20px] ${post.likedByMe ? 'fill-current' : ''}`} />
                    Like
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (activeCommentPostId === post.id) {
                        setActiveCommentPostId(null);
                      } else {
                        setActiveCommentPostId(post.id);
                        if (!commentsByPost[post.id]) {
                          axiosRequest.get(`/api/Post/${post.id}/comments`)
                            .then(res => {
                              setCommentsByPost(prev => ({ ...prev, [post.id]: res.data.data || res.data || [] }));
                            })
                            .catch(e => console.error("Failed to load comments", e));
                        }
                      }
                    }}
                    className="flex-1 flex items-center gap-[8px] text-[14px] font-[600] text-slate-500 hover:text-indigo-600"
                  >
                    <MessageSquare className="w-[20px] h-[20px]" />
                    Comment
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleRepost(post.id)}
                    className="flex-1 flex items-center gap-[8px] text-[14px] font-[600] text-slate-500 hover:text-indigo-600"
                  >
                    <Share2 className="w-[20px] h-[20px]" />
                    Share
                  </Button>
                </div>

                {activeCommentPostId === post.id && (
                  <div className="mt-[16px] bg-slate-100 p-[16px] rounded-2xl border-[1px] border-slate-200">

                    <div className="space-y-[12px] mb-[16px] max-h-[300px] overflow-y-auto pr-[8px]">
                      {commentsByPost[post.id]?.map((comment: any) => (
                        <div key={comment.id} className="flex gap-[12px]">
                          <Avatar className="w-[32px] h-[32px]">
                            <AvatarImage src={comment.authorImageUrl ? getFullImageUrl(comment.authorImageUrl) : `https://ui-avatars.com/api/?name=${comment.authorName || 'U'}&background=random`} />
                            <AvatarFallback>{(comment.authorName || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-white p-[12px] rounded-2xl border-[1px] border-[#e2e4f0]">
                            <div className="flex justify-between items-start mb-[4px]">
                              <span className="text-[14px] font-[600] text-slate-900">{comment.authorName || 'Unknown User'}</span>
                              <span className="text-[12px] text-[#8f90a6]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-[14px] text-slate-500 whitespace-pre-wrap break-words">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      {(!commentsByPost[post.id] || commentsByPost[post.id].length === 0) && (
                        <div className="text-center py-[12px] text-[13px] text-[#8f90a6]">No comments yet. Be the first to comment!</div>
                      )}
                    </div>

                    <div className="flex gap-[12px] items-center">
                      <Avatar className="w-[32px] h-[32px]">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                        className="flex-1 bg-white border-[1px] border-slate-200 rounded-full px-[16px] py-[8px] focus:outline-none focus:border-indigo-600 text-[14px] text-slate-900 placeholder:text-[#8f90a6]"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleComment(post.id)}
                        disabled={!commentText.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-[16px]"
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
          ))
        )}

        <Card className="rounded-2xl p-[24px] border-[2px] border-dashed border-[#006c49]/30 bg-[#006c49]/5 relative overflow-hidden   transition-all duration-200">
          <div className="flex justify-between items-start mb-[16px]">
            <div>
              <Badge className="bg-[#006c49] text-[#ffffff] text-[10px] font-[700] px-[8px] py-[2px] rounded-full uppercase tracking-widest hover:bg-[#006c49]">AI Match Insight</Badge>
              <h3 className="text-[20px] leading-[28px] font-[600] text-[#006c49] mt-[8px]">Your profile is trending in Fintech</h3>
            </div>
            <BrainCircuit className="w-[24px] h-[24px] text-[#006c49]" />
          </div>
          <p className="text-[14px] leading-[20px] text-slate-500 mb-[24px]">
            Based on your recent activity and skill updates, you have a <strong className="text-[#006c49]">94% Match Score</strong> for 12 new Senior Engineering roles at top-tier financial firms.
          </p>
          <div className="flex gap-[16px]">
            <Button className="bg-[#006c49] text-[#ffffff] hover:bg-[#006c49]/90 px-[24px]">View Matches</Button>
            <Button variant="outline" className="text-[#006c49] border-[#006c49] hover:bg-[#006c49]/10 px-[24px]">Improve Score</Button>
          </div>
        </Card>
      </div>

      <aside className="md:col-span-3 space-y-[24px]">
        <Card className="rounded-2xl p-[24px] shadow-lg shadow-slate-200/40 border-slate-200   transition-all duration-200">
          <div className="flex justify-between items-center mb-[24px]">
            <h3 className="text-[16px] leading-[24px] font-[600] text-slate-900">Jobs for you</h3>
            <Info className="w-[20px] h-[20px] text-[#c4c5d5]" />
          </div>
          <div className="space-y-[24px]">
            <div className="flex gap-[16px] items-start group cursor-pointer">
              <Avatar className="w-[40px] h-[40px] rounded-2xl border-[1px] border-slate-200 bg-[#ffffff] p-[4px]">
                <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZHTRu5sp9MhTXwsBvaSvjum0gLljEAEKFfCowADDBpeGfh489MDTP6nXNq3FPy6I9PWomXluG2scqlUWEgsFxOe4eNTw_ewDrS4ZDNrxvmyb8OJYd1t3f8KKa11AGYAnaemMImSlDme2rqvCgnpR6sKr6Wk6Gq9JchOctKEvvUlWjyzPlrsegpedNkcOJ6iFXeXbnK0lDFZhV-yfU4aazproW9SXotMFGDi7wir59HlcQFbaFgt5jLEDQCURSvtWFmQDPt0hG9Smf" className="object-contain" />
                <AvatarFallback className="rounded-2xl">NC</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-[14px] leading-[20px] font-[600] text-slate-900 group-hover:text-indigo-600 transition-colors">Lead System Architect</h4>
                <p className="text-[12px] leading-[16px] text-slate-500">Nexus Cloud Systems</p>
                <div className="flex items-center gap-[4px] mt-[4px]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#006c49]"></span>
                  <span className="text-[10px] text-[#006c49] font-[700] uppercase">AI Match 98%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-[16px] items-start group cursor-pointer">
              <Avatar className="w-[40px] h-[40px] rounded-2xl border-[1px] border-slate-200 bg-[#ffffff] p-[4px]">
                <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBQYDagrhHqGFMKAeDFO5JUSA-UnTxfdxhN4Z5ycJHh0XnIF9aq4KlZJv0P_oanGWdV5lnO4Hh48nYqospxfuRBAo9TabqL4AdxJSKiR74q3ehEoltKKwIoO2hl2Ctpcd_y8sg9XRtQBr8l5ji1V2RpSZC_PkLEmrNIcKR85OH5x07g5bzyew-JDP01bKxecsfbjVvuGIcC1agnmtKrQulUjPEL_SlZfxeyqtzx93mtajyK9ZW35T1rA4VDSUrK0x3d-NL3g59rwE1" className="object-contain" />
                <AvatarFallback className="rounded-2xl">GQ</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-[14px] leading-[20px] font-[600] text-slate-900 group-hover:text-indigo-600 transition-colors">Full Stack Developer</h4>
                <p className="text-[12px] leading-[16px] text-slate-500">Global Quant Finance</p>
                <div className="flex items-center gap-[4px] mt-[4px]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#eab308]"></span>
                  <span className="text-[10px] text-[#eab308] font-[700] uppercase">Trending Role</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-[24px] border-indigo-600 text-indigo-600 hover:bg-indigo-600/5">
            View all recommendations
          </Button>
        </Card>

        <Card className="rounded-2xl p-[24px] shadow-lg shadow-slate-200/40 border-slate-200   transition-all duration-200">
          <div className="flex items-center gap-[8px] mb-[24px]">
            <Sparkles className="w-[20px] h-[20px] text-[#006c49]" />
            <h3 className="text-[16px] leading-[24px] font-[600] text-slate-900">Trending Skills</h3>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-[#ffffff] cursor-pointer transition-all">Next.js 14</Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-[#ffffff] cursor-pointer transition-all">LLM Orchestration</Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-[#ffffff] cursor-pointer transition-all">Rust</Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-[#ffffff] cursor-pointer transition-all">Vector DBs</Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-[#ffffff] cursor-pointer transition-all">Web3 Identity</Badge>
          </div>
          <p className="text-[12px] leading-[16px] text-slate-500 mt-[24px] italic">
            AI Insight: Skills in <span className="text-[#006c49] font-[700]">LLM Orchestration</span> increased by 140% in your network this month.
          </p>
        </Card>

        <div className="px-[16px] text-center">
          <div className="flex flex-wrap justify-center gap-x-[16px] gap-y-[4px] mb-[8px]">
            <a className="text-[12px] leading-[16px] text-slate-500 hover:text-indigo-600 transition-colors" href="#">About</a>
            <a className="text-[12px] leading-[16px] text-slate-500 hover:text-indigo-600 transition-colors" href="#">Accessibility</a>
            <a className="text-[12px] leading-[16px] text-slate-500 hover:text-indigo-600 transition-colors" href="#">Privacy</a>
            <a className="text-[12px] leading-[16px] text-slate-500 hover:text-indigo-600 transition-colors" href="#">Terms</a>
          </div>
          <p className="text-[12px] leading-[16px] text-[#c4c5d5]">© 2026 AIJob. All rights reserved.</p>
        </div>
      </aside>

      {postToDelete !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-[24px]">
              <h2 className="text-[20px] font-[700] text-slate-900 mb-[8px]">Delete Post</h2>
              <p className="text-[14px] text-slate-500">Are you sure you want to delete this post? This action cannot be undone.</p>
            </div>
            <div className="px-[24px] py-[16px] bg-slate-100 border-t-[1px] border-slate-200 flex justify-end gap-[12px]">
              <Button
                variant="outline"
                onClick={() => setPostToDelete(null)}
                className="rounded-full border-slate-200 text-slate-500 hover:bg-[#e2e4f0]"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="rounded-full bg-[#e11d48] text-white hover:bg-[#be123c]"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {editingPostId !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-[24px]">
              <h2 className="text-[20px] font-[700] text-slate-900 mb-[16px]">Edit Post</h2>
              <textarea
                className="w-full px-[16px] py-[12px] bg-slate-100 border-[1px] border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-[2px] focus:ring-[#00288e]/20 transition-all text-[16px] leading-[24px] resize-none min-h-[120px]"
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
              />
            </div>
            <div className="px-[24px] py-[16px] bg-slate-100 border-t-[1px] border-slate-200 flex justify-end gap-[12px]">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingPostId(null);
                  setEditPostContent('');
                }}
                className="rounded-full border-slate-200 text-slate-500 hover:bg-[#e2e4f0]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditPostSubmit}
                disabled={isSavingEdit || !editPostContent.trim()}
                className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
});

export default CandidateFeed;