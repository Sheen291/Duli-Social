import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationsAction } from '../../Redux/Notification/notification.action';
import { Avatar, Drawer, Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotificationPanel = ({ open, handleClose }) => {
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
        
        if (item.type === "FOLLOW_USER") {
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
                    backgroundColor: 'white',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
                    borderRight: '1px solid #dbdbdb',
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, px: 1 }}>
                    Notifications
                </Typography>

                <div className='flex flex-col gap-2'>
                    {notification.loading ? (
                        <div className='flex justify-center mt-10'><CircularProgress size={30} sx={{color: '#912f56'}}/></div>
                    ) : (
                        notification.notifications?.length > 0 ? (
                            notification.notifications.map((item) => (
                                <div 
                                    key={item.id} 
                                    className='flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all'
                                    onClick={() => handleNotificationClick(item)}
                                >
                                    {/* PHẦN TRÁI: Avatar + Text */}
                                    <div className='flex items-center gap-3 flex-1 overflow-hidden'>
                                        <Avatar 
                                            src={item.actor?.image} 
                                            sx={{ width: 44, height: 44, border: '1px solid #ececec' }}
                                        />
                                        
                                        <div className='flex-1 text-sm leading-tight pr-2'>
                                            <span className='font-semibold mr-1'>
                                                {item.actor?.firstName} {item.actor?.lastName}
                                            </span>
                                            <span className='text-gray-800 break-words'>
                                                {item.message}
                                            </span>
                                            <span className='text-gray-400 text-xs ml-1'>
                                                {timeAgo(item.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {item.previewImage && (
                                        <img 
                                            src={item.previewImage} 
                                            alt="post preview"
                                            className='w-11 h-11 object-cover rounded ml-1 border border-gray-200 flex-shrink-0' 
                                        />
                                    )}
                                    
                                </div>
                            ))
                        ) : (
                            <div className='text-center text-gray-400 mt-10'>No notifications yet.</div>
                        )
                    )}
                </div>
            </Box>
        </Drawer>
    );
};

export default NotificationPanel;