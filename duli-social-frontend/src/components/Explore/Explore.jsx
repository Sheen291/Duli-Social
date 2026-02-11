import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPostAction } from '../../Redux/Post/post.action';
import { Box, ImageList, ImageListItem, useMediaQuery, useTheme, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 

const Explore = () => {
  const dispatch = useDispatch();
  const { post } = useSelector(store => store);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  const navigate = useNavigate();

  useEffect(() => {
    const reqData = { page: 0, sessionId: "explore_session" };
    dispatch(getAllPostAction(reqData));
  }, [dispatch]);

  const mediaPosts = post.posts.filter(item => item.image || item.video);

  return (
    <Box sx={{ 
        width: '100%', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        bgcolor: 'background.default',
        color: 'text.primary'
    }}>
      <Helmet>
        <title>Explore | Duli Social</title>
        <meta name="description" content="Discover new photos and videos from people around the world on Duli Social." />
      </Helmet>
      
      <Box sx={{ 
          width: '100%', 
          maxWidth: '900px', 
          p: 2, 
          display: isMobile ? 'block' : 'none' 
      }}>
         <Box sx={{ 
             bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#efefef', 
             borderRadius: '8px', 
             p: 1, 
             display: 'flex', 
             alignItems: 'center', 
             color: 'text.secondary' 
         }}>
             <SearchIcon fontSize="small" />
             <Typography variant="body2" sx={{ ml: 1 }}>Search</Typography>
         </Box>
      </Box>

      <Box sx={{ width: '100%', maxWidth: '935px', padding: { xs: 0.5, md: 1 } }}>
        <ImageList 
            variant="quilted" 
            cols={3} 
            gap={isMobile ? 2 : 25}
            sx={{ margin: 0 }}
        >
          {mediaPosts.map((item) => (
            <ImageListItem 
                key={item.id} 
                sx={{ 
                    cursor: 'pointer',
                    position: 'relative',
                    aspectRatio: '1/1',
                    overflow: 'hidden',
                    '&:hover .overlay': { opacity: 1 } 
                }}
                onClick={() => navigate(`/post/${item.id}`)}
            >
              {item.image ? (
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
              ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <video
                        src={item.video}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 1 }}>
                         <svg aria-label="Clip" color="white" fill="white" height="18" role="img" viewBox="0 0 24 24" width="18"><path d="m12.823 1 2.974 5.002h-5.58l-2.65-4.46a1 1 0 0 1 .232-1.303l.011-.009A1.001 1.001 0 0 1 8.444.156l2.103 3.541h1.472L10.22 1.002A1 1 0 0 1 11.23.003h.594a1 1 0 0 1 .999.997Zm-9.61 5.002 2.974-5.002a1 1 0 0 1 1.054-.486L5.385 3.541l2.102 3.541H1.583a.5.5 0 0 1-.5-.5h0A.5.5 0 0 1 1.583 6Zm18.5 0h-5.58l2.974-5.002a1 1 0 0 1 .998-.998h.594a1.001 1.001 0 0 1 1.01 1.001l-1.724 2.903 2.103 3.541a.5.5 0 0 1-.375.555Zm-1.637 2H3.747a5.006 5.006 0 0 0-5.006 5.005v7.01a5.006 5.006 0 0 0 5.006 5.006h16.506a5.006 5.006 0 0 0 5.006-5.006v-7.01a5.006 5.006 0 0 0-5.006-5.005Z"></path></svg>
                    </Box>
                  </Box>
              )}

              <Box 
                className="overlay"
                sx={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: { xs: 1, md: 3 },
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    color: 'white',
                }}
              >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FavoriteIcon sx={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} /> 
                      <Typography fontWeight="bold">{item.likedUserIds?.length || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ChatBubbleIcon sx={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} /> 
                      <Typography fontWeight="bold">{item.totalComments || 0}</Typography>
                  </Box>
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
};

export default Explore;