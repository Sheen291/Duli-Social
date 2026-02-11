import React, { useEffect, useState } from 'react';
import { Modal, Avatar, Box, Typography, IconButton } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';

const StoryViewer = ({ open, handleClose, stories, initialIndex = 0 }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);

    const currentStory = stories?.[currentStoryIndex];

    useEffect(() => {
        if (open) {
            setCurrentStoryIndex(initialIndex);
            setProgress(0);
        }
    }, [open, initialIndex]);

    useEffect(() => {
        if (!open || !currentStory) return;

        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) return 100;
                return oldProgress + 2; 
            });
        }, 100);

        return () => clearInterval(interval);
    }, [currentStory, open]); 

    useEffect(() => {
        if (progress >= 100) {
            if (currentStoryIndex < stories.length - 1) {
                setCurrentStoryIndex((prev) => prev + 1);
                setProgress(0);
            } else {
                handleClose();
            }
        }
    }, [progress, currentStoryIndex, stories.length, handleClose]);

    const handleNavigate = (direction) => {
        if (direction === "next") {
            if (currentStoryIndex < stories.length - 1) {
                setCurrentStoryIndex(currentStoryIndex + 1);
                setProgress(0);
            } else {
                handleClose();
            }
        } else if (direction === "prev") {
            if (currentStoryIndex > 0) {
                setCurrentStoryIndex(currentStoryIndex - 1);
                setProgress(0);
            } else {
                setProgress(0);
            }
        }
    };

    if (!currentStory) return null;

    return (
        <Modal 
            open={open} 
            onClose={handleClose} 
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' } } }}
        >
            {/* MAIN CARD CONTAINER */}
            <Box sx={{ 
                position: 'relative',
                width: { xs: '100vw', md: '400px' },
                height: { xs: '100vh', md: '85vh' },
                bgcolor: 'black', 
                borderRadius: { xs: 0, md: 4 },
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                outline: 'none'
            }}>
                
                {/* --- TOUCH AREAS FOR NAVIGATION --- */}
                <Box 
                    onClick={() => handleNavigate("prev")}
                    sx={{ position: 'absolute', top: 0, left: 0, width: '30%', height: '100%', zIndex: 20, cursor: 'pointer' }}
                />
                <Box 
                    onClick={() => handleNavigate("next")}
                    sx={{ position: 'absolute', top: 0, right: 0, width: '70%', height: '100%', zIndex: 20, cursor: 'pointer' }}
                />

                {/* --- HEADER OVERLAY (Progress + User Info) --- */}
                <Box sx={{ 
                    position: 'absolute', top: 0, width: '100%', p: 2, zIndex: 30, 
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' 
                }}>
                    
                    {/* Progress Bars */}
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                        {stories.map((_, index) => (
                            <Box key={index} sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 2, flex: 1, overflow: 'hidden' }}>
                                <Box 
                                    sx={{ 
                                        height: '100%', bgcolor: 'white', 
                                        width: index < currentStoryIndex ? '100%' : (index === currentStoryIndex ? `${progress}%` : '0%'),
                                        transition: 'width 0.1s linear'
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>

                    {/* User Info & Close */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={currentStory.user?.image} sx={{ width: 32, height: 32, border: '1px solid white' }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, lineHeight: 1, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                                    {currentStory.user?.firstName} {currentStory.user?.lastName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#e0e0e0', fontSize: '0.7rem' }}>
                                    {new Date(currentStory.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </Typography>
                            </Box>
                        </Box>
                        
                        <IconButton onClick={(e) => { e.stopPropagation(); handleClose(); }} sx={{ color: 'white', zIndex: 40 }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* --- MEDIA CONTENT --- */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#121212' }}>
                    {currentStory.image && (
                        <img src={currentStory.image} alt="story" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    )}
                    {currentStory.video && (
                        <video src={currentStory.video} autoPlay className='w-full h-full object-contain' />
                    )}
                </Box>
                
                {/* --- CAPTION OVERLAY --- */}
                {currentStory.caption && (
                    <Box sx={{ 
                        position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', px: 2, zIndex: 25 
                    }}>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: 'white', fontWeight: 500, 
                                bgcolor: 'rgba(0,0,0,0.5)', px: 2, py: 1, borderRadius: 4,
                                display: 'inline-block' 
                            }}
                        >
                            {currentStory.caption}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default StoryViewer;