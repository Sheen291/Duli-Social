import React from 'react';
import { Card, Box, Typography, useTheme } from '@mui/material';
import Login from './Login';
import Register from './Register';
import { Route, Routes } from 'react-router-dom';

const Authentication = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        height: '100vh', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default',
        backgroundImage: theme.palette.mode === 'dark' 
          ? 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%)' 
          : 'radial-gradient(circle at 50% 50%, #fff 0%, #f0f2f5 100%)'
      }}
    >
      <Box sx={{ px: 2, w: '100%', maxWidth: 450 }}>
        <Card 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.8)' : '0 8px 32px rgba(0,0,0,0.08)',
            borderRadius: '16px',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, spaceY: 1 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900, 
                color: '#912f56',
                letterSpacing: '-1px'
              }}
            >
              Duli Social
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connect to the world around you.
            </Typography>
          </Box>

          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </Card>
      </Box>
    </Box>
  );
};

export default Authentication;