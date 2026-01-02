import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar, Button, Box, Tab, CircularProgress } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import SettingsIcon from '@mui/icons-material/Settings';

// 1. Import thêm action Follow và GetSavedPosts
import { getUserByIdAction, followUserAction, getProfileAction } from '../../Redux/Auth/auth.action';
import { getPostByUserIdAction, getUsersSavedPostsAction } from '../../Redux/Post/post.action';

import PostCard from '../Post/PostCard';
import UpdateProfile from './UpdateProfile';

const ProfileUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { auth, post } = useSelector(store => store);

  const [value, setValue] = useState('posts');
  const [openUpdateUser, setOpenUpdateUser] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Xác định ID và quyền sở hữu profile
  const userId = id ? id : auth.user?.id;
  const isMyProfile = !id || Number(id) === auth.user?.id; 

  const user = id ? auth.findUser : auth.user;

  // Load dữ liệu
  useEffect(() => {
    if (userId) {
      dispatch(getUserByIdAction(userId));
      dispatch(getPostByUserIdAction(userId)); // Lấy bài viết do user tạo
    }
    
    // Nếu là profile của mình thì mới load Saved Posts (thường là private)
    if (isMyProfile) {
        // Đảm bảo bạn đã có action này trong redux
        dispatch(getUsersSavedPostsAction()); 
    }

  }, [userId, dispatch, isMyProfile]);

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

  useEffect(() => {
    if (!isMyProfile && value === 'saveds') {
        setValue('posts');
    }
  }, [isMyProfile, value]);


  const isFollowed = auth.user?.followings?.some(u => {
       if (typeof u === 'object' && u !== null) {
           return u.id == user?.id;
       }
       return u == user?.id;
  });

  console.log("Check Follow:", { 
      myId: auth.user?.id, 
      targetId: user?.id, 
      isFollowed: isFollowed, 
      myFollowings: auth.user?.followings 
  });

  return (
    <div className='w-full flex justify-center h-fit '>
      <div className='w-full lg:w-[70%] bg-white rounded-lg py-10 px-5 border border-gray-300'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-10 mb-10'>
          
          <div className='flex-shrink-0'>
            <Avatar 
              src={user?.image} 
              alt="avatar"
              sx={{ width: { xs: 100, md: 150 }, height: { xs: 100, md: 150 } }}
              className='border border-gray-200'
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
                        sx={{ bgcolor: '#efefef', color: 'black', textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#dbdbdb' } }} 
                        onClick={handleOpenUpdateUser}
                    >
                        Edit profile
                    </Button>
                    <Button 
                        size='small' 
                        sx={{ bgcolor: '#efefef', color: 'black', textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#dbdbdb' } }} 
                    >
                        View archive
                    </Button>
                    <div className='flex items-center cursor-pointer'>
                        <SettingsIcon />
                    </div>
                </div>
              ) : (
                // 4. Button Follow / Unfollow
                <Button 
                    variant='contained' 
                    size='small' 
                    onClick={handleFollowUser}
                    sx={{
                        bgcolor: isFollowed ? '#efefef' : '#912f56', 
                        color: isFollowed ? 'black' : 'white',
                        textTransform: 'none', 
                        borderRadius: '8px',
                        '&:hover': { bgcolor: isFollowed ? '#dbdbdb' : '#7a2748' }
                    }}
                >
                    {isFollowed ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>

            <div className='flex justify-center md:justify-start gap-8'>
              <div className='flex gap-1'><span className='font-semibold'>{post.profilePosts?.length || 0}</span> posts</div>
              <div className='flex gap-1'><span className='font-semibold'>{user?.followers?.length || 0}</span> followers</div>
              <div className='flex gap-1'><span className='font-semibold'>{user?.followings?.length || 0}</span> following</div>
            </div>

            <div className='text-center md:text-left'>
              <p className='text-sm'>{user?.bio || "No bio yet."}</p>
            </div>

          </div>
        </div>

        <section>
          <TabContext value={value}>
            <Box sx={{ borderTop: 1, borderColor: '#dbdbdb', display: 'flex', justifyContent: 'center' }}>
              <TabList onChange={handleChange} aria-label="profile tabs" 
                TabIndicatorProps={{ style: { backgroundColor: '#912f56' } }}
                sx={{
                    '& .MuiTab-root': { color: '#8e8e8e', fontSize: '12px', minHeight: '50px' },
                    '& .Mui-selected': { color: '#912f56 !important' },
                }}
              >
                <Tab icon={<GridOnOutlinedIcon sx={{fontSize: 20}}/>} iconPosition="start" label="POSTS" value="posts" />
                
                {/* Chỉ hiện tab SAVED nếu là profile của mình */}
                {isMyProfile && (
                    <Tab icon={<BookmarkBorderOutlinedIcon sx={{fontSize: 20}}/>} iconPosition="start" label="SAVED" value="saveds" />
                )}
                
                <Tab icon={<AccountBoxOutlinedIcon sx={{fontSize: 20}}/>} iconPosition="start" label="TAGGED" value="taggeds" />
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
                        <div key={item.id} className='w-full shadow-sm border rounded-[24px] shadow-[#912f56]'>
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
                   {/* 6. Render Saved Posts */}
                   {post.savedPosts?.length > 0 ? (
                        post.savedPosts.map((item) => (
                            <div key={item.id} className='w-full shadow-sm border rounded-[24px] shadow-[#912f56]'>
                                <PostCard item={item}/>
                            </div>
                        ))
                   ) : (
                        <div className='text-gray-400 p-10 text-center'>No saved posts</div>
                   )}
                </div>
            </TabPanel>

            {/* TAB TAGGED */}
            <TabPanel value="taggeds" sx={{padding: '20px 0'}}>
                <div className='flex flex-col space-y-5 items-center w-full'>
                   <div className='p-10 text-gray-400'>No tagged posts</div>
                </div>
            </TabPanel>

          </TabContext>
        </section>

        <section>
          <UpdateProfile open={openUpdateUser} handleClose={handleClose}/>
        </section>

      </div>
    </div>
  )
}

export default ProfileUser