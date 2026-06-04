import { memo, useState } from 'react';
import { Card } from '../../../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Button } from '../../../../components/ui/button';
import { Image as ImageIcon, Sparkles, X } from 'lucide-react';
import type { UserInfo } from '../types';

interface Props {
  currentUserInfo: UserInfo | null;
  onPostSubmit: (content: string, imageUrl: string) => Promise<void>;
  isPosting: boolean;
}

export const CreatePostBox = memo(({ currentUserInfo, onPostSubmit, isPosting }: Props) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [postImageUrl, setPostImageUrl] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://backendaijob-1.onrender.com/api/User/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setPostImageUrl(data.imageUrl || data.url || data);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!newPostContent.trim() && !postImageUrl) return;
    await onPostSubmit(newPostContent, postImageUrl);
    setNewPostContent('');
    setPostImageUrl('');
  };

  return (
    <Card className="rounded-2xl p-[20px] shadow-sm border-slate-200">
      <div className="flex gap-[16px]">
        <Avatar className="w-[48px] h-[48px] border-[2px] border-slate-100">
          <AvatarImage src={currentUserInfo?.avatarUrl || ''} />
          <AvatarFallback>{(currentUserInfo?.fullName || 'U').charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-[16px]">
          <textarea 
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's on your mind? Share your professional journey..."
            className="w-full bg-slate-50/50 rounded-xl p-[16px] text-[15px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all min-h-[100px] border border-slate-200/60 placeholder:text-slate-400"
          />
          
          {postImageUrl && (
            <div className="relative inline-block mt-[12px]">
              <img src={postImageUrl.startsWith('http') ? postImageUrl : `https://backendaijob-1.onrender.com${postImageUrl.startsWith('/') ? '' : '/'}${postImageUrl}`} alt="Uploaded" className="max-h-[200px] rounded-lg border border-slate-200 object-cover" />
              <button 
                onClick={() => setPostImageUrl('')}
                className="absolute top-[8px] right-[8px] p-[4px] bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-[14px] h-[14px]" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-[4px]">
            <div className="flex items-center gap-[8px]">
              <label className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors">
                <ImageIcon className="w-[18px] h-[18px]" />
                <span className="text-[14px] font-[500]">Media</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
              </label>
              <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-lg hover:bg-slate-100 text-slate-500 hover:text-amber-500 transition-colors">
                <Sparkles className="w-[18px] h-[18px]" />
                <span className="text-[14px] font-[500]">AI Assist</span>
              </button>
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={isPosting || isUploadingImage || (!newPostContent.trim() && !postImageUrl)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-[24px] rounded-full shadow-sm shadow-indigo-600/20 font-[600]"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});
