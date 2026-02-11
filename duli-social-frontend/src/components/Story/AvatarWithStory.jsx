import React from 'react';
import { Avatar, useTheme, Box } from '@mui/material'; 
import { useSelector, useDispatch } from 'react-redux';
import { openStoryViewAction } from '../../Redux/Story/story.action';
import { useNavigate } from 'react-router-dom';

const AvatarWithStory = ({ user, size = 40 }) => {
    const theme = useTheme(); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { story } = useSelector(store => store);

    const hasStory = story.stories.some(s => s.user.id === user.id);

    const handleClick = (e) => {
        e.stopPropagation();
        if (hasStory) {
            dispatch(openStoryViewAction(user.id));
        } else {
            navigate(`/profile/${user.id}`);
        }
    };

    const borderThickness = 2; 
    const gapThickness = 2;    
    const totalSize = size + (borderThickness + gapThickness) * 2;

    return (
        <div 
            className={`rounded-full cursor-pointer flex items-center justify-center relative flex-shrink-0
                ${hasStory ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' : ''}
            `}
            onClick={handleClick}
            style={{ 
                width: totalSize, 
                height: totalSize, 
                padding: borderThickness
            }}
        >
            <Box 
                sx={{ 
                    bgcolor: 'background.paper', 
                    borderRadius: '50%',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: `${gapThickness}px`
                }}
            >
                <Avatar 
                    src={user?.image} 
                    alt={user?.firstName}
                    sx={{ width: size, height: size }}
                />
            </Box>
        </div>
    );
};

export default AvatarWithStory;