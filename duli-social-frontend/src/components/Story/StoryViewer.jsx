import React, { useEffect, useState } from 'react';
import { Modal, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StoryViewer = ({ open, handleClose, stories, initialIndex = 0 }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);

    const currentStory = stories?.[currentStoryIndex];

    useEffect(() => {
        if (open) {
            setCurrentStoryIndex(initialIndex);
            setProgress(0);
        }
    }, [open, initialIndex]);

    // 1. LOGIC CHẠY THANH THỜI GIAN (Chỉ việc tăng số, không xử lý logic đóng mở ở đây)
    useEffect(() => {
        if (!open || !currentStory) return;

        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    return 100; // Giữ ở 100 rồi để useEffect kia xử lý
                }
                return oldProgress + 2; 
            });
        }, 100);

        return () => clearInterval(interval);
    }, [currentStory, open]); // Bỏ stories.length ra khỏi dependency để tránh re-render thừa

    // 2. LOGIC CHUYỂN STORY (FIX LỖI UPDATE WHILE RENDERING TẠI ĐÂY)
    // useEffect này sẽ chạy SAU KHI render xong, nên an toàn để gọi handleClose
    useEffect(() => {
        if (progress >= 100) {
            if (currentStoryIndex < stories.length - 1) {
                // Chuyển sang story tiếp theo
                setCurrentStoryIndex((prev) => prev + 1);
                setProgress(0);
            } else {
                // Hết story -> Đóng Modal
                handleClose();
            }
        }
    }, [progress, currentStoryIndex, stories.length, handleClose]);


    const handleNavigate = (direction) => {
        if (direction === "next") {
            if (currentStoryIndex < stories.length - 1) {
                setCurrentStoryIndex(currentStoryIndex + 1);
                setProgress(0);
            } else {
                handleClose();
            }
        } else if (direction === "prev") {
            if (currentStoryIndex > 0) {
                setCurrentStoryIndex(currentStoryIndex - 1);
                setProgress(0);
            } else {
                setProgress(0);
            }
        }
    };

    if (!currentStory) return null;

    return (
        <Modal 
            open={open} 
            onClose={handleClose} 
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <div className='relative w-[90vw] h-[90vh] md:w-[400px] md:h-[80vh] bg-black rounded-xl overflow-hidden flex flex-col'>
                
                <div 
                    className='absolute top-0 left-0 w-1/3 h-full z-20' 
                    onClick={() => handleNavigate("prev")}
                ></div>
                <div 
                    className='absolute top-0 right-0 w-2/3 h-full z-20' 
                    onClick={() => handleNavigate("next")}
                ></div>

                <div className='absolute top-0 w-full p-4 z-30 bg-gradient-to-b from-black/60 to-transparent'>
                    <div className="flex space-x-1 mb-2">
                        {stories.map((_, index) => (
                            <div key={index} className="h-1 bg-gray-500/50 rounded-full flex-1 overflow-hidden">
                                <div 
                                    className="h-full bg-white transition-all duration-100 ease-linear"
                                    style={{ 
                                        width: index < currentStoryIndex ? '100%' : 
                                               index === currentStoryIndex ? `${progress}%` : '0%' 
                                    }}
                                ></div>
                            </div>
                        ))}
                    </div>

                    <div className='flex items-center justify-between mt-2'>
                        <div className='flex items-center gap-2'>
                            <Avatar src={currentStory.user?.image} sx={{ width: 32, height: 32 }} />
                            <div className='flex flex-col'>
                                <span className='text-white font-semibold text-sm shadow-black drop-shadow-md'>
                                    {currentStory.user?.firstName} {currentStory.user?.lastName}
                                </span>
                                <span className='text-gray-300 text-[10px]'>
                                    {new Date(currentStory.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                        <CloseIcon 
                            sx={{ color: 'white', cursor: 'pointer', zIndex: 40 }} 
                            onClick={(e) => { e.stopPropagation(); handleClose(); }} 
                        />
                    </div>
                </div>

                <div className='flex-1 flex items-center justify-center bg-gray-900'>
                    {currentStory.image && (
                        <img src={currentStory.image} alt="" className='w-full h-full object-cover' />
                    )}
                    {currentStory.video && (
                        <video src={currentStory.video} autoPlay className='w-full h-full object-contain' />
                    )}
                </div>
                
                 {currentStory.caption && (
                    <div className='absolute bottom-10 w-full text-center px-4 z-10'>
                        <p className='text-white text-lg font-medium drop-shadow-md bg-black/30 p-2 rounded-lg inline-block'>
                            {currentStory.caption}
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default StoryViewer;