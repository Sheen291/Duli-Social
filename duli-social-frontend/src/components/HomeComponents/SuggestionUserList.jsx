import React, { useState } from 'react'
import { CardHeader, Avatar, Button } from '@mui/material'


const SuggestionUserList = () => {

    const [isFollowed, setIsFollowed] = useState(false);

    const handleFollow = () => {
        setIsFollowed(!isFollowed);
        //api
    }

  return (
    <div>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" src="https://i.pinimg.com/1200x/96/34/a5/9634a5ea46d7e296ffc5124bb26e4125.jpg"
                sx={{ width: 45, height: 45 }}/>
        }
        action={
          <Button aria-label="follow-button" 
                onClick={handleFollow}
                size='small'
                variant='contained'
                sx={{
                    borderRadius: '10px',
                    paddingX: '1rem',
                    margin: '1rem',
                    color: 'white',
                    backgroundColor: isFollowed ? 'grey.500' : '#912f56', 
                    fontWeight: 'bold',
                    textTransform: 'none',
                }}
                >{isFollowed ? "Following" : "Follow"}</Button>
        }
        title="Duong Nguyen"
        titleTypographyProps={{ 
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}
        subheader="Suggested for you"
        subheaderTypographyProps={{ 
          fontSize: '0.7rem'
        }}
      />
    </div>
  )
}

export default SuggestionUserList
