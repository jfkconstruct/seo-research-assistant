import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Chip,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  Visibility as ViewsIcon,
  ThumbUp as LikesIcon,
  Comment as CommentsIcon,
  TrendingUp as TrendingIcon,
  Speed as CompetitionIcon,
} from '@mui/icons-material';

const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const KeywordResults = ({ data, loading, error }) => {
  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Main Metrics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                YouTube Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ViewsIcon sx={{ mr: 1 }} />
                    <div>
                      <Typography variant="subtitle2" color="text.secondary">
                        Avg. Views
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(data.avgViews)}
                      </Typography>
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LikesIcon sx={{ mr: 1 }} />
                    <div>
                      <Typography variant="subtitle2" color="text.secondary">
                        Avg. Likes
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(data.avgLikes)}
                      </Typography>
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CommentsIcon sx={{ mr: 1 }} />
                    <div>
                      <Typography variant="subtitle2" color="text.secondary">
                        Avg. Comments
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(data.avgComments)}
                      </Typography>
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Competition Score */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CompetitionIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Competition Score</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={data.competitionScore}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {data.competitionScore}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {data.competitionScore < 30
                  ? 'Low competition - Good opportunity'
                  : data.competitionScore < 70
                  ? 'Moderate competition'
                  : 'High competition - Challenging to rank'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Engagement Rate */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Engagement Rate</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {data.engagement.toFixed(2)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average engagement rate based on likes and comments relative to views
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing Videos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Videos
              </Typography>
              <List>
                {data.topVideos?.map((video, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Link
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="inherit"
                            underline="hover"
                          >
                            {video.title}
                          </Link>
                        }
                        secondary={
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Chip
                              size="small"
                              icon={<ViewsIcon />}
                              label={`${formatNumber(video.viewCount)} views`}
                            />
                            <Chip
                              size="small"
                              icon={<LikesIcon />}
                              label={formatNumber(video.likeCount)}
                            />
                            <Chip
                              size="small"
                              icon={<CommentsIcon />}
                              label={formatNumber(video.commentCount)}
                            />
                          </Stack>
                        }
                      />
                    </ListItem>
                    {index < data.topVideos.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default KeywordResults;
