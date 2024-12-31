import axios from 'axios';
import { authService } from './authService';

const GOOGLE_API_BASE_URL = 'https://www.googleapis.com/webmasters/v3/sites';

class GoogleSearchConsoleService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: GOOGLE_API_BASE_URL,
    });

    // Add request interceptor to inject auth token
    this.apiClient.interceptors.request.use(async (config) => {
      const token = await authService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getSiteList() {
    try {
      const response = await this.apiClient.get('/');
      return response.data.siteEntry || [];
    } catch (error) {
      console.error('Error fetching site list:', error);
      throw this.handleError(error);
    }
  }

  async getSearchAnalytics(siteUrl, params) {
    try {
      const encodedUrl = encodeURIComponent(siteUrl);
      const response = await this.apiClient.post(
        `/${encodedUrl}/searchAnalytics/query`,
        {
          startDate: params.startDate,
          endDate: params.endDate,
          dimensions: ['query'],
          rowLimit: 10,
          ...params
        }
      );
      return response.data.rows || [];
    } catch (error) {
      console.error('Error fetching search analytics:', error);
      throw this.handleError(error);
    }
  }

  async getKeywordPerformance(siteUrl, keyword, dateRange = 'last28days') {
    try {
      const dates = this.calculateDateRange(dateRange);
      const response = await this.getSearchAnalytics(siteUrl, {
        ...dates,
        dimensionFilterGroups: [{
          filters: [{
            dimension: 'query',
            operator: 'contains',
            expression: keyword
          }]
        }]
      });

      return this.formatKeywordData(response, keyword);
    } catch (error) {
      console.error('Error fetching keyword performance:', error);
      throw this.handleError(error);
    }
  }

  calculateDateRange(range) {
    const end = new Date();
    let start = new Date();

    switch (range) {
      case 'last7days':
        start.setDate(end.getDate() - 7);
        break;
      case 'last28days':
        start.setDate(end.getDate() - 28);
        break;
      case 'last3months':
        start.setMonth(end.getMonth() - 3);
        break;
      default:
        start.setDate(end.getDate() - 28);
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  }

  formatKeywordData(searchData, keyword) {
    if (!searchData || searchData.length === 0) {
      return {
        keyword,
        clicks: 0,
        impressions: 0,
        ctr: 0,
        position: 0,
        history: []
      };
    }

    // Aggregate data
    const totalClicks = searchData.reduce((sum, row) => sum + (row.clicks || 0), 0);
    const totalImpressions = searchData.reduce((sum, row) => sum + (row.impressions || 0), 0);
    const avgPosition = searchData.reduce((sum, row) => sum + (row.position || 0), 0) / searchData.length;

    return {
      keyword,
      clicks: totalClicks,
      impressions: totalImpressions,
      ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      position: avgPosition,
      history: searchData.map(row => ({
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : 0,
        position: row.position
      }))
    };
  }

  handleError(error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return new Error('Authentication failed. Please check your API credentials.');
        case 403:
          return new Error('Access forbidden. Please check your permissions.');
        case 404:
          return new Error('Resource not found.');
        default:
          return new Error('An error occurred while fetching data from Google Search Console.');
      }
    }
    return new Error('Network error occurred.');
  }
}

export const googleSearchConsoleService = new GoogleSearchConsoleService();
