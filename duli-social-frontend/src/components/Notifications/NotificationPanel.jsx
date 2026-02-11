import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationsAction } from '../../Redux/Notification/notification.action';
import { Avatar, Drawer, Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { openStoryViewAction } from '../../Redux/Story/story.action';

const NotificationPanel = ({ open, handleClose }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { notification } = useSelector(store => store);
    const navigate = useNavigate();

    useEffect(() => {
        if (open) {
            dispatch(getNotificationsAction());
        }
    }, [open, dispatch]);

    const handleNotificationClick = (item) => {
        handleClose();
        if (item.type === "NEW_STORY") {
            dispatch(openStoryViewAction(item.actor?.id));
        } else if (item.type === "FOLLOW_USER") {
            navigate(`/profile/${item.actor?.id}`);
        } else if (item.relatedId) {
            navigate(`/post/${item.relatedId}`);
        }
    };

    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "w";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return Math.floor(seconds) + "s";
    };

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={handleClose}
            variant="temporary"
            PaperProps={{
                sx: {
                    width: '380px',
                    backgroundColor: 'background.paper',
                    boxShadow: theme.palette.mode === 'dark' ? '4px 0 24px rgba(0,0,0,0.5)' : '4px 0 24px rgba(0,0,0,0.1)',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    backgroundImage: 'none', 
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, px: 1, color: 'text.primary' }}>
                    Notifications
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {notification.loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                            <CircularProgress size={30} sx={{ color: '#912f56' }} />
                        </Box>
                    ) : (
                        notification.notifications?.length > 0 ? (
                            notification.notifications.map((item) => (
                                <Box 
                                    key={item.id} 
                                    onClick={() => handleNotificationClick(item)}
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'between', 
                                        p: 1.5, 
                                        borderRadius: '12px', 
                                        cursor: 'pointer', 
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'action.hover' } 
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, overflow: 'hidden' }}>
                                        <Avatar 
                                            src={item.actor?.image} 
                                            sx={{ 
                                                width: 48, 
                                                height: 48, 
                                                border: '1px solid',
                                                borderColor: 'divider' 
                                            }}
                                        />
                                        
                                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                            <Typography variant="body2" sx={{ lineHeight: 1.3, color: 'text.primary' }}>
                                                <Box component="span" sx={{ fontWeight: 'bold', mr: 0.5 }}>
                                                    {item.actor?.firstName} {item.actor?.lastName}
                                                </Box>
                                                <Box component="span" sx={{ color: 'text.primary' }}>
                                                    {item.message}
                                                </Box>
                                                <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.75rem', ml: 1 }}>
                                                    {timeAgo(item.createdAt)}
                                                </Box>
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {item.previewImage && (
                                        <Box 
                                            component="img"
                                            src={item.previewImage} 
                                            alt="preview"
                                            sx={{ 
                                                width: 44, 
                                                height: 44, 
                                                objectFit: 'cover', 
                                                borderRadius: '6px', 
                                                ml: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                flexShrink: 0
                                            }} 
                                        />
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 10 }}>
                                No notifications yet.
                            </Typography>
                        )
                    )}
                </Box>
            </Box>
        </Drawer>
    );
};

export default NotificationPanel;