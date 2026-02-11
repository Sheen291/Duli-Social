import React from 'react'
import { Avatar, Box, Typography, useTheme } from '@mui/material' 

const StoryCircle = ({ user }) => {
  const theme = useTheme(); 

  return (
    <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        cursor: 'pointer', 
        minWidth: '80px' 
    }}> 
      
      <Box className="bg-gradient-to-tr from-yellow-400 to-fuchsia-600"
        sx={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: '3px' 
        }}
      >
          
          <Box 
            sx={{ 
                bgcolor: 'background.paper', 
                borderRadius: '50%', 
                p: '2px', 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
          >
              
              <Avatar 
                  sx={{ width: '100%', height: '100%' }}
                  src={user?.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt={user?.firstName}
              />
          </Box>
      </Box>
      
      {/* Tên User */}
      <Typography 
        variant="caption" 
        sx={{ 
            fontWeight: 500, 
            mt: 1, 
            width: '75px', 
            textAlign: 'center',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'text.primary' 
        }}
      >
          {user?.firstName ? (user.firstName + " " + user.lastName) : "User"}
      </Typography>
    </Box>
  )
}

export default StoryCircle