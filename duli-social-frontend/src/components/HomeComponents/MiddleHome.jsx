import { Avatar, Card, IconButton, Box, Typography, useTheme, CircularProgress } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import StoryCircle from './StoryCircle';
import ImageIcon from '@mui/icons-material/Collections';
import VideoIcon from '@mui/icons-material/Videocam';
import EmotionIcon from '@mui/icons-material/EmojiEmotions';
import { useSelector, useDispatch } from 'react-redux';
import PostCard from '../Post/PostCard';
import PostCreate from '../Post/PostCreate';
import { getAllPostAction } from '../../Redux/Post/post.action';
import { getHomeStoryAction, openStoryViewAction } from '../../Redux/Story/story.action';
import StoryCreate from '../Story/StoryCreate';
import { Helmet } from 'react-helmet-async';
import { v4 as uuidv4 } from 'uuid';

const MiddleHome = () => {
  const theme = useTheme(); 
  const { auth, post, story } = useSelector(store => store);
  const dispatch = useDispatch();

  const sessionIdRef = useRef(uuidv4());
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [page, setPage] = useState(0);
  const [openStoryCreate, setOpenStoryCreate] = useState(false);

  const handleOpenCreatePost = () => setOpenCreatePost(true);
  const handleClose = () => setOpenCreatePost(false);

  useEffect(() => {
    const reqData = { page: page, sessionId: sessionIdRef.current };
    dispatch(getAllPostAction(reqData));
  }, [page, post.commentCreated, dispatch]);

  useEffect(() => {
    if (story.stories.length === 0) {
        dispatch(getHomeStoryAction());
    }
  }, [story.stories.length, dispatch]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50; 
    if (bottom && !post.lastPage && !post.loading) {
        setPage((prevPage) => prevPage + 1);
    }
  };

  const groupedStories = story.stories ? Object.values(story.stories.reduce((acc, item) => {
    if (!acc[item.user.id]) acc[item.user.id] = { user: item.user, stories: [] };
    acc[item.user.id].stories.push(item);
    return acc;
  }, {})) : [];

  return (
    <Box 
        onScroll={handleScroll}
        sx={{ 
            maxWidth: '600px', mx: 'auto', pb: 10, w: '100%', 
            height: '100vh', overflowY: 'scroll',
            minWidth: '300px',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            bgcolor: 'background.default',
            color: 'text.primary'
        }}
    >
      <Helmet><title>Duli Social</title></Helmet>

      <Box sx={{ 
          display: 'flex', alignItems: 'center', p: 2.5, gap: 2, 
          overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } 
      }}>
        <Box 
            onClick={() => setOpenStoryCreate(true)}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '80px' }}
        >
          <Avatar sx={{ 
              width: 64, height: 64, 
              bgcolor: 'background.paper',
              border: '2px dashed', borderColor: '#912f56' 
          }}>
            <AddIcon sx={{ fontSize: '2rem', color: '#912f56' }} />
          </Avatar>
          <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 500 }}>New</Typography>
        </Box>

        {groupedStories.map((group, index) => (
             <Box key={index} onClick={() => dispatch(openStoryViewAction(group.user.id))}> 
                <StoryCircle user={group.user} />
             </Box>
        ))}
      </Box>

      <Card sx={{ 
          mt: 2, borderRadius: '16px', bgcolor: 'background.paper', 
          backgroundImage: 'none', 
          boxShadow: theme.palette.mode === 'dark' ? 'none' : '0px 2px 4px rgba(0,0,0,0.05)',
          border: theme.palette.mode === 'dark' ? 1 : 0,
          borderColor: 'divider'
      }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar src={auth.user?.image} sx={{ width: 40, height: 40, border: 1, borderColor: 'divider' }} />
            <Box 
              onClick={handleOpenCreatePost}
              sx={{ 
                flex: 1, px: 2, py: 1.2, borderRadius: '20px', cursor: 'pointer',
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f2f5',
                color: 'text.secondary', transition: '0.2s',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Typography variant="body2">What's on your mind, {auth.user?.firstName}?</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
              {[
                { icon: <ImageIcon sx={{ color: '#58c472' }} />, label: 'Photo' },
                { icon: <VideoIcon sx={{ color: '#f23e5c' }} />, label: 'Video' },
                { icon: <EmotionIcon sx={{ color: '#f8c03e' }} />, label: 'Feeling' }
              ].map((act, i) => (
                <Box 
                  key={i} onClick={handleOpenCreatePost}
                  sx={{ 
                    display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', 
                    px: 2, py: 0.8, borderRadius: '8px', '&:hover': { bgcolor: 'action.hover' } 
                  }}
                >
                   {act.icon}
                   <Typography variant="caption" fontWeight="600" color="text.secondary">{act.label}</Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {post.posts.map((item, index) => (
          <PostCard key={item.id || index} item={item} />
        ))}
        
        {post.loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={28} sx={{ color: '#912f56' }} />
            </Box>
        )}
      </Box>

      <PostCreate handleClose={handleClose} open={openCreatePost} />
      <StoryCreate open={openStoryCreate} handleClose={() => setOpenStoryCreate(false)} />
    </Box>
  );
};

export default MiddleHome;