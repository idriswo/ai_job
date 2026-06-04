import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import type { UserInfo, UserProfile, Post } from './types';
import { axiosRequest } from '../../../utils/token';
import { feedService } from '../../../services/feed.service';
import { CandidateLeftSidebar } from './components/CandidateLeftSidebar';
import { CandidateRightSidebar } from './components/CandidateRightSidebar';
import { CreatePostBox } from './components/CreatePostBox';
import { PostCard } from './components/PostCard';

const CandidateFeed = memo(() => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserInfo, setCurrentUserInfo] = useState<UserInfo | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [feedType, setFeedType] = useState<'feed' | 'all'>('all');
  
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const meRes = await axiosRequest.get('/api/User/me');
        setCurrentUserInfo(meRes.data);
        setCurrentUserId(meRes.data.id);
        
        try {
          const profRes = await axiosRequest.get(`/api/Profile/by-user/${meRes.data.id}`);
          if (profRes.data) setCurrentUserProfile(profRes.data);
        } catch (e) {
          console.error("No profile found", e);
        }
      } catch (e) {
        console.error("Error fetching user data", e);
      }
    };
    fetchUserData();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await feedService.fetchPosts(feedType);
      setPosts(fetchedPosts.reverse());
    } catch (error) {
      console.error("Failed to load posts", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [feedType]);

  const handlePostSubmit = async (content: string, imageUrl: string) => {
    setIsPosting(true);
    try {
      await feedService.createPost(content, imageUrl);
      toast.success("Post created successfully!");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleEditPostSubmit = async () => {
    if (!editPostContent.trim() || editingPostId === null) return;
    setIsSavingEdit(true);
    try {
      await feedService.updatePost(editingPostId, editPostContent);
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

  const deletePost = async (postId: number) => {
    try {
      await feedService.deletePost(postId);
      toast.success("Post deleted");
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setPostToDelete(null);
    }
  };

  const updatePostInState = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  return (
    <main className="max-w-[1400px] mx-auto px-[24px] py-[32px] grid grid-cols-1 md:grid-cols-12 gap-[24px] text-slate-900 font-sans">
      
      {/* Left Sidebar */}
      <CandidateLeftSidebar 
        currentUserInfo={currentUserInfo} 
        currentUserProfile={currentUserProfile} 
        currentUserId={currentUserId} 
      />

      {/* Main Feed */}
      <section className="md:col-span-9 lg:col-span-6 space-y-[24px]">
        <CreatePostBox 
          currentUserInfo={currentUserInfo}
          onPostSubmit={handlePostSubmit}
          isPosting={isPosting}
        />

        <div className="flex items-center gap-[12px] border-b border-slate-200 pb-[12px]">
          <button 
            onClick={() => setFeedType('all')}
            className={`text-[14px] font-[600] pb-[12px] -mb-[13px] border-b-[2px] transition-colors ${feedType === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            All Posts
          </button>
          <button 
            onClick={() => setFeedType('feed')}
            className={`text-[14px] font-[600] pb-[12px] -mb-[13px] border-b-[2px] transition-colors ${feedType === 'feed' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            My Feed
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-[40px]">
            <div className="w-[32px] h-[32px] border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          posts.map((post: Post) => (
            <PostCard 
              key={post.id || Math.random()} 
              post={post} 
              currentUserId={currentUserId}
              onDeleteRequest={setPostToDelete}
              onEditRequest={(id, content) => { setEditingPostId(id); setEditPostContent(content); }}
              onUpdatePostInState={updatePostInState}
            />
          ))
        )}
      </section>

      {/* Right Sidebar */}
      <CandidateRightSidebar />

      {/* Modals */}
      {postToDelete !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] p-[24px] text-center animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-[18px] font-[700] text-slate-900 mb-[8px]">Delete Post</h3>
            <p className="text-[14px] text-slate-500 mb-[24px]">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex gap-[12px]">
              <Button 
                variant="outline" 
                onClick={() => setPostToDelete(null)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => deletePost(postToDelete)}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
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
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
                className="w-full bg-slate-50 rounded-xl p-[16px] text-[15px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600/20 border border-slate-200 min-h-[150px]"
                placeholder="What do you want to talk about?"
              />
              <div className="flex justify-end gap-[12px] mt-[24px]">
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
                  disabled={!editPostContent.trim() || isSavingEdit}
                  className="bg-[#00288e] hover:bg-[#001c66] text-white rounded-full px-[24px]"
                >
                  {isSavingEdit ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
});

export default CandidateFeed;