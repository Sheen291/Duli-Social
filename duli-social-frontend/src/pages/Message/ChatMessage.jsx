import React from 'react'
import { Avatar, Typography, useTheme } from '@mui/material'

const ChatMessage = ({ message, reqUser }) => {
  const theme = useTheme(); 
  const isReqUser = reqUser?.id === message.user?.id;

  return (
    <div className={`flex ${isReqUser ? "justify-end" : "justify-start"} items-end my-2`}>
      
      {!isReqUser && (
        <Avatar 
            src={message.user?.image || ''}
            sx={{ width: 28, height: 28, marginRight: 1, marginBottom: '4px' }}
        />
      )}

      <div className='flex flex-col max-w-[70%]'>

        {/* --- IMAGE HANDLING --- */}
        {message.image && (
            <div className={`mb-1 ${isReqUser ? 'self-end' : 'self-start'}`}>
                <img 
                    src={message.image} 
                    alt='attachment' 
                    className='rounded-2xl object-cover max-h-[300px] w-auto'
                    style={{ border: `1px solid ${theme.palette.divider}` }}
                    crossOrigin='anonymous'
                />
            </div>
        )}

        {/* --- VIDEO HANDLING --- */}
        {message.video && (
            <div className={`mb-1 ${isReqUser ? 'self-end' : 'self-start'}`}>
                <video 
                    controls 
                    className='rounded-2xl max-h-[300px] w-auto bg-black'
                    style={{ border: `1px solid ${theme.palette.divider}` }}
                >
                    <source src={message.video} type='video/mp4' />
                    Your browser doesn't support the video tag
                </video>
            </div>
        )}

        {/* --- TEXT CONTENT --- */}
        {message.content && (
            <div 
                className={`px-4 py-2 rounded-2xl ${isReqUser ? 'self-end rounded-br-none' : 'self-start rounded-bl-none'}`}
                
                style={{
                    backgroundColor: isReqUser 
                        ? '#912f56' 
                        : (theme.palette.mode === 'dark' ? '#333333' : '#efefef'), 
                    
                    color: isReqUser 
                        ? '#ffffff' 
                        : theme.palette.text.primary, 
                }}
            >
              <Typography variant='body2' sx={{ wordBreak: 'break-word' }}>
                  {message.content}
              </Typography>  
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage