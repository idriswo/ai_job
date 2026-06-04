import { memo, useState } from 'react';
import { Card } from '../../../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { MessageSquare, MoreHorizontal, Send, Share2, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Post, PostComment } from '../types';
import { commentService } from '../../../../services/comment.service';
import { feedService } from '../../../../services/feed.service';
import { getFullImageUrl } from '../utils';

interface Props {
  post: Post;
  currentUserId: number | null;
  onDeleteRequest: (postId: number) => void;
  onEditRequest: (postId: number, content: string) => void;
  onUpdatePostInState: (updatedPost: Post) => void;
}

export const PostCard = memo(({ post, currentUserId, onDeleteRequest, onEditRequest, onUpdatePostInState }: Props) => {
  const [openDropdownId, setOpenDropdownId] = useState<boolean>(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentText, setCommentText] = useState('');

  const handleLike = async () => {
    const isLiked = post.likedByMe;
    const optimisticPost = {
      ...post,
      likedByMe: !isLiked,
      likeCount: (post.likeCount || 0) + (isLiked ? -1 : 1)
    };
    onUpdatePostInState(optimisticPost);
    try {
      await feedService.likePost(post.id);
    } catch (error) {
      console.error("Failed to like post", error);
      onUpdatePostInState(post); // Revert on failure
    }
  };

  const handleRepost = async () => {
    const optimisticPost = { ...post, repostCount: (post.repostCount || 0) + 1 };
    onUpdatePostInState(optimisticPost);
    try {
      await feedService.repostPost(post.id);
    } catch (error) {
      console.error("Failed to repost", error);
      onUpdatePostInState(post); // Revert
    }
  };

  const toggleComments = async () => {
    if (showComments) {
      setShowComments(false);
    } else {
      setShowComments(true);
      if (comments.length === 0) {
        try {
          const fetchedComments = await commentService.fetchCommentsForPost(post.id);
          setComments(fetchedComments);
        } catch (error) {
          console.error("Error fetching comments", error);
        }
      }
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const data = await commentService.createComment(post.id, commentText);
      const newComment: PostComment = {
        id: data?.id || data?.data?.id || Date.now(),
        content: commentText,
        authorName: 'Me',
        createdAt: new Date().toISOString()
      };
      setComments(prev => [...prev, newComment]);
      setCommentText('');
      onUpdatePostInState({ ...post, commentCount: (post.commentCount || 0) + 1 });
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  return (
    <Card className="rounded-2xl p-[20px] shadow-sm border-slate-200">
      <div className="flex justify-between items-start mb-[16px]">
        <div className="flex gap-[12px]">
          <Avatar className="w-[48px] h-[48px] border-[2px] border-slate-100">
            <AvatarImage src={post.authorImageUrl ? getFullImageUrl(post.authorImageUrl) : `https://ui-avatars.com/api/?name=${post.authorName || 'U'}&background=random`} />
            <AvatarFallback className="rounded-2xl">{(post.authorName || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-[16px] leading-[24px] font-[600] text-slate-900">{post.authorName || 'Unknown User'}</h4>
            <p className="text-[12px] leading-[16px] text-slate-500 mt-[2px]">
              Professional • {new Date(post.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setOpenDropdownId(!openDropdownId)}
            className="w-[32px] h-[32px] rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <MoreHorizontal className="w-[20px] h-[20px]" />
          </button>
          
          {openDropdownId && (
            <div className="absolute right-0 mt-[4px] w-[160px] bg-white rounded-xl shadow-lg border border-slate-100 py-[8px] z-10">
              {(post.userId === currentUserId || post.user?.id === currentUserId) && currentUserId ? (
                <>
                  <button 
                    onClick={() => {
                      onEditRequest(post.id, post.content);
                      setOpenDropdownId(false);
                    }}
                    className="w-full px-[16px] py-[8px] text-left text-[14px] text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Edit Post
                  </button>
                  <button 
                    onClick={() => {
                      onDeleteRequest(post.id);
                      setOpenDropdownId(false);
                    }}
                    className="w-full px-[16px] py-[8px] text-left text-[14px] text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete Post
                  </button>
                </>
              ) : (
                <button className="w-full px-[16px] py-[8px] text-left text-[14px] text-slate-600 hover:bg-slate-50 transition-colors">
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-[16px]">
        <p className="text-[15px] leading-[24px] text-slate-800 whitespace-pre-wrap break-words">
          {post.content}
        </p>

        {post.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-100">
            <img 
              src={getFullImageUrl(post.imageUrl)} 
              alt="Post attachment" 
              className="w-full max-h-[400px] object-cover hover:scale-[1.02] transition-transform duration-500" 
            />
          </div>
        )}

        <div className="flex justify-between items-center pt-[8px] pb-[16px] border-b border-slate-100">
          <div className="flex items-center gap-[4px] bg-slate-50 px-[8px] py-[4px] rounded-lg">
            <div className="w-[20px] h-[20px] rounded-full bg-indigo-100 flex items-center justify-center">
              <ThumbsUp className="w-[12px] h-[12px] text-indigo-600" />
            </div>
            <span className="text-[12px] leading-[16px] text-slate-500">{post.likeCount || 0} likes</span>
          </div>
          <div className="flex gap-[16px]">
            <span className="text-[12px] leading-[16px] text-slate-500">{post.commentCount || 0} comments</span>
            <span className="text-[12px] leading-[16px] text-slate-500">{post.repostCount || 0} reposts</span>
          </div>
        </div>

        <div className="flex justify-between pt-[4px]">
          <button 
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-[8px] text-[14px] font-[600] ${post.likedByMe ? 'text-indigo-600' : 'text-slate-500'} hover:text-indigo-600 transition-colors py-[8px] rounded-lg hover:bg-slate-50`}
          >
            <ThumbsUp className={`w-[20px] h-[20px] ${post.likedByMe ? 'fill-current' : ''}`} />
            Like
          </button>
          <button 
            onClick={toggleComments}
            className="flex-1 flex items-center justify-center gap-[8px] text-[14px] font-[600] text-slate-500 hover:text-indigo-600 transition-colors py-[8px] rounded-lg hover:bg-slate-50"
          >
            <MessageSquare className="w-[20px] h-[20px]" />
            Comment
          </button>
          <button 
            onClick={handleRepost}
            className="flex-1 flex items-center justify-center gap-[8px] text-[14px] font-[600] text-slate-500 hover:text-indigo-600 transition-colors py-[8px] rounded-lg hover:bg-slate-50"
          >
            <Share2 className="w-[20px] h-[20px]" />
            Repost
          </button>
          <button className="flex-1 flex items-center justify-center gap-[8px] text-[14px] font-[600] text-slate-500 hover:text-indigo-600 transition-colors py-[8px] rounded-lg hover:bg-slate-50">
            <Send className="w-[20px] h-[20px]" />
            Send
          </button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-[20px] pt-[20px] border-t border-slate-100">
                <div className="space-y-[16px] mb-[16px] max-h-[300px] overflow-y-auto pr-[8px]">
                  {comments.map((comment: PostComment) => (
                    <div key={comment.id} className="flex gap-[12px]">
                      <Avatar className="w-[32px] h-[32px]">
                        <AvatarImage src={comment.authorImageUrl ? getFullImageUrl(comment.authorImageUrl) : `https://ui-avatars.com/api/?name=${comment.authorName || 'U'}&background=random`} />
                        <AvatarFallback>{(comment.authorName || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-2xl p-[12px] rounded-tl-sm">
                          <div className="flex justify-between items-start mb-[4px]">
                            <span className="text-[14px] font-[600] text-slate-900">{comment.authorName || 'Unknown User'}</span>
                            <span className="text-[12px] text-[#8f90a6]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[14px] text-slate-500 whitespace-pre-wrap break-words">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <div className="text-center py-[20px] text-[14px] text-slate-500 bg-slate-50 rounded-xl">
                      No comments yet. Be the first to share your thoughts!
                    </div>
                  )}
                </div>

                <div className="flex gap-[12px] items-center">
                  <Avatar className="w-[32px] h-[32px]">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                      placeholder="Write a comment..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-full pl-[16px] pr-[40px] py-[8px] text-[14px] focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                    />
                    <button 
                      onClick={handleComment}
                      disabled={!commentText.trim()}
                      className="absolute right-[4px] top-[4px] p-[6px] text-indigo-600 hover:bg-indigo-50 rounded-full disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-[16px] h-[16px]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
});
