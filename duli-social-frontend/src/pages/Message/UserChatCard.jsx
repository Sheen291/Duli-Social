import React from 'react';
import { Avatar, Typography, Card, CardHeader, IconButton, Box, useTheme } from '@mui/material'; // 1. Import useTheme
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const calculateTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageTime) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} d`;
    return messageTime.toLocaleDateString(); 
};

const UserChatCard = ({ chat, reqUser }) => {
  const theme = useTheme();
  const authUserId = reqUser?.id;
  const targetUser = chat.users.find((user) => user.id !== authUserId);
  const displayUser = targetUser || chat.users[0];

  const lastMessage = chat.messages && chat.messages.length > 0 
                      ? chat.messages[chat.messages.length - 1] 
                      : null;

  const checkIsRead = (msg) => {
      if (!msg) return true; 
      return (
          msg.isRead === true || msg.read === true || msg.is_read === true || 
          msg.IsRead === true || msg.isRead === 1 || msg.read === 1
      );
  }

  const isReadStatus = checkIsRead(lastMessage);
  const isUnread = lastMessage && lastMessage.user.id !== authUserId && !isReadStatus;
  const isMyMessage = lastMessage?.user?.id === authUserId;

  const getMessagePreview = () => {
      if (!lastMessage) return "Start conversation";
      if (lastMessage.image) return "Sent an image 📷";
      if (lastMessage.video) return "Sent a video 🎥";
      return lastMessage.content;
  };

  const timeAgo = lastMessage ? calculateTimeAgo(lastMessage.createdAt) : "";

  return (
    <Card 
      sx={{ 
        boxShadow: 'none', 
        borderBottom: 1,
        borderColor: 'divider',
        borderRadius: 0,
        cursor: 'pointer',
        backgroundColor: isUnread 
            ? (theme.palette.mode === 'dark' ? 'rgba(46, 137, 255, 0.15)' : '#eef7fe') 
            : 'background.paper',
        
        '&:hover': { 
            backgroundColor: 'action.hover' 
        },
        transition: 'background-color 0.2s'
      }}
    >
      <CardHeader
        avatar={
          <Avatar 
            src={displayUser?.image || ''} 
            sx={{ width: 50, height: 50, border: `1px solid ${theme.palette.divider}` }}
          />
        }
        action={<IconButton><MoreHorizIcon sx={{ color: 'text.secondary' }} /></IconButton>}
        
        title={
            <Typography variant='body1' sx={{ fontWeight: isUnread ? 700 : 600, color: 'text.primary' }}>
                {displayUser?.firstName + " " + displayUser?.lastName}
            </Typography>
        }

        subheader={
          <div className='flex items-center justify-between mt-1'>
              
             <div className='flex items-center overflow-hidden w-full pr-2'>
                 
                 <Typography 
                    variant='body2' 
                    sx={{ 
                        color: isUnread ? 'text.primary' : 'text.secondary', 
                        fontWeight: isUnread ? 700 : 400,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        maxWidth: '75%' 
                    }}
                 >
                    {isMyMessage ? `You: ${getMessagePreview()}` : getMessagePreview()}
                 </Typography>

                 {timeAgo && (
                    <>
                        <Box component="span" sx={{ mx: 1, width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.secondary', flexShrink: 0 }} />
                        <Typography variant='caption' sx={{ color: isUnread ? 'text.primary' : 'text.secondary', fontWeight: isUnread ? 700 : 400, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {timeAgo}
                        </Typography>
                    </>
                 )}
             </div>

             <div className='flex-shrink-0 ml-1'>
                {isUnread ? (
                    <FiberManualRecordIcon sx={{ width: 12, height: 12, color: '#2e89ff' }} />
                ) : isMyMessage && isReadStatus ? (
                    <Avatar 
                        src={displayUser?.image || ''} 
                        sx={{ width: 16, height: 16 }} 
                    />
                ) : null}
             </div>

          </div>
        }
      />
    </Card>
  );
};

export default UserChatCard;