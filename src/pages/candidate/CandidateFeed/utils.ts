export const getFullImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://backendaijob-1.onrender.com';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};
