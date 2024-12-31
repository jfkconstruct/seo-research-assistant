import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';

const KeywordResults = ({ data, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 2 }}>
        Error: {error}
      </Typography>
    );
  }

  if (!data) {
    return null;
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 30) return 'success';
    if (difficulty < 60) return 'warning';
    return 'error';
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Main Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Search Volume
              </Typography>
              <Typography variant="h4">
                {formatNumber(data.searchVolume)}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                {data.volumeTrend > 0 ? (
                  <TrendingUpIcon color="success" />
                ) : (
                  <TrendingDownIcon color="error" />
                )}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {Math.abs(data.volumeTrend)}% vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Keyword Difficulty
              </Typography>
              <Typography variant="h4">
                {data.difficulty}%
              </Typography>
              <Chip
                label={data.difficulty < 30 ? 'Easy' : data.difficulty < 60 ? 'Moderate' : 'Hard'}
                color={getDifficultyColor(data.difficulty)}
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                CPC
              </Typography>
              <Typography variant="h4">
                ${data.cpc.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Average cost per click
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Related Keywords */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Related Keywords
      </Typography>
      <Grid container spacing={2}>
        {data.relatedKeywords?.map((keyword, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1">{keyword.term}</Typography>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <Typography color="textSecondary" variant="body2">
                      Volume
                    </Typography>
                    <Typography>{formatNumber(keyword.volume)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <Typography color="textSecondary" variant="body2">
                      Difficulty
                    </Typography>
                    <Chip
                      size="small"
                      label={`${keyword.difficulty}%`}
                      color={getDifficultyColor(keyword.difficulty)}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <Typography color="textSecondary" variant="body2">
                      CPC
                    </Typography>
                    <Typography>${keyword.cpc.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <BarChartIcon />
                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                      {keyword.trend}% trend
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KeywordResults;
