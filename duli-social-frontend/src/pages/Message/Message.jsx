import React, { useEffect, useState, useRef } from 'react';
import { Avatar, Grid, IconButton, Typography, Backdrop, CircularProgress, useTheme, Box, useMediaQuery } from '@mui/material'; // 1. Import useMediaQuery
import RateReviewIcon from '@mui/icons-material/RateReview';
import SendIcon from '@mui/icons-material/Send';
import SearchUser from './SearchUser';
import UserChatCard from './UserChatCard';
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import InfoIcon from '@mui/icons-material/Info';
import ImageIcon from '@mui/icons-material/Image';
import DuoIcon from '@mui/icons-material/Duo';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import ChatMessage from './ChatMessage';
import { createMessage, getAllChats, getAllMessages, markMessageRead } from '../../Redux/Message/message.action';
import { CREATE_MESSAGE_SUCCESS } from '../../Redux/Message/message.actionType';
import { cloudUpload } from '../../utils/cloudUpload';
import { Helmet } from 'react-helmet-async';

const Message = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(store => store.auth);
  const message = useSelector(store => store.message);

  const [currentChat, setCurrentChat] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);

  const chatContaineRef = useRef(null);

  // --- WebSocket Setup ---
  useEffect(() => {
    if (auth.user) {
      const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        reconnectDelay: 5000,
        onConnect: (frame) => {
          client.subscribe(`/user/${auth.user.id}/private`, (messageObj) => {
            const newMessage = JSON.parse(messageObj.body);
            dispatch({ type: CREATE_MESSAGE_SUCCESS, payload: newMessage });
          });
        },
      });
      client.activate();
      return () => { client.deactivate(); };
    }
  }, [auth.user, dispatch]);

  useEffect(() => { dispatch(getAllChats()); }, [dispatch]);

  // Auto-scroll
  useEffect(() => {
    if (currentPage === 0 && chatContaineRef.current) {
        setTimeout(() => {
            if(chatContaineRef.current) chatContaineRef.current.scrollTop = chatContaineRef.current.scrollHeight;
        }, 100);
    }
  }, [message.messages, currentPage]);

  // Fetch messages
  useEffect(() => {
    if(currentChat?.id){
        setCurrentPage(0);
        dispatch(getAllMessages(currentChat.id, 0));
        dispatch(markMessageRead(currentChat.id));
    }
  }, [currentChat?.id, dispatch]);

  const getLastMessageTime = (chat) => {
    if (chat.messages && chat.messages.length > 0) return new Date(chat.messages[chat.messages.length - 1].createdAt).getTime();
    return new Date(chat.createdAt).getTime();
  };

  const handleCreateMessage = async () => {
    if (!currentChat || (!inputValue.trim() && !selectedFile)) return;
    setLoading(true);
    let uploadedUrl = null;
    try{
      if (selectedFile) uploadedUrl = await cloudUpload(selectedFile, fileType);
      const messageData = {
        chatId: currentChat.id,
        content: inputValue,
        image: fileType === "image" ? uploadedUrl : null,
        video: fileType === "video" ? uploadedUrl : null
      };
      await dispatch(createMessage({ message: messageData, chatId: currentChat.id }));
      setInputValue("");
      setSelectedFile(null);
      setFileType(null);
    } catch (error) { console.log("error", error); } 
    finally { setLoading(false); }
  };

  const chatPartner = currentChat?.users.find(user => user.id !== auth.user.id);

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setFileType("image"); }
  };

  const handleSelectedVideo = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setFileType("video"); }
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && !message.loading) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        dispatch(getAllMessages(currentChat.id, nextPage));
    }
  };

  const handleBackToChatList = () => {
    setCurrentChat(null);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', borderRadius: '10px', overflow: 'hidden', color: 'text.primary' }}>
      <Helmet><title>Messages • Duli Social</title></Helmet>
      
      <Grid container sx={{ height: '100%', flexWrap: 'nowrap' }}>
        
        {/* --- SIDEBAR --- */}
        <Grid 
            size={{ xs: 12, md: 3 }} // Mobile: Full width, PC: 3/12
            sx={{ 
                borderRight: 1, 
                borderColor: 'divider', 
                height: '100%', 
                flexDirection: 'column',
                display: { xs: currentChat ? 'none' : 'flex', md: 'flex' } 
            }}
        >
          <div className='flex justify-between items-center px-4 py-4'>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              {auth.user?.firstName + " " + auth.user?.lastName}
            </Typography>
            <IconButton><RateReviewIcon sx={{ color: 'text.primary' }} /></IconButton>
          </div>

          <SearchUser />

          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div className='flex justify-between px-4 py-2 mt-2'>
               <Typography variant='body1' sx={{ fontWeight: 'bold' }}>Messages</Typography>
               <Typography variant='body2' sx={{ color: 'text.secondary', cursor: 'pointer' }}>Requests</Typography>
            </div>
            
            {!auth.user ? <CircularProgress /> : (
              message.chats?.length > 0 ? (
                [...message.chats]
                  .sort((a, b) => getLastMessageTime(b) - getLastMessageTime(a))
                  .map((item) => (
                      <div key={item.id} onClick={() => setCurrentChat(item)}>
                          <UserChatCard chat={item} reqUser={auth.user} />
                      </div>
                ))
              ) : <div className="p-4 text-center">No chats yet.</div>
            )}
          </div>
        </Grid>

        {/* --- CHAT AREA --- */}
        <Grid 
            item 
            size={{ xs: 12, md: 9 }} // Mobile: Full width, PC: 9/12
            sx={{ 
                height: '100%', 
                flexDirection: 'column',
                display: { xs: currentChat ? 'flex' : 'none', md: 'flex' }
            }}
        >
         {currentChat ? (
         <>
           {/* Chat Header */}
           <Box sx={{ 
               display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
               borderBottom: 1, borderColor: 'divider', 
               p: 2, bgcolor: 'background.paper' 
           }}>
             <div className='flex items-center space-x-3'>
               <IconButton 
                  onClick={handleBackToChatList} 
                  sx={{ display: { md: 'none' }, color: 'text.primary', mr: 1 }}
               >
                 <ArrowBackIcon />
               </IconButton>

               <div className='flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity'
                   onClick={() => navigate(`/profile/${chatPartner?.id}`)}
               >
                  <Avatar src={chatPartner?.image || ''}/>
                  <Typography variant='subtitle1' fontWeight='bold'>
                      {chatPartner?.firstName + " " + chatPartner?.lastName}
                  </Typography>
               </div>
             </div>

             <div className='flex space-x-3'>
               <IconButton><CallIcon sx={{ color: '#912f56' }}/></IconButton>
               <IconButton><VideoCallIcon sx={{ color: '#912f56' }}/></IconButton>
               <IconButton><InfoIcon sx={{ color: '#912f56' }}/></IconButton>
             </div>
           </Box>

           {/* Messages List */}
           <Box 
               ref={chatContaineRef} 
               className='flex-1 overflow-y-auto p-4 space-y-4' 
               sx={{ 
                   bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#fafafa',
                   scrollBehavior: 'smooth' 
               }}
               onScroll={handleScroll}
           >
             {message.loading && currentPage > 0 && (
                 <div className='w-full flex justify-center py-2'><CircularProgress size={24} sx={{ color: '#912f56' }} /></div>
             )}
             {message.messages?.map((msg) => <ChatMessage key={msg.id} message={msg} reqUser={auth.user} />)}
             {(!message.messages || message.messages.length === 0) && <div className='text-center text-gray-400 mt-10'>Say hello!</div>}
           </Box>

           {/* Input Area */}
           <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 1 }}>
             <div>
               <input type='file' accept='image/*' onChange={handleSelectImage} className='hidden' id='image-input' />
               <label htmlFor='image-input'>
                 <IconButton component="span" sx={{ color: selectedFile && fileType === 'image' ? '#912f56' : 'text.secondary'}}>
                   <ImageIcon/>
                 </IconButton>
               </label>
             </div>
             <div>
               <input type='file' accept='video/*' onChange={handleSelectedVideo} className='hidden' id='video-input'/>
               <label htmlFor='video-input'>
                 <IconButton component="span" sx={{ color: selectedFile && fileType === 'video' ? '#912f56' : 'text.secondary'}}>
                   <DuoIcon/>
                 </IconButton>
               </label>
             </div>
             <div className='flex-1 relative'>
               <input 
                 className='w-full rounded-full py-3 px-4 outline-none'
                 style={{ 
                     backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f3f4f6', 
                     color: theme.palette.text.primary, border: 'none'
                 }}
                 placeholder='Message...' type='text' value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleCreateMessage()}
                />
             </div>
             {(inputValue.trim() || selectedFile) && (
               <IconButton onClick={handleCreateMessage} disabled={loading}><SendIcon sx={{ color: '#912f56' }}/></IconButton>
             )}
           </Box>
         </>
         ) : (
          <div className='h-full flex flex-col items-center justify-center space-y-4'>
            <ChatBubbleOutlineIcon sx={{ width: 150, height: 150, opacity: 0.5 }} />
            <Typography variant='h5' sx={{ opacity: 0.7 }}>Select a chat</Typography>
          </div>
         )}
        </Grid>
      </Grid>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}

export default Message