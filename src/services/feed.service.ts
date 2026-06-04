import { axiosRequest } from '../utils/token';

export const feedService = {
  fetchPosts: async (feedType: 'all' | 'feed') => {
    const res = await axiosRequest.get(feedType === 'all' ? '/api/Post' : '/api/Post/feed');
    return res.data?.data || res.data || [];
  },
  createPost: async (content: string, imageUrl: string) => {
    const { data } = await axiosRequest.post('/api/Post', { content, imageUrl });
    return data;
  },
  updatePost: async (postId: number, content: string) => {
    const { data } = await axiosRequest.put(`/api/Post/${postId}`, { content });
    return data;
  },
  deletePost: async (postId: number) => {
    const { data } = await axiosRequest.delete(`/api/Post/${postId}`);
    return data;
  },
  likePost: async (postId: number) => {
    const { data } = await axiosRequest.post(`/api/Post/${postId}/like`);
    return data;
  },
  repostPost: async (postId: number) => {
    const { data } = await axiosRequest.post(`/api/Post/${postId}/repost`);
    return data;
  }
};
