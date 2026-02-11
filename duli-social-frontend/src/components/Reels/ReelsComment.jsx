import React, { useState } from 'react';
import { Box, Avatar, Typography, IconButton, TextField, useTheme } from '@mui/material'; // 1. Import useTheme
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch } from 'react-redux';
import { createShortVideoCommentAction } from '../../Redux/ShortVideo/shortVideo.action';

const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const postedDate = new Date(createdAt);
    const diffInMs = now - postedDate;
    
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInSeconds < 60) return "Just now";
    else if (diffInMinutes < 60) return `${diffInMinutes}m`;
    else if (diffInHours < 24) return `${diffInHours}h`;
    else if (diffInDays < 7) return `${diffInDays}d`;
    else return `${diffInWeeks}w`;
};

const ReelsComment = ({ open, handleClose, comments = [], reelId, userImage }) => {
  const theme = useTheme(); 
  const dispatch = useDispatch();
  const [content, setContent] = useState("");

  const handleSendComment = () => {
    if (!content.trim()) return;

    const reqData = {
        shortVideoId: reelId,
        data: { content: content }
    };
    
    dispatch(createShortVideoCommentAction(reqData));
    setContent(""); 
  };

  return (
    <Box sx={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '70%', 
        bgcolor: 'background.paper', 
        color: 'text.primary',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        zIndex: 50, 
        transition: 'transform 0.3s ease-in-out', 
        transform: open ? 'translateY(0)' : 'translateY(100%)', 
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)' 
    }}>
        
        {/* Header: Comments count & Close */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">Comments ({comments.length})</Typography>
            <IconButton onClick={handleClose} size="small" sx={{ color: 'text.primary' }}>
                <CloseIcon />
            </IconButton>
        </Box>

        {/* Body: Comments List */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1.5 }}>
                        <Avatar src={comment.user?.image} sx={{ width: 32, height: 32 }} />
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" fontWeight="bold" sx={{ color: 'text.primary' }}>
                                    {comment.user?.firstName} {comment.user?.lastName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {calculateTimeAgo(comment.createdAt)}
                                </Typography>
                            </Box>
                            <Typography variant="body2">{comment.content}</Typography>
                        </Box>
                    </Box>
                ))
            ) : (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">No comments yet. Be the first!</Typography>
                </Box>
            )}
        </Box>

        {/* Footer: Input Area */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={userImage} sx={{ width: 32, height: 32 }} />
            <TextField 
                fullWidth
                variant="standard"
                placeholder="Add a comment..."
                InputProps={{ 
                    disableUnderline: true, 
                    style: { 
                        color: theme.palette.text.primary, 
                        fontSize: '0.9rem' 
                    } 
                }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                sx={{ 
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f2f5', 
                    borderRadius: '20px', 
                    px: 2, py: 0.5 
                }}
            />
            {content.trim() && (
                <IconButton onClick={handleSendComment} sx={{ color: '#0095f6' }}>
                    <SendIcon />
                </IconButton>
            )}
        </Box>

    </Box>
  )
}

export default ReelsComment;