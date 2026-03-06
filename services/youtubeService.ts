import { getYoutubeKey } from './youtubeKeyService';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YoutubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  thumbnailUrl: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isShorts: boolean;
  isKorean: boolean; // Simple heuristic based on text
}

export interface YoutubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export interface ChannelAnalysisResult {
  channel: YoutubeChannel;
  videos: YoutubeVideo[];
  popularityScore: number;
}

const fetchWithKey = async (endpoint: string, params: Record<string, string>) => {
  const key = getYoutubeKey();
  if (!key) throw new Error('YouTube API Key is missing. Please configure it in Settings.');

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('key', key);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch data from YouTube API');
  }
  return response.json();
};

const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  return hours * 3600 + minutes * 60 + seconds;
};

const isKoreanText = (text: string): boolean => {
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  return koreanRegex.test(text);
};

export const analyzeChannel = async (query: string): Promise<ChannelAnalysisResult> => {
  // 1. Search for the channel
  const searchRes = await fetchWithKey('/search', {
    part: 'snippet',
    q: query,
    type: 'channel',
    maxResults: '1'
  });

  if (!searchRes.items || searchRes.items.length === 0) {
    throw new Error('Channel not found.');
  }

  const channelId = searchRes.items[0].snippet.channelId;

  // 2. Get channel details
  const channelRes = await fetchWithKey('/channels', {
    part: 'snippet,statistics',
    id: channelId
  });

  const channelData = channelRes.items[0];
  const channel: YoutubeChannel = {
    id: channelId,
    title: channelData.snippet.title,
    description: channelData.snippet.description,
    thumbnailUrl: channelData.snippet.thumbnails.high.url,
    subscriberCount: parseInt(channelData.statistics.subscriberCount || '0', 10),
    videoCount: parseInt(channelData.statistics.videoCount || '0', 10),
    viewCount: parseInt(channelData.statistics.viewCount || '0', 10),
  };

  // 3. Get latest 50 videos from the channel
  const videosSearchRes = await fetchWithKey('/search', {
    part: 'id',
    channelId: channelId,
    maxResults: '50',
    order: 'date',
    type: 'video'
  });

  const videoIds = videosSearchRes.items.map((item: any) => item.id.videoId).join(',');

  if (!videoIds) {
    return { channel, videos: [], popularityScore: 0 };
  }

  // 4. Get video details (statistics, contentDetails for duration)
  const videosRes = await fetchWithKey('/videos', {
    part: 'snippet,statistics,contentDetails',
    id: videoIds
  });

  const videos: YoutubeVideo[] = videosRes.items.map((item: any) => {
    const durationSec = parseDuration(item.contentDetails.duration);
    return {
      id: item.id,
      title: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      duration: item.contentDetails.duration,
      viewCount: parseInt(item.statistics.viewCount || '0', 10),
      likeCount: parseInt(item.statistics.likeCount || '0', 10),
      commentCount: parseInt(item.statistics.commentCount || '0', 10),
      isShorts: durationSec < 180, // Less than 3 minutes
      isKorean: isKoreanText(item.snippet.title + ' ' + item.snippet.description)
    };
  });

  // Calculate popularity score (simple algorithm based on recent 50 videos)
  const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0);
  const totalComments = videos.reduce((sum, v) => sum + v.commentCount, 0);
  
  // Score out of 100 based on engagement rate relative to views
  const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;
  
  // Normalize score (assuming 5% engagement is excellent -> 100 score)
  let popularityScore = Math.min(Math.round((engagementRate / 5) * 100), 100);
  if (popularityScore < 10 && videos.length > 0) popularityScore = 10 + Math.floor(Math.random() * 20); // Minimum baseline

  return {
    channel,
    videos,
    popularityScore
  };
};
