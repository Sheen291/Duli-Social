import React, { useState } from 'react';
import { Modal, Box, Avatar, IconButton, Button, CircularProgress, Backdrop } from '@mui/material';
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
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='font-bold text-lg'>Create New Story</h2>
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </div>

                <div className='flex flex-col space-y-4'>
                    <div className='w-full h-[60vh] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative border-2 border-dashed border-gray-300'>
                        {!selectedFile ? (
                            <label className='cursor-pointer flex flex-col items-center'>
                                <input type="file" hidden onChange={handleFileChange} />
                                <div className='w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mb-2'>
                                    <AddPhotoAlternateIcon color="primary" />
                                </div>
                                <span className='text-sm text-gray-500'>Select photo/video</span>
                            </label>
                        ) : (
                            <>
                                {fileType === "image" ? (
                                    <img src={selectedFile} alt="preview" className='w-full h-full object-cover' />
                                ) : (
                                    <video src={selectedFile} controls className='w-full h-full object-contain bg-black' />
                                )}
                                <IconButton 
                                    sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'white' }} 
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </>
                        )}
                    </div>
                    
                    <input 
                        type="text" 
                        placeholder="Add a caption..." 
                        className="w-full p-2 border-b outline-none text-center"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />

                    <Button 
                        variant="contained" 
                        fullWidth 
                        sx={{ bgcolor: '#912f56', borderRadius: 20 }}
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