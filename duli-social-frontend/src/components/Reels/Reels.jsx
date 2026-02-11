import React, { useState, useRef, useEffect } from 'react';
import { Box, Avatar, Typography, IconButton, Button, useTheme } from '@mui/material'; 
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { getAllShortVideoAction, likeShortVideoAction } from '../../Redux/ShortVideo/shortVideo.action';
import { followUserAction } from '../../Redux/Auth/auth.action';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ReelsComment from './ReelsComment';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom'; 
import { v4 as uuidv4 } from 'uuid';

const Reels = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { shortVideo, auth } = useSelector(store => store); 
    const containerRef = useRef(null);
    const sessionIdRef = useRef(uuidv4());
    const [page, setPage] = useState(0);
    const { reelId } = useParams(); 

    useEffect(() => {
        const reqData = { page: page, sessionId: sessionIdRef.current };
        dispatch(getAllShortVideoAction(reqData));
    }, [page, dispatch]);

    useEffect(() => {
        if (reelId && shortVideo.shortVideos?.length > 0) {
            const index = shortVideo.shortVideos.findIndex(vid => vid.id == reelId);
            if (index !== -1 && containerRef.current) {
                const scrollPosition = index * containerRef.current.clientHeight;
                containerRef.current.scrollTo({ top: scrollPosition, behavior: 'instant' });
            }
        }
    }, [shortVideo.shortVideos, reelId]);

    const handleScrollButton = (direction) => {
        if (containerRef.current) {
            const scrollAmount = containerRef.current.clientHeight; 
            containerRef.current.scrollBy({
                top: direction === 'down' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleOnScroll = () => {
        if (containerRef.current) {
            const { scrollTop, clientHeight } = containerRef.current;
            const currentIndex = Math.round(scrollTop / clientHeight);
            if (shortVideo.shortVideos.length > 0 && currentIndex >= shortVideo.shortVideos.length - 2) {
                if (!shortVideo.lastPage && !shortVideo.loading) {
                    setPage((prev) => prev + 1);
                }
            }
        }
    };

    const containerStyle = {
        height: '100vh',
        width: '100%',
        overflowY: 'scroll', 
        scrollSnapType: 'y mandatory', 
        scrollBehavior: 'smooth',
        scrollbarWidth: 'none', 
        '&::-webkit-scrollbar': { display: 'none' },
        backgroundColor: theme.palette.background.default, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overscrollBehavior: 'contain'
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100vh', bgcolor: 'background.default' }}>
            <Helmet><title>Reels | Duli Social</title></Helmet>
            
            <Box sx={containerStyle} ref={containerRef} onScroll={handleOnScroll}>
                {shortVideo.shortVideos?.length > 0 ? (
                    shortVideo.shortVideos.map((reel) => (
                      <ReelItem key={reel.id} reel={reel} authUserId={auth.user?.id} />
                    ))
                ) : (
                    <Box sx={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Typography color="text.secondary">No reels available.</Typography>
                    </Box>
                )}
            </Box>
            
            <Box sx={{ position: 'absolute', right: { xs: '10px', md: '50px' }, top: '50%', transform: 'translateY(-50%)', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 2, zIndex: 100 }}>
                <IconButton onClick={() => handleScrollButton('up')} sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}>
                    <ArrowUpwardIcon />
                </IconButton>
                <IconButton onClick={() => handleScrollButton('down')} sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}>
                    <ArrowDownwardIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

const ReelItem = ({ reel, authUserId }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const { auth } = useSelector(store => store);
    
    const [openComment, setOpenComment] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const isLiked = reel.likedUserIds?.includes(authUserId);
    const isFollowed = auth.user?.followings?.some(u => (u.id || u) === reel.user.id);
    const isMe = auth.user?.id === reel.user.id;

    useEffect(() => {
        const video = videoRef.current;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.6 });
        if (video) observer.observe(video);
        return () => { if (video) observer.unobserve(video); };
    }, []);

    const handleVideoClick = () => {
        if (videoRef.current.paused) videoRef.current.play();
        else videoRef.current.pause();
    };

    const handleFollowUser = (e) => {
        e.stopPropagation();
        dispatch(followUserAction(reel.user.id));
    };

    const itemStyle = {
        minHeight: '100vh',
        height: '100vh',
        width: { xs: '100%', sm: '450px', md: '450px' }, 
        flexShrink: 0,
        scrollSnapAlign: 'start', 
        scrollSnapStop: 'always', 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        bgcolor: 'black', 
        borderLeft: 1, borderRight: 1,
        borderColor: 'divider',
        margin: '0 auto',
        overflow: 'hidden'
    };

    return (
        <Box sx={{...itemStyle, position: 'relative'}}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, filter: 'blur(40px)', opacity: 0.6 }}>
                 <video src={reel.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
            </Box>

            <Box sx={{ position: 'relative', width: { xs: '100%', md: '450px' }, height: '100%', zIndex: 1, bgcolor: 'black' }}>
                <video
                    ref={videoRef}
                    src={reel.videoUrl}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                    loop
                    onClick={handleVideoClick}
                    playsInline
                />

                <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', pointerEvents: 'none' }} />

                <Box sx={{ position: 'absolute', bottom: '100px', right: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, zIndex: 10 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <IconButton onClick={() => dispatch(likeShortVideoAction(reel.id))} sx={{ color: isLiked ? '#ff0055' : 'white', p: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                            {isLiked ? <FavoriteIcon sx={{ fontSize: '2.4rem' }} /> : <FavoriteBorderIcon sx={{ fontSize: '2.4rem' }} />}
                        </IconButton>
                        <Typography variant="caption" fontWeight="600" sx={{ mt: 0.5, color: 'white', display: 'block', textShadow: '0 1px 3px rgba(0,0,0,1)' }}>
                            {reel.likedUserIds?.length || 0}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <IconButton onClick={() => setOpenComment(!openComment)} sx={{ color: 'white', p: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                            <ChatBubbleOutlineIcon sx={{ fontSize: '2.4rem' }} />
                        </IconButton>
                        <Typography variant="caption" fontWeight="600" sx={{ mt: 0.5, color: 'white', display: 'block', textShadow: '0 1px 3px rgba(0,0,0,1)' }}>
                            {reel.totalComments || 0}
                        </Typography>
                    </Box>

                    <IconButton sx={{ color: 'white', p: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}> <SendIcon sx={{ fontSize: '2.2rem' }} /> </IconButton>
                    <IconButton sx={{ color: 'white', p: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}> <MoreVertIcon sx={{ fontSize: '2.2rem' }} /> </IconButton>
                </Box>

                {/* --- USER INFO & CAPTION --- */}
                <Box sx={{ position: 'absolute', bottom: '25px', left: '15px', color: 'white', zIndex: 10, width: 'calc(100% - 80px)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
                        <Avatar 
                            onClick={() => navigate(`/profile/${reel.user.id}`)}
                            src={reel.user?.image} 
                            sx={{ width: 40, height: 40, border: '2px solid white', cursor: 'pointer' }} 
                        />
                        <Typography 
                            onClick={() => navigate(`/profile/${reel.user.id}`)}
                            variant="subtitle1" 
                            sx={{ fontWeight: '700', cursor: 'pointer', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                        >
                            {reel.user?.firstName} {reel.user?.lastName}
                        </Typography>

                        {!isMe && (
                            <Button 
                                variant="outlined" 
                                size="small"
                                onClick={handleFollowUser}
                                sx={{ 
                                    textTransform: 'none', color: 'white', borderColor: 'white', borderRadius: '4px', 
                                    padding: '1px 12px', minWidth: 'auto', height: '26px', fontSize: '0.75rem', fontWeight: 'bold',
                                    bgcolor: isFollowed ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)', borderColor: 'white' }
                                }}
                            >
                                {isFollowed ? "Following" : "Follow"}
                            </Button>
                        )}
                    </Box>
                    
                    <Box onClick={() => setIsExpanded(!isExpanded)} sx={{ cursor: 'pointer' }}>
                        <Typography variant="body2" sx={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)', lineHeight: 1.4, display: isExpanded ? 'block' : '-webkit-box', overflow: isExpanded ? 'visible' : 'hidden', WebkitLineClamp: isExpanded ? 'unset' : 2, WebkitBoxOrient: 'vertical' }}>
                            {reel.title}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <ReelsComment open={openComment} handleClose={() => setOpenComment(false)} comments={reel.comments || []} reelId={reel.id} userImage={auth.user?.image} />
        </Box>
    );
};

export default Reels;