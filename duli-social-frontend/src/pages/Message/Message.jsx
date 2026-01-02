import React from 'react'
import { Avatar, Grid, Icon, IconButton, Typography, Backdrop, CircularProgress } from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview';
import SendIcon from '@mui/icons-material/Send';
import SearchUser from './SearchUser';
import UserChatCard from './UserChatCard';
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import InfoIcon from '@mui/icons-material/Info';
import ImageIcon from '@mui/icons-material/Image';
import ChatMessage from './ChatMessage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMessage, getAllChats, getAllMessages, markMessageRead } from '../../Redux/Message/message.action';
import DuoIcon from '@mui/icons-material/Duo';
import { cloudUpload } from '../../utils/cloudUpload';
import { useState, useRef } from 'react';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { CREATE_MESSAGE_SUCCESS } from '../../Redux/Message/message.actionType';
import { useNavigate } from 'react-router-dom';

const Message = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(store => store.auth);
  const message = useSelector(store => store.message);

  console.log("debug: ",message);

  const [currentChat, setCurrentChat] = useState(null);
  const [inputValue, setInputValue] =useState("");

  const [currentPage, setCurrentPage] = useState(0);

  const [selectedFile, setSelectedFile] = useState("");
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);

  const chatContaineRef = useRef(null);
  const activeChat = message.chats?.find(chat => chat.id === currentChat?.id) || currentChat;

  useEffect(() => {    
    dispatch(getAllChats());
  }, [dispatch])

  useEffect(() => {
    if (currentPage === 0 && chatContaineRef.current) {
        setTimeout(() => {
            if(chatContaineRef.current) {
                chatContaineRef.current.scrollTop = chatContaineRef.current.scrollHeight;
            }
        }, 100);
    }
  }, [message.messages, currentPage]);

  useEffect(() => {
    if(currentChat?.id){
        setCurrentPage(0);
        dispatch(getAllMessages(currentChat.id, 0));
        dispatch(markMessageRead(currentChat.id));
    }
  }, [currentChat?.id, dispatch]);

  const getLastMessageTime = (chat) => {
    if (chat.messages && chat.messages.length > 0) {
        return new Date(chat.messages[chat.messages.length - 1].createdAt).getTime();
    }
    return new Date(chat.createdAt).getTime();
  };

  const handleCreateMessage = async () => {
    if (!currentChat || (!inputValue.trim() && !selectedFile)) return;
    
    setLoading(true);
    let uploadedUrl = null;

    try{
      if (selectedFile) {
        console.log("uploading..", fileType);
        uploadedUrl = await cloudUpload(selectedFile, fileType);
      }

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
    } catch (error) {
      console.log("error sending message", error);

    } finally {
      setLoading(false);
    }
  };

  const chatPartner = currentChat?.users.find(user => user.id !== auth.user.id);


  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileType("image");
    }
  };

  const handleSelectedVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileType("video");
    }
  };

  //web socket cho chat real-time
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (auth.user && currentChat) {
      const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

        reconnectDelay: 5000,

        debug: (str) => {
          console.log(str);
        },

        onConnect: (frame) => {
          console.log("Connected to WebSocket");

          const subscriptionPath = `/group/${currentChat.id}`;

          client.subscribe(subscriptionPath, (messageObj) => {
            const newMessage = JSON.parse(messageObj.body);
            if (!newMessage.chat || !newMessage.chat.id) {
              newMessage.chat = { id: currentChat.id };
            }
            console.log("Received message from Socket: ", newMessage);
            
            if (currentChat?.id === newMessage.chat.id) {
        
              dispatch(markMessageRead(currentChat.id));

              newMessage.isRead = true; 
          }

            dispatch({ type: CREATE_MESSAGE_SUCCESS, payload: newMessage });
          });
        },

        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional detail: ' + frame.body);
        },
      });

      client.activate();
      setStompClient(client);

      return () => {
        if (client) {
          client.deactivate();
        }
      };
    }
  }, [currentChat?.id, auth.user, dispatch]);

  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;

    if (scrollTop === 0 && !message.loading) {
        console.log("Load more messages...");
        
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        
        dispatch(getAllMessages(currentChat.id, nextPage));
        
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden' }}>
      <Grid container sx={{ height: '100%', flexWrap: 'nowrap' }}>
        
        <Grid 
          size={{ xs: 4, md: 3 }}
          sx={{ borderRight: '1px solid #e0e0e0', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <div className='flex justify-between items-center px-4 py-4'>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              {auth.user?.firstName + " " + auth.user?.lastName}
            </Typography>
            <IconButton>
              <RateReviewIcon />
            </IconButton>
          </div>

          <SearchUser />

          <div style={{ overflowY: 'auto', flex: 1 }}>
            
            <div className='flex justify-between px-4 py-2 mt-2'>
               <Typography variant='body1' sx={{ fontWeight: 'bold' }}>Messages</Typography>
               <Typography variant='body2' sx={{ color: '#8e8e8e', cursor: 'pointer' }}>Requests</Typography>
            </div>
            
            {!auth.user ? (
            <CircularProgress />
          ) : (
            message.chats?.length > 0 ? (
                [...message.chats]
                  .sort((a, b) => getLastMessageTime(b) - getLastMessageTime(a))
                  .map((item) => (
                      <div key={item.id} onClick={() => setCurrentChat(item)}>
                          <UserChatCard chat={item} reqUser={auth.user} />
                      </div>
                ))
            ) : (
                <div>No chats yet.</div>
            )
          )}
          </div>
        </Grid>

        <Grid item size={{ xs: 8, md: 9 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}
        >
         {currentChat ? (
          <>
            <div className='flex justify-between items-center border-b p-4 bg-white'>
              <div className='flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity'
                  onClick={() => navigate(`/profile/${chatPartner?.id}`)}
              >
                <Avatar src={chatPartner?.image || ''}/>
                <Typography variant='subtitle1' fontWeight='bold'>{chatPartner?.firstName + " " + chatPartner?.lastName}</Typography>
              </div>

              <div className='flex space-x-3'>
                <IconButton>
                  <CallIcon sx={{ color: '#912f56' }}/>
                </IconButton>
                <IconButton>
                  <VideoCallIcon sx={{ color: '#912f56' }}/>
                </IconButton>
                <IconButton>
                  <InfoIcon sx={{ color: '#912f56' }}/>
                </IconButton>
              </div>
            </div>

            <div ref={chatContaineRef} className='flex-1 overflow-y-auto p-4 space-y-4 bg-[#fafafa]' style={{ scrollBehavior: 'smooth' }} 
                onScroll={handleScroll}>
              
              {message.loading && currentPage > 0 && (
                  <div className='w-full flex justify-center py-2'>
                      <CircularProgress size={24} sx={{ color: '#912f56' }} />
                  </div>
              )}

              {message.messages?.map((msg) => (
                <ChatMessage key={msg.id} message={msg} reqUser={auth.user} />
              ))}

              {(!message.messages || message.messages.length === 0) && (
                  <div className='text-center text-gray-400 mt-10'>Say hello!</div>
              )}
              
            </div>

            <div className='p-3 border-t bg-white flex items-center space-x-2'>

              <div>
                <input type='file' accept='image/*' onChange={handleSelectImage} className='hidden' id='image-input' />
                <label htmlFor='image-input'>
                  <IconButton component="span" sx={{ color: selectedFile && fileType === 'image' ? '#912f56' : 'gray'}}>
                    <ImageIcon/>
                  </IconButton>
                </label>
              </div>

              <div>
                <input type='file' accept='video/*' onChange={handleSelectedVideo} className='hidden' id='video-input'/>
                <label htmlFor='video-input'>
                  <IconButton component="span" sx={{ color: selectedFile && fileType === 'video' ? '#912f56' : 'gray'}}>
                    <DuoIcon/>
                  </IconButton>
                </label>
              </div>

              <div className='flex-1 relative'>
                <input className='w-full border rounded-full py-3 px-2 outline-none bg-gray-100'
                  placeholder='Message...'
                  type='text'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateMessage()}/>
              </div>

                  {(inputValue.trim() || selectedFile) && (
                    <IconButton onClick={handleCreateMessage} disabled={loading}>
                      <SendIcon sx={{ color: '#912f56' }}/>
                    </IconButton>
                  )}
              </div>
         </>
         ) : (
          <div className='h-full flex flex-col items-center justify-center space-y-4'>
            <ChatBubbleOutlineIcon sx={{ width: 150, height: 150 }} />
            <Typography variant='h5'>Select a chat</Typography>
          </div>
         )}
        </Grid>
      </Grid>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default Message