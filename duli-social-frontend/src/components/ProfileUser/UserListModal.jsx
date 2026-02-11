import React from 'react';
import { Dialog, DialogContent, Avatar, Button, Typography, IconButton, Box, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { followUserAction, getProfileAction } from '../../Redux/Auth/auth.action';
import { useNavigate } from 'react-router-dom';

const UserListModal = ({ open, handleClose, title, users }) => {
    const theme = useTheme(); 
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    const navigate = useNavigate();

    const handleFollowClick = async (targetUserId) => {
        await dispatch(followUserAction(targetUserId));
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            dispatch(getProfileAction(jwt));
        }
    };

    const handleNavigateProfile = (id) => {
        handleClose();
        navigate(`/profile/${id}`);
    }

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            fullWidth 
            maxWidth="xs"
            PaperProps={{
                sx: { 
                    borderRadius: '16px',
                    bgcolor: 'background.paper',
                    backgroundImage: 'none'
                }
            }}
        >
            {/* HEADER */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                items: 'center', 
                p: 2, 
                borderBottom: '1px solid',
                borderColor: 'divider' 
            }}>
                <Box sx={{ flex: 1 }} />
                <Typography variant="subtitle1" fontWeight="700" color="text.primary">
                    {title}
                </Typography>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={handleClose} size="small" sx={{ color: 'text.primary' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            <DialogContent 
                className="no-scrollbar" 
                sx={{ 
                    p: 0, 
                    maxHeight: '400px', 
                    overflowY: 'auto',
                    bgcolor: 'background.paper'
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {users && users.length > 0 ? (
                        users.map((item) => {
                            if (!item) return null;

                            const isFollowed = auth.user?.followings?.some(
                                (u) => (u.id || u) === item.id
                            );
                            const isMe = auth.user?.id === item.id;
                            const fullName = `${item.firstName || ""} ${item.lastName || ""}`.trim() || "User";
                            const username = item.firstName ? `@${item.firstName.toLowerCase()}` : "";

                            return (
                                <Box 
                                    key={item.id} 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        px: 2, py: 1.5,
                                        transition: '0.2s',
                                        '&:hover': { bgcolor: 'action.hover' } 
                                    }}
                                >
                                    <Box 
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} 
                                        onClick={() => handleNavigateProfile(item.id)}
                                    >
                                        <Avatar 
                                            src={item.image} 
                                            sx={{ width: 44, height: 44, border: '1px solid', borderColor: 'divider' }} 
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="body2" fontWeight="700" color="text.primary">
                                                {fullName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {username}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {!isMe && (
                                        <Button
                                            variant={isFollowed ? "outlined" : "contained"}
                                            size="small"
                                            onClick={() => handleFollowClick(item.id)}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                                boxShadow: 'none',
                                                bgcolor: isFollowed ? 'transparent' : '#912f56',
                                                color: isFollowed 
                                                    ? 'text.primary' 
                                                    : 'white',
                                                borderColor: isFollowed ? 'divider' : 'transparent',
                                                '&:hover': {
                                                    bgcolor: isFollowed ? 'action.hover' : '#7a2748',
                                                    borderColor: isFollowed ? 'text.secondary' : 'transparent',
                                                    boxShadow: 'none'
                                                }
                                            }}
                                        >
                                            {isFollowed ? "Following" : "Follow"}
                                        </Button>
                                    )}
                                </Box>
                            );
                        })
                    ) : (
                        <Box sx={{ p: 5, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">List is empty</Typography>
                        </Box>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UserListModal;