import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { channelService } from '../../services/channelService';

const CompetitorAnalysis = () => {
  const [channelUrl, setChannelUrl] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  const extractChannelId = async (input) => {
    try {
      // Try to parse as URL first
      try {
        const urlObj = new URL(input);
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
          // Handle different URL formats
          if (urlObj.pathname.startsWith('/channel/')) {
            // Direct channel ID
            return urlObj.pathname.split('/')[2];
          } else if (urlObj.pathname.startsWith('/c/')) {
            // Custom URL
            const customUrl = urlObj.pathname.split('/')[2];
            return await channelService.getChannelIdFromCustomUrl(customUrl);
          } else if (urlObj.pathname.startsWith('/@')) {
            // Handle
            const handle = urlObj.pathname.substring(2); // Remove /@
            return await channelService.getChannelIdFromHandle(handle);
          }
        }
      } catch (urlError) {
        console.log('Not a valid URL, trying as handle or search term');
      }

      // If not a valid URL, try as handle or search term
      if (input.startsWith('@')) {
        return await channelService.getChannelIdFromHandle(input);
      }

      // Last resort: search for the channel
      const searchResults = await channelService.searchChannels(input);
      if (searchResults && searchResults.length > 0) {
        return searchResults[0].id.channelId;
      }

      throw new Error('Could not find channel');
    } catch (error) {
      console.error('Error extracting channel ID:', error);
      throw new Error('Could not find channel. Please try a different URL or channel name.');
    }
  };

  const handleAddCompetitor = async () => {
    try {
      setError(null);
      setLoading(true);

      const channelId = await extractChannelId(channelUrl);
      if (!channelId) {
        throw new Error('Could not find channel');
      }

      // Check for duplicates before fetching channel data
      if (competitors.some(c => c.channelInfo.id === channelId)) {
        throw new Error('Channel already added');
      }

      const channelData = await channelService.getChannelAnalytics(channelId);
      setCompetitors(prev => [...prev, channelData]);
      setChannelUrl('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCompetitor = (channelId) => {
    setCompetitors(prev => prev.filter(c => c.channelInfo.id !== channelId));
  };

  const handleCompare = () => {
    if (competitors.length < 2) {
      setError('Add at least two channels to compare');
      return;
    }

    const analysis = {
      viewsComparison: competitors.map(c => ({
        channelName: c.channelInfo.snippet.title,
        averageViews: c.analytics.averageViews,
      })),
      engagementComparison: competitors.map(c => ({
        channelName: c.channelInfo.snippet.title,
        engagementRate: parseFloat(c.analytics.engagementRate),
      })),
      uploadFrequency: competitors.map(c => ({
        channelName: c.channelInfo.snippet.title,
        uploadsPerMonth: c.analytics.uploadsPerMonth,
      })),
      growthRates: competitors.map(c => ({
        channelName: c.channelInfo.snippet.title,
        growthRate: parseFloat(c.analytics.growthRate),
      })),
    };

    setAnalysisData(analysis);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Competitor Analysis
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Enter YouTube channel URL or name"
              value={channelUrl}
              onChange={(e) => {
                setChannelUrl(e.target.value);
                setError(null); // Clear error when input changes
              }}
              disabled={loading}
              error={Boolean(error)}
              helperText={error}
              placeholder="e.g., @ChannelName or https://youtube.com/@ChannelName"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddCompetitor}
              disabled={loading || !channelUrl.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {loading ? 'Adding...' : 'Add Channel'}
            </Button>
          </Grid>
        </Grid>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {competitors.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Added Channels
          </Typography>
          <List>
            {competitors.map((competitor) => (
              <React.Fragment key={competitor.channelInfo.id}>
                <ListItem>
                  <ListItemText
                    primary={competitor.channelInfo.snippet.title}
                    secondary={`${competitor.analytics.totalVideos} videos • ${competitor.analytics.averageViews.toLocaleString()} avg. views`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveCompetitor(competitor.channelInfo.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ mt: 3, mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCompare}
              startIcon={<CompareArrowsIcon />}
              disabled={competitors.length < 2}
            >
              Compare Channels
            </Button>
          </Box>
        </>
      )}

      {analysisData && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Average Views Comparison
                </Typography>
                {analysisData.viewsComparison.map((data) => (
                  <Box key={data.channelName} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">{data.channelName}</Typography>
                    <Typography variant="body1">
                      {data.averageViews.toLocaleString()} views
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Engagement Rate Comparison
                </Typography>
                {analysisData.engagementComparison.map((data) => (
                  <Box key={data.channelName} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">{data.channelName}</Typography>
                    <Typography variant="body1">
                      {data.engagementRate}% engagement
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upload Frequency
                </Typography>
                {analysisData.uploadFrequency.map((data) => (
                  <Box key={data.channelName} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">{data.channelName}</Typography>
                    <Typography variant="body1">
                      {data.uploadsPerMonth} uploads/month
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Growth Rate
                </Typography>
                {analysisData.growthRates.map((data) => (
                  <Box key={data.channelName} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">{data.channelName}</Typography>
                    <Typography variant="body1">
                      {data.growthRate}% growth rate
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CompetitorAnalysis;
