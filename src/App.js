import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import KeywordResearch from './pages/KeywordResearch';

// Components
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="keyword-research" element={<KeywordResearch />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
