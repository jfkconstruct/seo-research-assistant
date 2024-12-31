import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { authService } from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await authService.initGoogleAuth();
        if (authService.isAuthenticated()) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error initializing Google Auth:', error);
        setError('Failed to initialize Google authentication');
      }
    };

    initAuth();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.signIn();
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          SEO Research Assistant
        </Typography>
        <Paper
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h2" variant="h5" gutterBottom>
            Sign In
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            Sign in to access Search Console data and track your SEO performance
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
