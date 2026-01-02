import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Avatar, Fade, Icon, IconButton, imageListClasses, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import CloseButton from '@mui/icons-material/CloseRounded';
import ImageIcon from '@mui/icons-material/Collections';
import VideoIcon from '@mui/icons-material/Videocam';
import EmotionIcon from '@mui/icons-material/EmojiEmotions';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import { cloudUpload } from '../../utils/cloudUpload';
import { createPostAction } from '../../Redux/Post/post.action';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  borderRadius: '24px',
  boxShadow: 24,
  p: 4,
  bgcolor: '#eaf2ef', // Keeping your custom background color
  outline: "none"
};

const PostCreate = ({handleClose, open}) => {

  const [selectImage, setSelectImage] = useState();
  const [selectVideo, setSelectVideo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const {auth} = useSelector(store => store);

  // --- NEW: Reset function to clear form and state ---
  const resetForm = () => {
      setSelectImage(null);
      setSelectVideo(null);
      formik.resetForm();
  }

  // --- NEW: Effect to reset form when modal opens/closes ---
  useEffect(() => {
      if (!open) {
          resetForm();
      }
  }, [open]);

  const handleSelectImage = async (event) => {
    setIsLoading(true);
    const imageUrl = await cloudUpload(event.target.files[0], "image");
    setSelectImage(imageUrl);
    setIsLoading(false);
    formik.setFieldValue("image", imageUrl);
  }

  const handleSelectVideo = async (event) => {
    setIsLoading(true);
    const videoUrl = await cloudUpload(event.target.files[0], "video");
    setSelectVideo(videoUrl);
    setIsLoading(false);
    formik.setFieldValue("video", videoUrl);
  }

  const handleSelectEmoji = () => {
     // logic for emoji picker if you implement it
  }

  const formik = useFormik({
    initialValues: {
        caption: "",
        image: "",
        video: ""
    },
    onSubmit:(values) => {
        console.log("formik values", values);
        dispatch(createPostAction(values));
        
        // --- FIXED: Close modal and reset form AFTER dispatching ---
        resetForm();
        handleClose();
    }
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Fade in={open}>
      <Box sx={style}>
        {/* Header with Close Button */}
        <div className='flex items-center justify-between w-full mb-3'>
             <div className='flex space-x-3 items-center'>
                 <Avatar src={auth.user?.image}/>
                 <div className=''>
                     <p className='font-bold text-lg text-gray-800'>{auth.user?.firstName + " " + auth.user?.lastName}</p>
                     <p className='text-sm text-gray-500'>@{auth.user?.firstName?.toLowerCase() + "_" + auth.user?.lastName?.toLowerCase()}</p>
                 </div>                    
             </div>
             <IconButton onClick={handleClose} sx={{color: '#912f56'}}>
                 <CloseButton />
             </IconButton>
        </div>

        <form onSubmit={formik.handleSubmit}>
            <div>
                <textarea 
                    placeholder="What's on your mind?" 
                    name='caption' 
                    rows="4"
                    value={formik.values.caption} 
                    onChange={formik.handleChange}
                    className='outline-none w-full mt-2 rounded-md p-2 border border-transparent focus:border-gray-300 bg-white resize-none text-base'
                ></textarea>
                
                {/* Media Preview Section */}
                {(selectImage || selectVideo) && (
                    <div className='w-full rounded-md border p-2 mt-2 relative bg-white'>
                         {/* Optional: Add a clear button for the selected media */}
                         <div className='absolute top-2 right-2 bg-gray-200 rounded-full cursor-pointer p-1 hover:bg-gray-300' 
                              onClick={() => {
                                  setSelectImage(null); 
                                  setSelectVideo(null);
                                  formik.setFieldValue("image", ""); 
                                  formik.setFieldValue("video", "");
                              }}>
                             <CloseButton fontSize="small" />
                         </div>

                        {selectImage && (
                            <img src={selectImage} alt='' className='w-full max-h-[300px] object-contain rounded-md' />
                        )} 
                        {selectVideo && (
                            <video src={selectVideo} controls className='w-full max-h-[300px] object-contain rounded-md'/>
                        )}
                    </div>
                )}
                
                <div className='flex space-x-5 items-center mt-4 border-t pt-3 border-gray-300'>
                    <div className='flex space-x-2'>
                        <div>
                            <input type="file" accept="image/*" onChange={handleSelectImage} style={{display: "none"}} id="image-input"/>
                            <label htmlFor='image-input'>
                                <IconButton color='primary' component="span">
                                    <ImageIcon sx={{color: '#58c472'}}/>
                                </IconButton>
                            </label>
                        </div>
                        <div>
                            <input type="file" accept='video/*' onChange={handleSelectVideo} style={{display: "none"}} id="video-input"/>
                            <label htmlFor='video-input'>
                                <IconButton color='primary' component="span">
                                    <VideoIcon sx={{color: '#f23e5c'}}/>
                                </IconButton>
                            </label>
                        </div>
                        <div>
                            {/* Placeholder for Emoji Picker */}
                            <IconButton color='primary'>
                                <EmotionIcon sx={{color: '#f8c03e'}}/>
                            </IconButton>
                        </div>
                    </div>

                    <div className='flex-grow flex justify-end'>
                        <Button
                            type='submit'
                            variant="contained"
                            disabled={!formik.values.caption.trim() && !selectImage && !selectVideo}
                            sx={{ 
                                bgcolor: '#912f56', 
                                borderRadius: '20px',
                                textTransform: 'none',
                                px: 4,
                                '&:hover': {
                                    bgcolor: '#7a2548'
                                }
                            }}
                            >
                            Post
                        </Button>
                    </div>
                </div>
            </div>
        </form>

        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={isLoading}
            >
            <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
      </Fade>
    </Modal>
  )
}

export default PostCreate