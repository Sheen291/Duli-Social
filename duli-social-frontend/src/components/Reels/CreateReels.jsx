import React, { useState, useRef } from 'react';
import { Box, Button, Typography, TextField, CircularProgress, IconButton, Avatar, Fade, useTheme, Backdrop, useMediaQuery } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MovieIcon from '@mui/icons-material/Movie'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createShortVideoAction } from '../../Redux/ShortVideo/shortVideo.action';
import { cloudUpload } from '../../utils/cloudUpload';

const CreateReels = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [caption, setCaption] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    
    const inputRef = useRef(null);

    const handleSelectVideo = () => inputRef.current.click();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setSelectedVideo(file);
            setVideoPreview(URL.createObjectURL(file));
        } else {
            alert("Please select a valid video file!");
        }
    };

    const handleRemoveVideo = () => {
        setSelectedVideo(null);
        setVideoPreview(null);
    };

    const handleClose = () => navigate(-1); 

    const handleCreateReel = async () => {
        if (!selectedVideo) return;
        setIsLoading(true);
        try {
            const videoUrl = await cloudUpload(selectedVideo, "video");
            const reqData = { videoUrl: videoUrl, title: caption };
            await dispatch(createShortVideoAction(reqData));
            setIsLoading(false);
            navigate('/short-videos');
        } catch (error) {
            console.log("Error creating reel:", error);
            setIsLoading(false);
        }
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
    const handleDragLeave = () => { setIsDragOver(false); };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            setSelectedVideo(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    return (
        <Fade in={true} timeout={400}>
            <div style={{ outline: 'none' }}> 
                <Box 
                    sx={{ 
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        width: '100%', height: '100vh', zIndex: 2000,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 20, right: 20, color: 'white' }}>
                        <CloseIcon sx={{ fontSize: 30 }} />
                    </IconButton>

                    <Box sx={{ 
                        width: '100%',
                        maxWidth: videoPreview ? '1000px' : '550px', 
                        height: videoPreview ? '80vh' : '75vh', 
                        maxHeight: '800px',
                        bgcolor: 'background.paper',
                        borderRadius: '16px', 
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden', 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        color: 'text.primary'
                    }}>
                        
                        {/* HEADER */}
                        <Box sx={{ 
                            p: 1.5, borderBottom: '1px solid', borderColor: 'divider', 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            bgcolor: 'background.paper', zIndex: 10
                        }}>
                            {videoPreview ? (
                                <IconButton onClick={handleRemoveVideo}>
                                    <ArrowBackIcon sx={{color: 'text.primary'}}/>
                                </IconButton>
                            ) : (<Box sx={{width: 40}}></Box>)}
                            
                            <Typography variant="body1" fontWeight="bold">Create New Reel</Typography>
                            
                            {videoPreview ? (
                                <Button 
                                    variant="text" disabled={!selectedVideo || isLoading} onClick={handleCreateReel}
                                    sx={{ fontWeight: 'bold', textTransform: 'none', color: '#0095f6' }}
                                >
                                    {isLoading ? <CircularProgress size={20} /> : "Share"}
                                </Button>
                            ) : (<Box sx={{width: 40}}></Box>)}
                        </Box>

                        {/* BODY */}
                        <Box sx={{ 
                            flexGrow: 1, display: 'flex', 
                            flexDirection: {xs: 'column', md: 'row'}, 
                            overflowY: {xs: 'auto', md: 'hidden'} 
                        }}>
                            {!videoPreview ? (
                                <Box 
                                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                                    sx={{ 
                                        width: '100%', height: '100%', 
                                        display: 'flex', flexDirection: 'column', 
                                        justifyContent: 'center', alignItems: 'center', gap: 3, p: 4,
                                        bgcolor: isDragOver ? 'action.hover' : 'transparent'
                                    }}
                                >
                                    <MovieIcon sx={{ fontSize: '7rem', color: isDragOver ? '#0095f6' : 'text.primary', opacity: 0.8 }} />
                                    <Typography variant="h6" fontWeight="400">Drag videos here</Typography>
                                    <Button variant="contained" onClick={handleSelectVideo} sx={{textTransform: 'none', borderRadius: '8px', px: 3, py: 1, bgcolor: '#912f56'}}>
                                        Select from computer
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    {/* VIDEO PREVIEW */}
                                    <Box sx={{ flex: {md: 1.6}, width: '100%', bgcolor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <video src={videoPreview} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} controls autoPlay loop />
                                    </Box>

                                    {/* CAPTION AREA */}
                                    <Box sx={{ flex: {md: 1, xs: 'none'}, width: '100%', borderLeft: {md: '1px solid'}, borderColor: 'divider', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                                        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar src={auth.user?.image} sx={{width: 32, height: 32}} />
                                            <Typography variant="subtitle2" fontWeight="bold">{auth.user?.firstName} {auth.user?.lastName}</Typography>
                                        </Box>
                                        <Box sx={{ px: 2.5 }}>
                                            <TextField
                                                fullWidth multiline rows={isMobile ? 4 : 8}
                                                placeholder="Write a caption..." variant="standard"
                                                InputProps={{ disableUnderline: true, style: { fontSize: '1rem', color: theme.palette.text.primary } }}
                                                value={caption} onChange={(e) => setCaption(e.target.value)}
                                            />
                                        </Box>
                                    </Box>
                                </>
                            )}
                            <input type="file" accept="video/*" ref={inputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                        </Box>
                    </Box>
                </Box>

                <Backdrop open={isLoading} sx={{ zIndex: 3000, color: '#fff' }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </Fade>
    );
};

export default CreateReels;