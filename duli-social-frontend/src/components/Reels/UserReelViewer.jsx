import React, { useState, useEffect, useRef } from 'react';
import { Modal, Box, Backdrop, Fade, Typography, Avatar, IconButton, useTheme } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import { useDispatch, useSelector } from 'react-redux';
import { likeShortVideoAction, createShortVideoCommentAction } from '../../Redux/ShortVideo/shortVideo.action';
import { followUserAction } from '../../Redux/Auth/auth.action';

const UserReelViewer = ({ open, handleClose, reel }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const [commentText, setCommentText] = useState("");
  const videoRef = useRef(null);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '100%', md: '85%', lg: '75%' },
    height: { xs: '100%', md: '90vh' },
    bgcolor: 'background.paper', 
    boxShadow: 24,
    p: 0,
    outline: 'none',
    borderRadius: { xs: 0, md: '12px' },
    overflow: 'hidden',
    display: 'flex'
  };

  useEffect(() => {
      if (open && videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(e => console.log("Autoplay blocked", e));
      }
  }, [open]);

  if (!reel) return null;

  const isLiked = reel.likedUserIds?.includes(auth.user?.id);
  const isMe = auth.user?.id === reel.user.id;
  const isFollowed = auth.user?.followings?.some(u => (u.id || u) === reel.user.id);

  const handleLikeReel = () => dispatch(likeShortVideoAction(reel.id));
  const handleFollowUser = () => dispatch(followUserAction(reel.user.id));
  
  const handleCreateComment = () => {
      if (!commentText.trim()) return;
      const reqData = { shortVideoId: reel.id, data: { content: commentText } };
      dispatch(createShortVideoCommentAction(reqData));
      setCommentText("");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500, sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' } } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          
          <Box sx={{ 
              width: { xs: '100%', md: '60%', lg: '63%' }, 
              bgcolor: 'black', 
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: 1,
              borderColor: 'divider' 
          }}>
             <Box sx={{ 
                 position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                 zIndex: 0, 
                 filter: 'blur(40px) brightness(0.7)', 
                 transform: 'scale(1.2)', 
                 opacity: 0.5 
             }}>
                 <video src={reel.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
             </Box>

             <Box sx={{ position: 'relative', zIndex: 1, height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <video 
                   ref={videoRef}
                   src={reel.videoUrl} 
                   className='h-full w-full object-contain'
                   controls 
                   autoPlay 
                   loop 
                />
             </Box>

             <IconButton 
                onClick={handleClose}
                sx={{ position: 'absolute', top: 15, left: 15, zIndex: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.6)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
             >
                 <CloseIcon />
             </IconButton>
          </Box>


          <Box sx={{ 
              width: { xs: '0', md: '40%', lg: '37%' },
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              bgcolor: 'background.paper',
              color: 'text.primary'       
          }}>
             
             {/* Header */}
             <div className='p-4 border-b flex items-center justify-between' style={{ borderColor: theme.palette.divider }}>
                <div className='flex items-center gap-3'>
                    <Avatar src={reel.user?.image} sx={{ width: 42, height: 42, border: `1px solid ${theme.palette.divider}` }} />
                    <div className='flex flex-col'>
                        <Typography variant='subtitle2' fontWeight={700} sx={{ lineHeight: 1.2, color: 'text.primary' }}>
                            {reel.user?.firstName} {reel.user?.lastName}
                        </Typography>
                        
                        {!isMe && (
                            <Typography variant='caption' onClick={handleFollowUser} sx={{ cursor: 'pointer', fontWeight: 600, color: isFollowed ? 'text.secondary' : '#0095f6', mt: 0.5 }}>
                                {isFollowed ? "Following" : "Follow"}
                            </Typography>
                        )}
                    </div>
                </div>
                <IconButton onClick={handleClose} sx={{ color: 'text.primary' }}>
                    <CloseIcon />
                </IconButton>
             </div>

             {/* Body: Comments */}
             <div className='flex-1 overflow-y-auto p-4 scrollbar-hide'>
                 {/* Caption */}
                 {reel.title && (
                     <div className='flex gap-3 mb-5'>
                         <Avatar src={reel.user?.image} sx={{width: 32, height: 32}}/>
                         <div className='flex flex-col max-w-[85%]'>
                             <div className='text-sm'>
                                 <span className='font-semibold mr-2'>{reel.user?.firstName}</span>
                                 <span>{reel.title}</span>
                             </div>
                             <span className='text-xs mt-1' style={{ color: theme.palette.text.secondary }}>{new Date(reel.createdAt).toLocaleDateString()}</span>
                         </div>
                     </div>
                 )}

                 {/* Comment List */}
                 {reel.comments && reel.comments.length > 0 ? (
                    reel.comments.map(comment => (
                        <div key={comment.id} className='flex gap-3 mb-4'>
                            <Avatar src={comment.user?.image} sx={{width: 32, height: 32}}/>
                            <div className='flex flex-col max-w-[85%]'>
                                <div 
                                    className='text-sm p-2.5 rounded-2xl rounded-tl-none'
                                    style={{ 
                                        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f0f2f5' 
                                    }}
                                >
                                    <span className='font-semibold mr-2' style={{ color: theme.palette.text.primary }}>{comment.user?.firstName}</span>
                                    <span style={{ color: theme.palette.text.primary }}>{comment.content}</span>
                                </div>
                                <div className='flex gap-3 mt-1 ml-1'>
                                    <span className='text-xs' style={{ color: theme.palette.text.secondary }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                 ) : (
                    <div className='flex flex-col items-center justify-center h-40 text-gray-500'>
                        <ChatBubbleOutlineIcon sx={{fontSize: 40, mb: 1, opacity: 0.5}}/>
                        <Typography variant='body2'>No comments yet.</Typography>
                    </div>
                 )}
             </div>

             {/* Footer */}
             <div className='p-4 border-t' style={{ borderColor: theme.palette.divider, backgroundColor: theme.palette.background.paper }}>
                 <div className='flex justify-between items-center mb-3'>
                     <div className='flex gap-4'>
                        <div onClick={handleLikeReel} className='cursor-pointer hover:scale-110 transition-transform'>
                            {isLiked ? <FavoriteIcon sx={{color: '#ed4956', fontSize: 28}} /> : <FavoriteBorderIcon sx={{fontSize: 28, color: 'text.primary'}} />}
                        </div>
                        <div className='cursor-pointer hover:scale-110 transition-transform'>
                            <ChatBubbleOutlineIcon sx={{fontSize: 28, color: 'text.primary'}} />
                        </div>
                        <div className='cursor-pointer hover:scale-110 transition-transform'>
                            <SendIcon sx={{fontSize: 28, transform: 'rotate(-45deg)', mb: 0.5, color: 'text.primary'}} />
                        </div>
                     </div>
                     <div><BookmarkBorderIcon sx={{fontSize: 28, color: 'text.primary'}} /></div>
                 </div>

                 <Typography variant='body2' fontWeight={700} sx={{mb: 0.5, color: 'text.primary'}}>
                    {reel.likedUserIds?.length || 0} likes
                 </Typography>
                 
                 <Typography variant='caption' sx={{display: 'block', mb: 2, fontSize: '10px', letterSpacing: '0.5px', color: 'text.secondary'}}>
                    {new Date(reel.createdAt).toDateString().toUpperCase()}
                 </Typography>

                 {/* Input Comment */}
                 <div className='flex items-center gap-3 border-t pt-3' style={{ borderColor: theme.palette.divider }}>
                     <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        className='w-full outline-none text-sm bg-transparent'
                        style={{ color: theme.palette.text.primary }}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateComment()}
                     />
                     <button 
                        className={`text-[#0095f6] font-semibold text-sm transition ${!commentText.trim() ? 'opacity-50 cursor-default' : 'hover:text-[#00376b]'}`}
                        onClick={handleCreateComment}
                        disabled={!commentText.trim()}
                     >
                        Post
                     </button>
                 </div>
             </div>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UserReelViewer;