import React, { useState } from 'react';
import { Modal, Box, Avatar, IconButton, Button, CircularProgress, Backdrop, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useDispatch, useSelector } from 'react-redux';
import { createStoryAction } from '../../Redux/Story/story.action';
import { cloudUpload } from '../../utils/cloudUpload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  outline: 'none'
};

const StoryCreate = ({ open, handleClose }) => {
    const theme = useTheme(); 
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState("image");
    const [isLoading, setIsLoading] = useState(false);
    const [caption, setCaption] = useState("");

    const handleFileChange = async (event) => {
        setIsLoading(true);
        const file = event.target.files[0];
        const type = file.type.includes("video") ? "video" : "image";
        
        const url = await cloudUpload(file, type);
        
        setSelectedFile(url);
        setFileType(type);
        setIsLoading(false);
    };

    const handleSubmit = () => {
        const data = {
            image: fileType === "image" ? selectedFile : null,
            video: fileType === "video" ? selectedFile : null,
            caption: caption
        };
        dispatch(createStoryAction(data));
        handleClose();
        setSelectedFile(null);
        setCaption("");
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                {/* HEADER */}
                <div className='flex justify-between items-center mb-4'>
                    <Typography variant='h6' fontWeight='bold' color='text.primary'>
                        Create New Story
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ color: 'text.primary' }} />
                    </IconButton>
                </div>

                <div className='flex flex-col space-y-4'>
                    {/* UPLOAD AREA */}
                    <Box 
                        sx={{ 
                            width: '100%', 
                            height: '60vh', 
                            bgcolor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#f5f5f5', 
                            borderRadius: '12px',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            overflow: 'hidden', 
                            position: 'relative',
                            border: `2px dashed ${theme.palette.divider}` 
                        }}
                    >
                        {!selectedFile ? (
                            <label className='cursor-pointer flex flex-col items-center'>
                                <input type="file" hidden onChange={handleFileChange} />
                                
                                <Box sx={{ 
                                    width: 56, height: 56, 
                                    bgcolor: theme.palette.mode === 'dark' ? '#444' : '#e0e0e0', 
                                    borderRadius: '50%', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 
                                }}>
                                    <AddPhotoAlternateIcon sx={{ color: '#912f56' }} />
                                </Box>
                                
                                <Typography variant='body2' color='text.secondary'>
                                    Select photo/video
                                </Typography>
                            </label>
                        ) : (
                            <>
                                {fileType === "image" ? (
                                    <img src={selectedFile} alt="preview" className='w-full h-full object-cover' />
                                ) : (
                                    <video src={selectedFile} controls className='w-full h-full object-contain bg-black' />
                                )}
                                
                                <IconButton 
                                    sx={{ 
                                        position: 'absolute', top: 10, right: 10, 
                                        bgcolor: 'rgba(0,0,0,0.6)', color: 'white',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } 
                                    }} 
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>
                    
                    {/* CAPTION INPUT */}
                    <input 
                        type="text" 
                        placeholder="Add a caption..." 
                        className="w-full p-2 outline-none text-center bg-transparent"
                        style={{ 
                            color: theme.palette.text.primary,
                            borderBottom: `1px solid ${theme.palette.divider}`
                        }}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />

                    <Button 
                        variant="contained" 
                        fullWidth 
                        sx={{ 
                            bgcolor: '#912f56', 
                            borderRadius: 20,
                            color: 'white',
                            '&:hover': { bgcolor: '#7a2748' }
                        }}
                        disabled={!selectedFile}
                        onClick={handleSubmit}
                    >
                        Share to Story
                    </Button>
                </div>
                
                <Backdrop open={isLoading} sx={{ zIndex: 1000, color: '#fff' }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        </Modal>
    );
};

export default StoryCreate;