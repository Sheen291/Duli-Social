import React, { useState } from 'react'
import { CardHeader, Avatar, Button, useTheme, Typography } from '@mui/material' 

const SuggestionUserList = () => {
    const theme = useTheme(); 
    const [isFollowed, setIsFollowed] = useState(false);

    const handleFollow = () => {
        setIsFollowed(!isFollowed);
    }

  return (
    <div className='w-full'>
      <CardHeader
        avatar={
          <Avatar 
            aria-label="recipe" 
            src="https://i.pinimg.com/1200x/96/34/a5/9634a5ea46d7e296ffc5124bb26e4125.jpg"
            sx={{ width: 45, height: 45, border: '1px solid', borderColor: 'divider' }} 
          />
        }
        action={
          <Button 
                aria-label="follow-button" 
                onClick={handleFollow}
                size='small'
                variant={isFollowed ? 'outlined' : 'contained'} 
                sx={{
                    borderRadius: '10px',
                    paddingX: '1rem',
                    marginY: '1rem',
                    marginX: '0.5rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: 'none',
                    bgcolor: isFollowed 
                        ? 'transparent' 
                        : '#912f56', 
                    color: isFollowed 
                        ? 'text.primary'
                        : 'white',
                    borderColor: isFollowed ? 'divider' : 'transparent',
                    '&:hover': {
                        bgcolor: isFollowed ? 'action.hover' : '#7a2748',
                        boxShadow: 'none'
                    }
                }}
                >
                    {isFollowed ? "Following" : "Follow"}
            </Button>
        }
        title="Duong Nguyen"
        titleTypographyProps={{ 
          fontSize: '0.9rem',
          fontWeight: 'bold',
          color: 'text.primary' 
        }}
        subheader="Suggested for you"
        subheaderTypographyProps={{ 
          fontSize: '0.7rem',
          color: 'text.secondary'
        }}
        sx={{ px: 1 }}
      />
    </div>
  )
}

export default SuggestionUserList