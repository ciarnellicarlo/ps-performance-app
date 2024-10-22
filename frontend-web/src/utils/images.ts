export const getOptimizedImageUrl = (url: string): string => {
    if (!url) return '/default_cover.jpg';
    let fullUrl = url.startsWith('//') ? `https:${url}` : url;
    if (!fullUrl.startsWith('http')) {
      fullUrl = `https://${fullUrl}`;
    }
    return fullUrl.replace('t_thumb', 't_cover_big');
  };