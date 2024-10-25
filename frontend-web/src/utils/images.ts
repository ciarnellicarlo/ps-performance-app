type ImageSize = 't_cover_big' | 't_720p';

export const getOptimizedImageUrl = (url: string, size: ImageSize = 't_720p'): string => {
    if (!url) return '/default_cover.jpg';
    let fullUrl = url.startsWith('//') ? `https:${url}` : url;
    if (!fullUrl.startsWith('http')) {
      fullUrl = `https://${fullUrl}`;
    }
    return fullUrl.replace('t_thumb', size);
};