import React, { useEffect, useState } from 'react';
import { 
  Box, Button, Typography, Modal, Avatar, Fade, IconButton, 
  Backdrop, CircularProgress, useTheme 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import CloseButton from '@mui/icons-material/CloseRounded';
import ImageIcon from '@mui/icons-material/Collections';
import VideoIcon from '@mui/icons-material/Videocam';
import EmotionIcon from '@mui/icons-material/EmojiEmotions';
import { cloudUpload } from '../../utils/cloudUpload';
import { createPostAction } from '../../Redux/Post/post.action';

const PostCreate = ({ handleClose, open }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const [selectImage, setSelectImage] = useState();
  const [selectVideo, setSelectVideo] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 500 },
    borderRadius: '24px',
    boxShadow: 24,
    p: 4,
    bgcolor: 'background.paper', 
    outline: "none",
    color: 'text.primary',
    border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
    borderColor: 'divider'
  };

  const resetForm = () => {
    setSelectImage(null);
    setSelectVideo(null);
    formik.resetForm();
  }

  useEffect(() => {
    if (!open) resetForm();
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

  const formik = useFormik({
    initialValues: { caption: "", image: "", video: "" },
    onSubmit: (values) => {
      dispatch(createPostAction(values));
      resetForm();
      handleClose();
    }
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: 'blur(4px)' } } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {/* HEADER */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Avatar src={auth.user?.image} />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {auth.user?.firstName} {auth.user?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  @{auth.user?.firstName?.toLowerCase()}_{auth.user?.lastName?.toLowerCase()}
                </Typography>
              </Box>
            </Box>
            <IconButton 
                onClick={handleClose} 
                sx={{ 
                    color: 'text.secondary',
                    '&:hover': { bgcolor: 'action.hover', color: '#912f56' } 
                }}
            >
              <CloseButton />
            </IconButton>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Box>
              <textarea
                placeholder="What's on your mind?"
                name='caption'
                rows="4"
                value={formik.values.caption}
                onChange={formik.handleChange}
                style={{
                  outline: 'none',
                  width: '100%',
                  marginTop: '8px',
                  borderRadius: '8px',
                  padding: '12px',
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff',
                  color: theme.palette.text.primary,
                  resize: 'none',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#912f56'}
                onBlur={(e) => e.target.style.borderColor = theme.palette.divider}
              ></textarea>

              {/* MEDIA PREVIEW */}
              {(selectImage || selectVideo) && (
                <Box sx={{ 
                    width: '100%', borderRadius: '12px', border: '1px solid', 
                    borderColor: 'divider', p: 1, mt: 2, position: 'relative', 
                    bgcolor: theme.palette.mode === 'dark' ? 'black' : '#f9f9f9' 
                }}>
                  <IconButton 
                    size="small"
                    onClick={() => {
                        setSelectImage(null); setSelectVideo(null);
                        formik.setFieldValue("image", ""); formik.setFieldValue("video", "");
                    }}
                    sx={{ 
                        position: 'absolute', top: 12, right: 12, 
                        bgcolor: 'rgba(0,0,0,0.5)', color: 'white', 
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } 
                    }}
                  >
                    <CloseButton fontSize="small" />
                  </IconButton>

                  {selectImage && (
                    <img src={selectImage} alt='' style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px' }} />
                  )}
                  {selectVideo && (
                    <video src={selectVideo} controls style={{ width: '100%', maxHeight: '300px', borderRadius: '8px' }} />
                  )}
                </Box>
              )}

              {/* ACTIONS FOOTER */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <input type="file" accept="image/*" onChange={handleSelectImage} style={{ display: "none" }} id="image-input" />
                  <label htmlFor='image-input'>
                    <IconButton component="span" sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <ImageIcon sx={{ color: '#58c472' }} />
                    </IconButton>
                  </label>

                  <input type="file" accept='video/*' onChange={handleSelectVideo} style={{ display: "none" }} id="video-input" />
                  <label htmlFor='video-input'>
                    <IconButton component="span" sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <VideoIcon sx={{ color: '#f23e5c' }} />
                    </IconButton>
                  </label>

                  <IconButton sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                    <EmotionIcon sx={{ color: '#f8c03e' }} />
                  </IconButton>
                </Box>

                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type='submit'
                    variant="contained"
                    disabled={!formik.values.caption.trim() && !selectImage && !selectVideo}
                    sx={{
                      bgcolor: '#912f56',
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      px: 4,
                      '&:hover': { bgcolor: '#7a2548', boxShadow: 'none' },
                      boxShadow: 'none',
                      '&.Mui-disabled': { 
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#e0e0e0',
                        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.26)'
                      }
                    }}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>

          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute', borderRadius: '24px' }} open={isLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>
      </Fade>
    </Modal>
  )
}

export default PostCreate;