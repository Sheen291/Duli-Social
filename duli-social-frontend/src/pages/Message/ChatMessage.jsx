import React from 'react'
import { Avatar, Typography } from '@mui/material'

const ChatMessage = ({ message, reqUser }) => {

    const isReqUser = reqUser?.id === message.user?.id;

  return (
    <div className={`flex ${isReqUser ? "justify-end" : "justify-start"} items-end my-2 text-[#912f56]`}>
      {!isReqUser && (
        <Avatar src={message.user?.image || ''}
        sx={{ width: 28, height: 28, marginRight: 1, marginBottom: '4px' }}/>
      )}

      <div className='flex flex-col max-w-[70%]'>

        {message.image && (
            <div className={`mb-1 ${isReqUser ? 'self-end' : 'self-start'}`}>
                <img src={message.image} alt='attachment' 
                    className='rounded-2xl border border-gray-200 object-cover max-h-[300px] w-auto'
                    crossOrigin='anonymous'/>
            </div>
        )}

        {message.video && (
            <div className={`mb-1 ${isReqUser ? 'self-end' : 'self-start'}`}>
                <video controls className='rounded-2xl border border-gray-200 max-h-[300px] w-auto bg-black'>
                    <source src={message.video} type='video/mp4' />
                    Your browser doesn't support the video tag
                </video>
            </div>
        )}

        {message.content && (
            <div className={`px-4 py-2 rounded-2xl ${isReqUser ? 'bg-[#912f56] text-white self-end rounded-br-none'
                    : 'bg-[#efefef] text-black self-start rounded-bl-none'
            }`}>
              <Typography variant='body2'>{message.content}</Typography>  
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage
