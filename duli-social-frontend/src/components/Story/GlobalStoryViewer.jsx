import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StoryViewer from './StoryViewer';
import { closeStoryViewAction } from '../../Redux/Story/story.action';

const GlobalStoryViewer = () => {
    const { story } = useSelector(store => store);
    const dispatch = useDispatch();
    const [currentStories, setCurrentStories] = useState([]);

    useEffect(() => {
        if (story.storyViewUserId && story.stories) {
            const targetStories = story.stories.filter(
                item => item.user.id === story.storyViewUserId
            );

            if (targetStories.length > 0) {
                setCurrentStories(targetStories);
            }
        }
    }, [story.storyViewUserId, story.stories]);

    const handleClose = () => {
        dispatch(closeStoryViewAction());
        setCurrentStories([]); 
    };

    if (!story.isStoryViewOpen || currentStories.length === 0) {
        return null;
    }

    return (
        <StoryViewer 
            open={story.isStoryViewOpen} 
            handleClose={handleClose}
            stories={currentStories}
            initialIndex={0} 
        />
    );
};

export default GlobalStoryViewer;