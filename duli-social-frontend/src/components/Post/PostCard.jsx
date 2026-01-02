import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, CardActions, Divider } from '@mui/material'
import React, { useEffect, useState } from 'react';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SaveIcon from '@mui/icons-material/Bookmark';
import SaveBorderIcon from '@mui/icons-material/BookmarkBorder';
import CommentIcon from '@mui/icons-material/ChatBubble';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCommentAction, likePostAction, savePostAction } from '../../Redux/Post/post.action';

const PostCard = ({item}) => {

  const auth = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [viewAllComment, setViewAllComment] = useState(false);
  
  const isLikedByAuth = (post) => {
      if (post?.likedUserIds) {
          return post.likedUserIds.includes(auth?.id);
      }
      if (post?.likedUsers) {
          return post.likedUsers.some(user => user.id === auth?.id);
      }
      return false;
  };

  const checkIsSaved = (user, postId) => {
      if (!user?.savedPostIds) return false;
      return user.savedPostIds.some(id => id == postId); 
  };

  const [isLiked, setIsLiked] = useState(isLikedByAuth(item));
  
  const [isSaved, setIsSaved] = useState(checkIsSaved(auth, item.id));  
  
  const [commentText, setCommentText] = useState("");

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    dispatch(likePostAction(item.id));
  }

  const handleSaveClick = () => {
    setIsSaved((prev) => !prev);
    dispatch(savePostAction(item.id));
  }

  const handleViewComment = () => {
    setViewAllComment(!viewAllComment);
  }

  const handlecreateComment = (content) => {
    const reqData = {
      postId: item.id,
      data: { content }
    }
    dispatch(createCommentAction(reqData));
  }

  const handleNavigateToProfile = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  }

  useEffect(() => {
    setIsLiked(isLikedByAuth(item));
    setIsSaved(checkIsSaved(auth, item.id));

  }, [item, auth?.savedPostIds]);

  return (
    <Card sx={{backgroundColor: 'white', borderRadius: '24px'}}>
      <CardHeader
        avatar={
          <div onClick={() => handleNavigateToProfile(item.user.id)} className='cursor-pointer'>
            <Avatar aria-label="recipe" src={item.user.image} sx={{ bgcolor: '#912f56' }} />
          </div>
        }
        action={
          <IconButton aria-label="settings">
            <MoreIcon />
          </IconButton>
        }
        title={
          <span className='font-semibold cursor-pointer hover:underline'
                onClick={() => handleNavigateToProfile(item.user.id)}>
            {item.user.firstName + " " + item.user.lastName}
          </span>
        }
        subheader={new Date(item.createdAt).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        })}
      />

      <CardContent className='-mt-5'>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {item.caption}
        </Typography>
      </CardContent>

      {item.image && (
        <CardMedia
          component="img"
          height="194"
          image={item.image}
          alt="post image"
          sx={{ height: 'auto', maxHeight: '500px', width: '100%', objectFit: 'contain', background: '#f0f0f0' }}
        />
      )}
      
      {item.video && (
        <div className='w-full'>
             <video controls className='w-full max-h-[500px] object-contain bg-black' src={item.video} />
        </div>
      )}

      <CardActions disableSpacing className='flex justify-between'>
        <div>
            <IconButton aria-label="add to favorites" onClick={handleLikeClick}>
                {isLiked ? (<FavoriteIcon sx={{color: 'error.main'}}/>) : (<FavoriteBorderIcon />) }
            </IconButton>
            
            <span className='text-sm opacity-60 mr-2'>{item.likedUserIds?.length || 0}</span>

            <IconButton aria-label="comment" onClick={handleViewComment}>
                <CommentIcon />
            </IconButton>

            <span className='text-sm opacity-60 mr-2'>{item.totalComments || 0}</span>

                
            <IconButton aria-label="share">
                <ShareIcon />
            </IconButton>
        </div>

        <div>
            <IconButton aria-label="add to saved list" onClick={handleSaveClick}>
                {isSaved ? (<SaveIcon sx={{color: '#dee03f'}}/>) : (<SaveBorderIcon />) }
            </IconButton>
        </div>
        
      </CardActions>

      { viewAllComment && <section>
        <div className='items-center flex space-x-3 m-3'>
          <Avatar src={auth?.image} />
          <input className='w-full rounded-full px-5 py-2 outline-none bg-gray-100 border border-transparent focus:border-gray-300' type='text' 
                placeholder='Write your comment...'
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlecreateComment(commentText.trim());
                    setCommentText("");
                  }
                }} />
        </div>

        <Divider />
        
        <div className='text-xs m-3 space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide'>
          { (!item.comments || item.comments.length === 0) ? (
            <p className='text-center text-gray-400 py-2'>No comments yet</p>
          ):
          (item.comments.map((comment) => (
            <div key={comment.id} className='flex items-start space-x-2'>
                <Avatar sx={{width: 36, height: 36, bgcolor: '#9ca3a3'}} src={comment.user.image} onClick={() => handleNavigateToProfile(comment.user.id)} className='cursor-pointer'/>

                <div className='flex flex-col bg-gray-100 px-4 py-2 rounded-2xl max-w-[85%]'>
                  <span className='font-semibold text-gray-800 text-sm cursor-pointer hover:underline'
                        onClick={() => handleNavigateToProfile(comment.user.id)}>
                    {comment.user?.firstName + " " + comment.user?.lastName}
                  </span>
                  <p className='text-gray-700 mt-1 text-[13px]'>
                    {comment.content}
                  </p>
                </div>
                
                {/* Nút Like Comment (Tính năng mới thêm) */}
                {/* <IconButton size='small'><FavoriteBorderIcon fontSize='inherit'/></IconButton> */}

            </div>)
            )) 
          }
        </div>

      </section>}

    </Card>
  )
}

export default PostCard