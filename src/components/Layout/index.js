import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SearchIcon from '@mui/icons-material/Search';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="youtube"
            sx={{ mr: 2 }}
          >
            <YouTubeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            YouTube Research Assistant
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/keyword-research"
            startIcon={<SearchIcon />}
            sx={{ mr: 2 }}
          >
            Keyword Research
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/competitor-analysis"
            startIcon={<CompareArrowsIcon />}
          >
            Competitor Analysis
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {new Date().getFullYear()} YouTube Research Assistant
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
