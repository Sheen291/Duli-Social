import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { findPostByIdAction, createCommentAction, likePostAction, savePostAction } from '../../Redux/Post/post.action';
import { Box, Typography, IconButton, CircularProgress, useTheme, Divider, Avatar } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark'; 
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AvatarWithStory from '../../components/Story/AvatarWithStory'; 

const PostDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { post, auth } = useSelector(store => store); 
    const [commentText, setCommentText] = useState("");

    const [isLikedLocal, setIsLikedLocal] = useState(false);
    const [isSavedLocal, setIsSavedLocal] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(findPostByIdAction(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (post.createdComment) {
            dispatch(findPostByIdAction(id)); 
        }
    }, [post.createdComment, id, dispatch]);

    const item = post.post; 
    useEffect(() => {
        if (item && auth.user) {
            const _isLiked = item.likedUserIds?.includes(auth.user.id) || item.likedUsers?.some(u => u.id === auth.user.id);
            setIsLikedLocal(_isLiked);
            const _isSaved = auth.user.savedPostIds?.some(pid => pid == item.id);
            setIsSavedLocal(_isSaved);
        }
    }, [item, auth.user]);

    if (post.loading || !item) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
            </Box>
        );
    }

    const handleLikePost = () => {
        setIsLikedLocal((prev) => !prev); 
        dispatch(likePostAction(item.id)); 
    };

    const handleSavePost = () => {
        setIsSavedLocal((prev) => !prev);
        dispatch(savePostAction(item.id));
    };

    const handleCreateComment = () => {
        if (!commentText.trim()) return;
        const reqData = {
            postId: item.id,
            data: { content: commentText }
        };
        dispatch(createCommentAction(reqData));
        setCommentText("");
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', width: '100%', bgcolor: 'background.default', py: { xs: 0, md: 4 } }}>
            <Box sx={{ width: '100%', maxWidth: '1000px', mb: 2, px: 2, display: { md: 'block', xs: 'flex' }, alignItems: 'center', mt: { xs: 2, md: 0 } }}>
                 <div onClick={() => navigate(-1)} className='flex items-center gap-2 cursor-pointer hover:opacity-70 w-fit' style={{ color: theme.palette.text.primary }}>
                    <KeyboardBackspaceIcon />
                    <span className='font-semibold'>Back</span>
                </div>
            </Box>

            {/* MAIN CARD */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    width: '100%', 
                    maxWidth: '1000px', 
                    height: { xs: 'auto', md: '85vh' }, // Mobile: Auto, PC: 85vh
                    bgcolor: 'background.paper', 
                    boxShadow: { md: 3 }, 
                    border: { md: '1px solid' }, 
                    borderColor: 'divider', 
                    borderRadius: { md: '4px' },
                    overflow: 'hidden' 
                }}
            >
                
                <Box 
                    sx={{ 
                        width: { xs: '100%', md: '60%' }, 
                        bgcolor: 'black', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        maxHeight: { xs: '500px', md: '100%' }, 
                        aspectRatio: { xs: '1/1', md: 'auto' } 
                    }}
                >
                    {item.image ? (
                        <img src={item.image || null} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                        <video src={item.video || null} controls autoPlay loop style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    )}
                </Box>

                <Box 
                    sx={{ 
                        width: { xs: '100%', md: '40%' }, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        borderLeft: { md: '1px solid' }, 
                        borderColor: 'divider',
                        height: '100%' 
                    }}
                >
                    
                    {/* HEADER */}
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate(`/profile/${item.user.id}`)}>
                            <AvatarWithStory user={item.user} size={40} />
                            <div className='flex flex-col'>
                                <span className='font-semibold text-sm hover:underline' style={{ color: theme.palette.text.primary }}>
                                    {item.user.firstName} {item.user.lastName}
                                </span>
                                {item.location && <span className='text-xs text-gray-500'>{item.location}</span>}
                            </div>
                        </div>
                        <IconButton><MoreHorizIcon sx={{ color: 'text.primary' }} /></IconButton>
                    </Box>

                    {/* COMMENT LIST */}
                    <Box 
                        sx={{ 
                            flex: 1, 
                            overflowY: 'auto', 
                            p: 2, 
                            '&::-webkit-scrollbar': { display: 'none' },
                            maxHeight: { xs: '45vh', md: 'none' },
                            minHeight: { xs: '200px', md: '0' }
                        }}
                    >
                        <div className='flex gap-3 mb-5'>
                            <AvatarWithStory user={item.user} size={32} />
                            <div className='text-sm'>
                                <span className='font-semibold mr-2' style={{ color: theme.palette.text.primary }}>
                                    {item.user.firstName}
                                </span>
                                <span style={{ color: theme.palette.text.primary }}>{item.caption}</span>
                                <div className='text-xs text-gray-500 mt-1'>
                                    {new Date(item.createdAt).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
                                </div>
                            </div>
                        </div>

                        {item.comments && item.comments.length > 0 ? (
                            item.comments.map((comment) => (
                                <div key={comment.id} className='flex gap-3 mb-4 items-start'>
                                    <div className='mt-1 cursor-pointer' onClick={() => navigate(`/profile/${comment.user.id}`)}>
                                         <AvatarWithStory user={comment.user} size={32} />
                                    </div>
                                    <div className='text-sm w-full'>
                                        <span className='font-semibold mr-2 cursor-pointer hover:underline' style={{ color: theme.palette.text.primary }} onClick={() => navigate(`/profile/${comment.user.id}`)}>
                                            {comment.user?.firstName}
                                        </span>
                                        <span style={{ color: theme.palette.text.primary }}>{comment.content}</span>
                                        <div className='flex items-center gap-4 text-xs text-gray-500 mt-1'>
                                            <span>Reply</span>
                                        </div>
                                    </div>
                                    <FavoriteBorderIcon sx={{ fontSize: 12, color: 'text.secondary', cursor: 'pointer', mt: 1 }} />
                                </div>
                            ))
                        ) : (
                            <div className='flex justify-center items-center h-20 text-gray-400 text-sm'>No comments yet.</div>
                        )}
                    </Box>

                    {/* FOOTER ACTIONS */}
                    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2, bgcolor: 'background.paper' }}>
                        <div className='flex justify-between items-center mb-2'>
                            <div className='flex items-center gap-4'>
                                <IconButton onClick={handleLikePost} sx={{ p: 0 }}>
                                    {isLikedLocal ? (
                                        <FavoriteIcon sx={{ fontSize: '1.8rem', color: '#ed4956' }} />
                                    ) : (
                                        <FavoriteBorderIcon sx={{ fontSize: '1.8rem', color: 'text.primary' }} />
                                    )}
                                </IconButton>
                                <IconButton sx={{ p: 0 }}><ChatBubbleOutlineIcon sx={{ fontSize: '1.8rem', color: 'text.primary' }} /></IconButton>
                                <IconButton sx={{ p: 0 }}><SendIcon sx={{ fontSize: '1.8rem', color: 'text.primary' }} /></IconButton>
                            </div>
                            <IconButton onClick={handleSavePost} sx={{ p: 0 }}>
                                {isSavedLocal ? (
                                    <BookmarkIcon sx={{ fontSize: '1.8rem', color: 'text.primary' }} /> 
                                ) : (
                                    <BookmarkBorderIcon sx={{ fontSize: '1.8rem', color: 'text.primary' }} />
                                )}
                            </IconButton>
                        </div>
                        
                        <Typography fontWeight={600} variant='body2' sx={{ mb: 0.5, color: 'text.primary' }}>
                            {item.likedUserIds?.length || 0} likes
                        </Typography>
                        
                        <Typography variant='caption' color='text.secondary' sx={{ fontSize: '0.7rem', display: 'block', mb: 2 }}>
                             {new Date(item.createdAt).toDateString().toUpperCase()}
                        </Typography>

                        <div className='flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800'>
                            <EmojiEmotionsIcon sx={{fontSize: '1.5rem', color: 'text.secondary', cursor: 'pointer'}} />
                            <input 
                                type="text" placeholder="Add a comment..." className="w-full outline-none bg-transparent text-sm"
                                style={{ color: theme.palette.text.primary }}
                                value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateComment()}
                            />
                            <span className={`text-[#913057] font-semibold text-sm cursor-pointer ${!commentText.trim() && 'opacity-50'}`} onClick={handleCreateComment}>Post</span>
                        </div>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default PostDetail;