import React from 'react';
import { Avatar, Typography, Card, CardHeader, IconButton, Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// Hàm tính thời gian (Giữ nguyên)
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
  const authUserId = reqUser?.id;
  // Tìm người chat cùng (Partner) để lấy avatar
  const targetUser = chat.users.find((user) => user.id !== authUserId);
  const displayUser = targetUser || chat.users[0];

  const lastMessage = chat.messages && chat.messages.length > 0 
                      ? chat.messages[chat.messages.length - 1] 
                      : null;

  // Hàm check isRead (Bao sân mọi trường hợp tên biến)
  const checkIsRead = (msg) => {
      if (!msg) return true; 
      return (
          msg.isRead === true || msg.read === true || msg.is_read === true || 
          msg.IsRead === true || msg.isRead === 1 || msg.read === 1
      );
  }

  const isReadStatus = checkIsRead(lastMessage);
  
  // Logic Unread: Tin người khác gửi VÀ chưa đọc
  const isUnread = lastMessage && lastMessage.user.id !== authUserId && !isReadStatus;
  
  // Logic My Message: Tin cuối là do mình gửi
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
        borderBottom: '1px solid #f0f0f0', 
        borderRadius: 0,
        cursor: 'pointer',
        backgroundColor: isUnread ? '#eef7fe' : 'white', 
        '&:hover': { backgroundColor: '#f5f5f5' }
      }}
    >
      <CardHeader
        avatar={
          <Avatar 
            src={displayUser?.image || ''} 
            sx={{ width: 50, height: 50 }}
          />
        }
        action={<IconButton><MoreHorizIcon /></IconButton>}
        
        // TITLE: Tên người dùng
        title={
            <Typography variant='body1' sx={{ fontWeight: isUnread ? 700 : 600 }}>
                {displayUser?.firstName + " " + displayUser?.lastName}
            </Typography>
        }

        // SUBHEADER: Tin nhắn • Thời gian [Avatar nhỏ]
        subheader={
          <div className='flex items-center justify-between mt-1'>
             
             {/* Container trái: Nội dung tin nhắn + Thời gian */}
             <div className='flex items-center overflow-hidden w-full pr-2'>
                 
                 {/* Nội dung tin nhắn (Luôn hiện "You:" nếu mình gửi) */}
                 <Typography 
                    variant='body2' 
                    sx={{ 
                        color: isUnread ? '#000' : 'text.secondary', 
                        fontWeight: isUnread ? 700 : 400,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        maxWidth: '75%' 
                    }}
                 >
                    {isMyMessage ? `You: ${getMessagePreview()}` : getMessagePreview()}
                 </Typography>

                 {/* Dấu chấm & Thời gian */}
                 {timeAgo && (
                    <>
                        <Box component="span" sx={{ mx: 1, width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.secondary', flexShrink: 0 }} />
                        <Typography variant='caption' sx={{ color: isUnread ? '#000' : 'text.secondary', fontWeight: isUnread ? 700 : 400, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {timeAgo}
                        </Typography>
                    </>
                 )}
             </div>

             {/* Container phải: Icon trạng thái (Chấm xanh hoặc Avatar nhỏ) */}
             <div className='flex-shrink-0 ml-1'>
                {isUnread ? (
                    // 1. Nếu có tin mới chưa đọc -> Hiện chấm xanh
                    <FiberManualRecordIcon sx={{ width: 12, height: 12, color: '#2e89ff' }} />
                ) : isMyMessage && isReadStatus ? (
                    // 2. Nếu tin mình gửi đã được đọc -> Hiện Avatar nhỏ của đối phương
                    // Dùng avatar của displayUser (người chat cùng)
                    <Avatar 
                        src={displayUser?.image || ''} 
                        sx={{ width: 16, height: 16 }} // Avatar siêu nhỏ (16px)
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