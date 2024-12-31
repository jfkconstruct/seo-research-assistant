import axios from 'axios';
import config from '../config';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = config.YOUTUBE_API_KEY;

export const channelService = {
  async getChannelInfo(channelId) {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/channels`, {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: channelId,
          key: API_KEY
        }
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      return response.data.items[0];
    } catch (error) {
      console.error('Error fetching channel info:', error);
      throw error;
    }
  },

  async getChannelVideos(channelId, maxResults = 50) {
    try {
      // Get upload playlist ID
      const channelInfo = await this.getChannelInfo(channelId);
      const uploadsPlaylistId = channelInfo.contentDetails.relatedPlaylists.uploads;

      // Get videos from uploads playlist
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/playlistItems`, {
        params: {
          part: 'snippet,contentDetails',
          playlistId: uploadsPlaylistId,
          maxResults,
          key: API_KEY
        }
      });

      const videoIds = response.data.items.map(item => item.contentDetails.videoId).join(',');
      
      // Get detailed video statistics
      const statsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
        params: {
          part: 'statistics,contentDetails',
          id: videoIds,
          key: API_KEY
        }
      });

      return this.mergeVideoData(response.data.items, statsResponse.data.items);
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      throw error;
    }
  },

  async searchChannels(query) {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'channel',
          maxResults: 5,
          key: API_KEY
        }
      });

      return response.data.items;
    } catch (error) {
      console.error('Error searching channels:', error);
      throw error;
    }
  },

  async getChannelAnalytics(channelId) {
    try {
      const [channelInfo, videos] = await Promise.all([
        this.getChannelInfo(channelId),
        this.getChannelVideos(channelId)
      ]);

      const analytics = this.calculateChannelAnalytics(videos);

      return {
        channelInfo,
        analytics,
        recentVideos: videos.slice(0, 10)
      };
    } catch (error) {
      console.error('Error getting channel analytics:', error);
      throw error;
    }
  },

  async getChannelIdFromCustomUrl(customUrl) {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
        params: {
          part: 'snippet',
          q: customUrl,
          type: 'channel',
          maxResults: 1,
          key: API_KEY
        }
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      return response.data.items[0].id.channelId;
    } catch (error) {
      console.error('Error getting channel ID from custom URL:', error);
      throw error;
    }
  },

  async getChannelIdFromHandle(handle) {
    // Remove @ symbol if present
    const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
        params: {
          part: 'snippet',
          q: `@${cleanHandle}`,
          type: 'channel',
          maxResults: 1,
          key: API_KEY
        }
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      return response.data.items[0].id.channelId;
    } catch (error) {
      console.error('Error getting channel ID from handle:', error);
      throw error;
    }
  },

  mergeVideoData(playlistItems, videoStats) {
    return playlistItems.map(item => {
      const stats = videoStats.find(stat => stat.id === item.contentDetails.videoId);
      return {
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
        statistics: stats ? stats.statistics : {},
        duration: stats ? stats.contentDetails.duration : ''
      };
    });
  },

  calculateChannelAnalytics(videos) {
    const totalVideos = videos.length;
    if (totalVideos === 0) return null;

    // Calculate averages
    const totalViews = videos.reduce((sum, video) => sum + parseInt(video.statistics.viewCount || 0), 0);
    const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.statistics.likeCount || 0), 0);
    const totalComments = videos.reduce((sum, video) => sum + parseInt(video.statistics.commentCount || 0), 0);

    // Calculate upload frequency
    const dates = videos.map(video => new Date(video.publishedAt));
    const oldestVideo = new Date(Math.min(...dates));
    const newestVideo = new Date(Math.max(...dates));
    const daysBetween = (newestVideo - oldestVideo) / (1000 * 60 * 60 * 24);
    
    return {
      averageViews: Math.round(totalViews / totalVideos),
      averageLikes: Math.round(totalLikes / totalVideos),
      averageComments: Math.round(totalComments / totalVideos),
      engagementRate: ((totalLikes + totalComments) / totalViews * 100).toFixed(2),
      uploadsPerMonth: Math.round((totalVideos / daysBetween) * 30),
      totalVideos,
      viewsPerDay: Math.round(totalViews / daysBetween),
      growthRate: this.calculateGrowthRate(videos)
    };
  },

  calculateGrowthRate(videos) {
    if (videos.length < 2) return 0;

    // Sort videos by date
    const sortedVideos = [...videos].sort((a, b) => 
      new Date(a.publishedAt) - new Date(b.publishedAt)
    );

    // Split into two periods
    const midPoint = Math.floor(sortedVideos.length / 2);
    const firstPeriod = sortedVideos.slice(0, midPoint);
    const secondPeriod = sortedVideos.slice(midPoint);

    // Calculate average views for each period
    const firstPeriodViews = firstPeriod.reduce((sum, video) => 
      sum + parseInt(video.statistics.viewCount || 0), 0) / firstPeriod.length;
    const secondPeriodViews = secondPeriod.reduce((sum, video) => 
      sum + parseInt(video.statistics.viewCount || 0), 0) / secondPeriod.length;

    // Calculate growth rate
    return ((secondPeriodViews - firstPeriodViews) / firstPeriodViews * 100).toFixed(2);
  }
};
