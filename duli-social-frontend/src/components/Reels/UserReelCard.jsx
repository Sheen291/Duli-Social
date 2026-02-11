import React, { useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const UserReelCard = ({ item, onClick }) => {
  const theme = useTheme(); 
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.log("Play error:", error));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      sx={{
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
        aspectRatio: '9/16',
        borderRadius: '8px',
        overflow: 'hidden',
        bgcolor: 'black', 
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'divider',
        '&:hover .reel-overlay': { opacity: 1 },
        '&:hover .reel-info': { opacity: 1 },
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'scale(1.02)' 
        }
      }}
    >
      <video
        ref={videoRef}
        src={item.videoUrl}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        muted
        loop
        playsInline
      />

      <Box
        className="reel-overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0, 0, 0, 0.3)',
          opacity: 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none'
        }}
      />

      <Box
        className="reel-info"
        sx={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'white', 
          opacity: 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
          zIndex: 2
        }}
      >
        <FavoriteIcon sx={{ fontSize: '1rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
        <Typography 
            variant="caption" 
            fontWeight="bold" 
            sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
        >
          {item.likedUserIds?.length || 0}
        </Typography>
      </Box>

      <Box sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'white',
          opacity: 0.8,
          zIndex: 1
      }}>
          <svg aria-label="Reels" color="white" fill="white" height="20" role="img" viewBox="0 0 24 24" width="20">
              <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line>
              <path d="M7 12L12 15L17 12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <path d="M2.049 3h19.901A1.05 1.05 0 0 1 23 4.05v15.9a1.05 1.05 0 0 1-1.05 1.05H2.049A1.05 1.05 0 0 1 1 19.95V4.05A1.05 1.05 0 0 1 2.049 3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
      </Box>
    </Box>
  );
};

export default UserReelCard;