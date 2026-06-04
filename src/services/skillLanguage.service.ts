import { axiosRequest } from '../utils/token';

export const skillLanguageService = {
  fetchSkills: async (userId: number) => {
    const res = await axiosRequest.get(`/api/UserSkill/by-user/${userId}`);
    return Array.isArray(res.data) ? res.data : (res.data?.data || []);
  },
  addSkill: async (name: string) => {
    const { data } = await axiosRequest.post('/api/UserSkill', { name });
    return data;
  },
  fetchLanguages: async (userId: number) => {
    const res = await axiosRequest.get(`/api/UserLanguage/by-user/${userId}`);
    return Array.isArray(res.data) ? res.data : (res.data?.data || []);
  },
  addLanguage: async (name: string) => {
    const { data } = await axiosRequest.post('/api/UserLanguage', { name });
    return data;
  }
};
