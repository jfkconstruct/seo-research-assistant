import axios from 'axios';
import config from '../config';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = config.YOUTUBE_API_KEY;

export const keywordService = {
  async getKeywordMetrics(keyword) {
    try {
      console.log('Starting search with keyword:', keyword);
      console.log('Using API Key:', API_KEY ? 'API Key is set' : 'API Key is missing');

      if (!API_KEY) {
        throw new Error('YouTube API key is not configured');
      }

      // Search for videos with the keyword
      const searchResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
        params: {
          part: 'snippet',
          q: keyword,
          type: 'video',
          maxResults: 50,
          key: API_KEY
        }
      });

      console.log('Search response received');

      if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
        throw new Error('No results found for this keyword');
      }

      // Get video statistics for the search results
      const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');
      const statsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
        params: {
          part: 'statistics',
          id: videoIds,
          key: API_KEY
        }
      });

      console.log('Stats response received');

      // Calculate metrics
      const metrics = this.calculateMetrics(statsResponse.data.items);
      
      return {
        keyword,
        searchVolume: searchResponse.data.pageInfo.totalResults,
        avgViews: metrics.avgViews,
        avgLikes: metrics.avgLikes,
        avgComments: metrics.avgComments,
        engagement: metrics.engagement,
        competitionScore: this.calculateCompetitionScore(searchResponse.data.items),
        topVideos: this.formatTopVideos(searchResponse.data.items, statsResponse.data.items)
      };
    } catch (error) {
      console.error('Detailed error information:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          params: error.config?.params
        }
      });

      if (error.response?.status === 403) {
        throw new Error('API quota exceeded or API key is invalid. Please check your YouTube API key.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid request. Please check your search parameters.');
      } else {
        throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch keyword data');
      }
    }
  },

  calculateMetrics(videos) {
    if (!videos || videos.length === 0) {
      return { avgViews: 0, avgLikes: 0, avgComments: 0, engagement: 0 };
    }

    const totalViews = videos.reduce((sum, video) => sum + parseInt(video.statistics.viewCount || 0), 0);
    const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.statistics.likeCount || 0), 0);
    const totalComments = videos.reduce((sum, video) => sum + parseInt(video.statistics.commentCount || 0), 0);

    const avgViews = Math.round(totalViews / videos.length);
    const avgLikes = Math.round(totalLikes / videos.length);
    const avgComments = Math.round(totalComments / videos.length);
    const engagement = avgViews > 0 ? ((avgLikes + avgComments) / avgViews) * 100 : 0;

    return { avgViews, avgLikes, avgComments, engagement };
  },

  calculateCompetitionScore(searchResults) {
    if (!searchResults || searchResults.length === 0) return 0;

    // Factors that indicate competition
    const totalResults = searchResults.length;
    const recentVideos = searchResults.filter(video => {
      const publishedDate = new Date(video.snippet.publishedAt);
      const monthsAgo = (new Date() - publishedDate) / (1000 * 60 * 60 * 24 * 30);
      return monthsAgo <= 3;
    }).length;

    // Calculate competition score (0-100)
    const recentVideoRatio = recentVideos / totalResults;
    return Math.min(100, Math.round(recentVideoRatio * 100));
  },

  formatTopVideos(searchResults, statsResults) {
    return searchResults.slice(0, 5).map((video, index) => {
      const stats = statsResults.find(stat => stat.id === video.id.videoId)?.statistics || {};
      return {
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        viewCount: parseInt(stats.viewCount || 0),
        likeCount: parseInt(stats.likeCount || 0),
        commentCount: parseInt(stats.commentCount || 0),
        url: `https://youtube.com/watch?v=${video.id.videoId}`
      };
    });
  },

  async getRelatedKeywords(keyword) {
    try {
      // Use YouTube's search suggestions
      const response = await axios.get(`http://suggestqueries.google.com/complete/search`, {
        params: {
          client: 'youtube',
          ds: 'yt',
          q: keyword
        },
        headers: {
          'Accept': 'application/json'
        }
      });

      // Format and return related keywords
      return response.data[1].map(suggestion => ({
        term: suggestion,
        relevance: this.calculateRelevanceScore(keyword, suggestion)
      }));
    } catch (error) {
      console.error('Error fetching related keywords:', error);
      throw new Error('Failed to fetch related keywords');
    }
  },

  calculateRelevanceScore(originalKeyword, suggestion) {
    // Simple relevance score based on string similarity
    const original = originalKeyword.toLowerCase();
    const suggested = suggestion.toLowerCase();
    
    // Check if suggestion contains original keyword
    if (suggested.includes(original)) return 100;
    
    // Calculate word overlap
    const originalWords = original.split(' ');
    const suggestedWords = suggested.split(' ');
    const commonWords = originalWords.filter(word => suggestedWords.includes(word));
    
    return Math.round((commonWords.length / Math.max(originalWords.length, suggestedWords.length)) * 100);
  }
};
