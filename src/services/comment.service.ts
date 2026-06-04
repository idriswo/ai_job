import { axiosRequest } from '../utils/token';

export const commentService = {
  fetchCommentsForPost: async (postId: number) => {
    const res = await axiosRequest.get(`/api/Post/${postId}/comments`);
    return res.data?.data || res.data || [];
  },
  createComment: async (postId: number, content: string) => {
    const { data } = await axiosRequest.post(`/api/Post/${postId}/comment`, { content });
    return data;
  }
};
