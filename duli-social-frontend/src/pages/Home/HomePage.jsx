import React, { useEffect, useRef } from 'react'
import { Grid, useMediaQuery, useTheme } from '@mui/material'
import { Routes, Route, useLocation } from 'react-router-dom'

import Sidebar from '../../components/Bar/Sidebar'
import MiddleHome from '../../components/HomeComponents/MiddleHome'
import Reels from '../../components/Reels/Reels'
import CreateReels from '../../components/Reels/CreateReels'
import ProfileUser from '../../components/ProfileUser/ProfileUser'
import RightHome from '../../components/HomeComponents/RightHome'
import Message from '../Message/Message'
import { useDispatch, useSelector } from 'react-redux'
import { getProfileAction } from '../../Redux/Auth/auth.action'
import PostDetail from '../PostDetail/PostDetail'
import Search from '../../components/Search/Search'

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { NEW_NOTIFICATION_RECEIVED } from '../../Redux/Notification/notification.actionType';
import { Helmet } from 'react-helmet-async';
import Explore from '../../components/Explore/Explore'

const HomePage = () => {

  const location = useLocation();
  const scrollRef = useRef(null);

  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const {auth, notification} = useSelector(store => store);

  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const isMessagePage = location.pathname === "/message" || location.pathname === "/short-videos" || location.pathname === '/create-short-videos';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  //websocket
  useEffect(() => {
    if (auth.user) {
      const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        reconnectDelay: 5000, 
        onConnect: (frame) => {
          console.log("Connected to Notification WebSocket");

          client.subscribe(`/user/${auth.user.id}/private-notification`, (messageObj) => {
            const notificationData = JSON.parse(messageObj.body);
            console.log("Global Notification Received:", notificationData);
            
            dispatch({ 
                type: NEW_NOTIFICATION_RECEIVED, 
                payload: notificationData 
            });
          });
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        }
      });

      client.activate();

      return () => {
        client.deactivate();
      };
    }
  }, [auth.user, dispatch]);

  return (
    <div className="" style={{ height: '100vh', overflow: 'hidden' }} >

      <Helmet>
         <title>Duli Social</title> 
       </Helmet>

      <Grid container spacing={0} sx={{bgcolor: 'background.default', height: '100%'}} wrap="nowrap">
        
        <Grid item size={{ xs: 1, lg: isMessagePage ? 1 : 2, md: 1 }} sx={{ display: 'block', transition: 'width 0.3s ease', minWidth: {  xs: '90px', md: '90px', lg: isMessagePage ? '90px' : 'auto'}, overflow: 'hidden' }}>
          <div className="h-full top-0 px-2">
            <Sidebar isSmallScreen={isSmallScreen || isMessagePage}
                    newNotificationCount={notification.newNotifications?.length || 0} 
            />
          </div>
        </Grid>

        <Grid 
          item
          ref={scrollRef}
          size={{ xs: 11, lg: isMessagePage ? 11 : (location.pathname === '/' ? 7 : 10) , md: isHomePage ? 9 : 11 }}
          sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', display: 'flex', justifyContent: isMessagePage ? 'flex-start' : 'center', px: isMessagePage ? 0 : (location.pathname === "/" ? 15 : 5),
                margin: location.pathname === "/" ? 0 : '0 auto',
                maxWidth: isMessagePage ? '100%' :  (location.pathname === "/" ? 'none' : '1000px'), width: '100%'
          }}
        >
          <Routes>
            <Route path="/" element={<MiddleHome />} />
            <Route path="/short-videos" element={<Reels />} />
            <Route path="/short-videos/:reelId" element={<Reels />} />
            <Route path="/create-short-videos" element={<CreateReels />} />
            <Route path="/profile/:id" element={<ProfileUser />} />
            <Route path="/message" element={<Message />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/p/:id" element={<PostDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/explore" element={<Explore />} />


          </Routes>
        </Grid>

        {isHomePage && (
          <Grid item size={{ md: 3, lg: 3 }} sx={{ display: { xs: 'none', lg: 'block'}, height: '100%', pl: 5}}>
            <div className='h-full top-0 w-full'>
              <RightHome />
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default HomePage;
