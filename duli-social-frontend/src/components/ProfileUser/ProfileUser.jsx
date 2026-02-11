import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
// 1. Thêm import useTheme
import { Avatar, Button, Box, Tab, CircularProgress, useTheme } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import SettingsIcon from '@mui/icons-material/Settings';

import { getUserByIdAction, followUserAction, getProfileAction } from '../../Redux/Auth/auth.action';
import { getPostByUserIdAction, getUsersSavedPostsAction } from '../../Redux/Post/post.action';

import PostCard from '../Post/PostCard';
import UpdateProfile from './UpdateProfile';

import AvatarWithStory from '../Story/AvatarWithStory';
import { Helmet } from 'react-helmet-async';
import { getUserShortVideoAction } from '../../Redux/ShortVideo/shortVideo.action';
import UserListModal from './UserListModal';
import UserReelCard from '../Reels/UserReelCard';
import UserReelViewer from '../Reels/UserReelViewer';

const ProfileUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { auth, post, shortVideo } = useSelector(store => store);
  
  const theme = useTheme();

  const [value, setValue] = useState('posts');
  const [openUpdateUser, setOpenUpdateUser] = useState(false);
  const [openFollowersModal, setOpenFollowersModal] = useState(false);
  const [openFollowingsModal, setOpenFollowingsModal] = useState(false);

  const [openReelModal, setOpenReelModal] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);


  const handleOpenReel = (reel) => {
      setSelectedReel(reel);
      setOpenReelModal(true);
  };

  const handleCloseReel = () => {
      setOpenReelModal(false);
      setSelectedReel(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const userId = id ? id : auth.user?.id;
  const isMyProfile = !id || Number(id) === auth.user?.id; 

  const user = isMyProfile ? auth.user : auth.findUser;

  console.log("user: ", user);
  const isCorrectUserLoaded = !!user && Number(user.id) === Number(userId);  

  const pageTitle = isCorrectUserLoaded 
      ? `${user.firstName} ${user.lastName}` 
      : "Profile";

  useEffect(() => {
    if (userId) {
      dispatch(getUserByIdAction(userId));
      dispatch(getPostByUserIdAction(userId));
      dispatch(getUserShortVideoAction(userId));
    }
    
    if (isMyProfile) {
        dispatch(getUsersSavedPostsAction()); 
    }

  }, [userId, dispatch, isMyProfile]);

  useEffect(() => {
    if (!isMyProfile && value === 'saveds') {
        setValue('posts');
    }
  }, [isMyProfile, value]);


  if (!isMyProfile && !user) {
      return (
          <div className='flex justify-center items-center h-[50vh]'>
              <CircularProgress sx={{color: '#912f56'}} />
          </div>
      );
  }

  if (isMyProfile && !auth.user) {
      return (
          <div className='flex justify-center items-center h-[50vh]'>
              <p>Please login to view your profile</p>
          </div>
      );
  }


  const handleOpenUpdateUser = () => setOpenUpdateUser(true);
  const handleClose = () => setOpenUpdateUser(false);

  const handleFollowUser = async () => {
    if (userId) {
        await dispatch(followUserAction(userId));
        setTimeout(() => dispatch(getUserByIdAction(userId)), 100);
        const jwt = localStorage.getItem("jwt");
        if(jwt) setTimeout(() => dispatch(getProfileAction(jwt)), 100);
    }
  };

  const isFollowed = auth.user?.followings?.some(u => {
       if (typeof u === 'object' && u !== null) {
           return u.id == user?.id;
       }
       return u == user?.id;
  });

  return (
    <div className='w-full flex justify-center h-fit min-w-[300px]'>
      <Helmet>
        <title>{pageTitle} | Duli Social</title>
      </Helmet>

      {!isCorrectUserLoaded ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', width: '100%' }}>
              <CircularProgress sx={{color: '#912f56'}} />
          </Box>
      ) : (
        <Box sx={{
            width: { xs: '100%', lg: '70%' },
            bgcolor: 'background.paper', 
            color: 'text.primary',       
            borderRadius: '12px',
            py: 5,
            px: 3,
            border: 1,
            borderColor: 'divider'      
        }}>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-10 mb-10'>
            
            <div className='flex-shrink-0'>
              <AvatarWithStory 
                  user={user} 
                  size={150}
              />
            </div>

            <div className='flex flex-col gap-5 w-full'>
              
              <div className='flex flex-col md:flex-row items-center gap-5'>
                <h1 className='text-xl font-normal'>
                  {user?.firstName + " " + user?.lastName}
                </h1>
                
                {isMyProfile ? (
                  <div className='flex gap-2'>
                      <Button 
                          size='small' 
                          sx={{ 
                              bgcolor: theme.palette.mode === 'dark' ? '#333' : '#efefef', 
                              color: theme.palette.text.primary, 
                              textTransform: 'none', 
                              borderRadius: '8px', 
                              '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#444' : '#dbdbdb' } 
                          }} 
                          onClick={handleOpenUpdateUser}
                      >
                          Edit profile
                      </Button>
                      <Button 
                          size='small' 
                          sx={{ 
                              bgcolor: theme.palette.mode === 'dark' ? '#333' : '#efefef',
                              color: theme.palette.text.primary, 
                              textTransform: 'none', 
                              borderRadius: '8px', 
                              '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#444' : '#dbdbdb' } 
                          }} 
                      >
                          View archive
                      </Button>
                      <div className='flex items-center cursor-pointer'>
                          <SettingsIcon sx={{ color: 'text.primary' }} />
                      </div>
                  </div>
                ) : (
                  <Button 
                      variant='contained' 
                      size='small' 
                      onClick={handleFollowUser}
                      sx={{
                          bgcolor: isFollowed 
                              ? (theme.palette.mode === 'dark' ? '#333' : '#efefef') 
                              : '#912f56',
                          color: isFollowed ? theme.palette.text.primary : 'white',
                          textTransform: 'none', 
                          borderRadius: '8px',
                          '&:hover': { 
                              bgcolor: isFollowed 
                                  ? (theme.palette.mode === 'dark' ? '#444' : '#dbdbdb')
                                  : '#7a2748' 
                          }
                      }}
                  >
                      {isFollowed ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>

              <div className='flex justify-center md:justify-start gap-8'>
                <div className='flex gap-1'><span className='font-semibold'>{post.profilePosts?.length || 0}</span> posts</div>
                <div 
                  className='flex gap-1 cursor-pointer hover:underline decoration-1' 
                  onClick={() => setOpenFollowersModal(true)}
                >
                  <span className='font-semibold'>{user?.followers?.length || 0}</span> followers
                </div>
                <div 
                  className='flex gap-1 cursor-pointer hover:underline decoration-1'
                  onClick={() => setOpenFollowingsModal(true)}
                >
                  <span className='font-semibold'>{user?.followings?.length || 0}</span> following
                </div>
              </div>

              <div className='text-center md:text-left'>
                <p className='text-sm'>{user?.bio || "No bio yet."}</p>
              </div>

            </div>
          </div>

          <section>
            <TabContext value={value}>
              <Box sx={{ borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                <TabList onChange={handleChange} aria-label="profile tabs" 
                  TabIndicatorProps={{ style: { backgroundColor: '#912f56' } }}
                  sx={{
                      '& .MuiTab-root': { color: 'text.secondary', fontSize: '12px', minHeight: '50px' },
                      '& .Mui-selected': { color: '#912f56 !important' },
                  }}
                >
                  <Tab icon={<GridOnOutlinedIcon sx={{fontSize: 20}}/>} iconPosition="start" label="POSTS" value="posts" />
                  {isMyProfile && (
                      <Tab icon={<BookmarkBorderOutlinedIcon sx={{fontSize: 20}}/>} iconPosition="start" label="SAVED" value="saveds" />
                  )}
                  <Tab icon={<AccountBoxOutlinedIcon sx={{fontSize: 20}}/>} iconPosition="start" label="REELS" value="reels" />
                </TabList>
              </Box>

              {/* TAB POSTS */}
              <TabPanel value="posts" sx={{padding: '20px 0', width: '100%'}}>
                <div className='flex flex-col space-y-5 w-full'>
                  {post.loading ? (
                    <div className='flex justify-center py-5'><CircularProgress /></div>
                  ) : (
                    post.profilePosts?.length > 0 ? (
                      post.profilePosts.map((item) => (
                          <div key={item.id} className='w-full'>
                              <PostCard item={item}/>
                          </div>
                      ))
                    ) : (
                      <div className='text-center py-10 text-gray-500'>No posts yet.</div>
                    )
                  )}
                </div>
              </TabPanel>

              {/* TAB SAVED */}
              <TabPanel value="saveds" sx={{padding: '20px 0'}}>
                  <div className='flex flex-col space-y-5 w-full'>
                    {post.savedPosts?.length > 0 ? (
                          post.savedPosts.map((item) => (
                              <div key={item.id} className='w-full'>
                                  <PostCard item={item}/>
                              </div>
                          ))
                    ) : (
                          <div className='text-gray-400 p-10 text-center'>No saved posts</div>
                    )}
                  </div>
              </TabPanel>

              {/* TAB TAGGED */}
              <TabPanel value="reels" sx={{padding: '20px 0'}}>
                  <div className='grid grid-cols-3 md:grid-cols-4 gap-2'>
                    {shortVideo.userShortVideos && shortVideo.userShortVideos.length > 0 ? (
                          shortVideo.userShortVideos.map((item) => (
                              <UserReelCard 
                                  key={item.id} 
                                  item={item}
                                  onClick={() => handleOpenReel(item)} 
                              />
                          ))
                    ) : (
                          <div className='col-span-full text-center py-10 text-gray-400'>
                              No reels posted yet.
                          </div>
                    )}
                  </div>
              </TabPanel>

            </TabContext>
          </section>

          <section>
            <UpdateProfile open={openUpdateUser} handleClose={handleClose}/>
            <UserListModal 
                open={openFollowersModal}
                handleClose={() => setOpenFollowersModal(false)}
                title="Followers"
                users={user?.followers || []}
            />
            <UserListModal 
                open={openFollowingsModal}
                handleClose={() => setOpenFollowingsModal(false)}
                title="Following"
                users={user?.followings || []}
            />
            <UserReelViewer 
              open={openReelModal} 
              handleClose={handleCloseReel} 
              reel={selectedReel}
            />
          </section>

        </Box>
      )}
    </div>
  )
}

export default ProfileUser