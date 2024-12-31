import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import KeywordResults from '../../components/KeywordResults';
import { keywordService } from '../../services/keywordService';

const KeywordResearch = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      setError('Please enter a keyword');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await keywordService.getKeywordMetrics(keyword.trim());
      setResults(data);
    } catch (err) {
      console.error('Error fetching keyword data:', err);
      setError(err.message || 'Failed to fetch keyword data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        YouTube Keyword Research
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Enter keyword or phrase"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                variant="outlined"
                error={Boolean(error)}
                helperText={error}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <KeywordResults
        data={results}
        loading={loading}
        error={error}
      />
    </Box>
  );
};

export default KeywordResearch;
