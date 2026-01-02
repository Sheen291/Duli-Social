import { Avatar, Card, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import StoryCircle from './StoryCircle';
import ImageIcon from '@mui/icons-material/Collections';
import VideoIcon from '@mui/icons-material/Videocam';
import EmotionIcon from '@mui/icons-material/EmojiEmotions';
import { useSelector, useDispatch } from 'react-redux';
import PostCard from '../Post/PostCard';
import PostCreate from '../Post/PostCreate';
import { getAllPostAction } from '../../Redux/Post/post.action';
import { getHomeStoryAction } from '../../Redux/Story/story.action';

import StoryCreate from '../Story/StoryCreate';
import StoryViewer from '../Story/StoryViewer';

const storys = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const MiddleHome = () => {
  const { auth, post, story } = useSelector(store => store);
  const dispatch = useDispatch();

  const [openCreatePost, setOpenCreatePost] = useState(false);
  
  const [page, setPage] = useState(0);

  const [openStoryCreate, setOpenStoryCreate] = useState(false);
  
  const [currentUserStories, setCurrentUserStories] = useState([]);

  const [openStoryView, setOpenStoryView] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const handleOpenCreatePost = () => setOpenCreatePost(true);
  const handleClose = () => setOpenCreatePost(false);


  useEffect(() => {
    if (story.stories.length === 0) {
        dispatch(getHomeStoryAction());
    }
  }, [story.stories.length, dispatch]);

  useEffect(() => {
    dispatch(getAllPostAction(page));
  }, [page, post.commentCreated, dispatch]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 10 >=
      document.documentElement.offsetHeight
    ) {
      if (!post.lastPage && !post.loading) {
        console.log("Load more posts...");
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  const getStoryByUserId = (stories) => {
    const userStories = {};
    
    stories.forEach(item => {
        const userId = item.user.id;
        if (!userStories[userId]) {
            userStories[userId] = {
                user: item.user,
                stories: []
            }
        }
        userStories[userId].stories.push(item);
    });

    return Object.values(userStories);
  };

  const groupedStories = story.stories ? getStoryByUserId(story.stories) : [];

  const handleOpenStoryView = (storiesOfUser) => {
      setCurrentUserStories(storiesOfUser);
      setOpenStoryView(true);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post.lastPage, post.loading]);

  return (
    <div className='max-w-xl mx-auto pb-10 w-full'>
      
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <section className='flex items-center p-5 rounded-b-md space-x-4 overflow-x-scroll no-scrollbar'>
        <div className='flex flex-col items-center cursor-pointer min-w-[80px]'
            onClick={() => setOpenStoryCreate(true)}>
          <Avatar sx={{ width: 60, height: 60, bgcolor: 'white', border: '2px dashed', borderColor: '#912f56' }}>
            <AddIcon sx={{ fontSize: '2rem', color: '#912f56' }} />
          </Avatar>
          <p className='text-xs font-medium opacity-90 mt-1 truncate w-full text-center'>New</p>
        </div>
        {groupedStories.map((group, index) => (
             <div key={index} onClick={() => handleOpenStoryView(group.stories)}> 
                <StoryCircle user={group.user} />
             </div>
        ))}
      </section>

      <Card className='mt-5' sx={{ borderRadius: '14px' }}>
        <div className='p-4'>
          <div className='flex justify-center gap-3 items-center'>
            <Avatar src={auth.user?.image} sx={{ width: 40, height: 40 }} />
            <input 
              className='outline-none flex-1 bg-slate-100 rounded-full border-none px-4 py-2 text-sm hover:bg-slate-200 transition-colors cursor-pointer'
              type='text'
              placeholder={`What's on your mind, ${auth.user?.firstName}?`}
              readOnly
              onClick={handleOpenCreatePost}
            />
          </div>
          <div className='flex justify-between mt-3 pt-3 border-t'>
              <div className='flex items-center gap-1 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-md' onClick={handleOpenCreatePost}>
                 <ImageIcon sx={{ color: '#58c472' }} />
                 <span className='text-xs font-medium text-gray-600'>Photo</span>
              </div>
              <div className='flex items-center gap-1 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-md' onClick={handleOpenCreatePost}>
                 <VideoIcon sx={{ color: '#f23e5c' }} />
                 <span className='text-xs font-medium text-gray-600'>Video</span>
              </div>
              <div className='flex items-center gap-1 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-md' onClick={handleOpenCreatePost}>
                 <EmotionIcon sx={{ color: '#f8c03e' }} />
                 <span className='text-xs font-medium text-gray-600'>Feeling</span>
              </div>
          </div>
        </div>
      </Card>

      <div className='mt-5 space-y-5'>
        {post.posts.map((item, index) => (
          <PostCard key={item.id || index} item={item} />
        ))}
        
        {post.loading && (
             <div className="flex justify-center p-4">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
             </div>
        )}
      </div>

      <div>
        <PostCreate handleClose={handleClose} open={openCreatePost} />
      </div>

      <div>
        <StoryCreate 
          open={openStoryCreate} 
          handleClose={() => setOpenStoryCreate(false)} 
        />
      </div>

      <div>
        <StoryViewer 
          open={openStoryView} 
          handleClose={() => setOpenStoryView(false)}
          stories={currentUserStories}
          initialIndex={0}
        />
      </div>

    </div>
  );
};

export default MiddleHome;