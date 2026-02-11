import React, { useEffect } from 'react';
import { Avatar, Box, Typography, Button, useTheme } from '@mui/material'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUserAction, getPopularUsersAction, followUserAction } from '../../Redux/Auth/auth.action';

const RightHome = () => {
  const theme = useTheme(); 
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPopularUsersAction());
  }, [dispatch]);

  const handleLogOut = () => {
    dispatch(logoutUserAction());
    navigate("/login");
  };

  const handleFollow = (userId) => {
    dispatch(followUserAction(userId));
  };

  const suggestedUsers = auth.popularUsers
    ?.filter(user => user.id !== auth.user?.id)
    .slice(0, 5) || [];

  return (
    <Box sx={{ padding: 2, width: '100%', maxWidth: '350px', color: 'text.primary' }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(`/profile/${auth.user?.id}`)}>
          <Avatar 
            src={auth.user?.image}
            sx={{ width: 56, height: 56, mr: 2, border: '1px solid', borderColor: 'divider' }} 
          />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {auth.user?.firstName + " " + auth.user?.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                @{auth.user?.firstName?.toLowerCase()}{auth.user?.lastName?.toLowerCase()}
            </Typography>
          </Box>
        </Box>
        
        <Button 
            onClick={handleLogOut}
            sx={{ 
                textTransform: 'none', 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: theme.palette.mode === 'dark' ? '#ff4d94' : '#912f56',
                '&:hover': { bgcolor: 'transparent', opacity: 0.8 }
            }}
        >
            Logout
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9rem' }}>
            Suggestions for you
        </Typography>
        <Typography 
            variant="caption" 
            sx={{ 
                fontWeight: 600, 
                cursor: 'pointer', 
                color: 'text.primary',
                '&:hover': { opacity: 0.6 } 
            }}
        >
            See All
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
                <SuggestionUserItem 
                    key={user.id} 
                    user={user} 
                    onFollow={() => handleFollow(user.id)} 
                />
            ))
        ) : (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>No suggestions available.</Typography>
        )}
      </Box>

    </Box>
  );
};

const SuggestionUserItem = ({ user, onFollow }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [followed, setFollowed] = React.useState(false); 

    const handleClickFollow = () => {
        setFollowed(!followed);
        onFollow();
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(`/profile/${user.id}`)}>
                <Avatar src={user.image} sx={{ width: 32, height: 32, mr: 1.5, border: '1px solid', borderColor: 'divider' }} />
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.primary' }}>
                        {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        Suggested for you
                    </Typography>
                </Box>
            </Box>
            
            <Typography 
                onClick={handleClickFollow}
                variant="caption" 
                sx={{ 
                    color: followed 
                        ? 'text.secondary' 
                        : (theme.palette.mode === 'dark' ? '#3897f0' : '#912f56'), 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    fontSize: '0.75rem',
                    '&:hover': { opacity: 0.7 }
                }}
            >
                {followed ? "Following" : "Follow"}
            </Typography>
        </Box>
    );
};

export default RightHome;