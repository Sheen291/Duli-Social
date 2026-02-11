import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Badge, Divider, Switch, FormControlLabel, Box, useTheme, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useDispatch } from 'react-redux';

import HomeIcon from '@mui/icons-material/HomeFilled';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import SendIcon from '@mui/icons-material/Send';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';

import NotificationPanel from '../Notifications/NotificationPanel';
import { ColorModeContext } from '../../Theme/ThemeContext'; 

import { logoutUserAction } from '../../Redux/Auth/auth.action';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import HistoryIcon from '@mui/icons-material/History';

const Sidebar = ({ isSmallScreen, newNotificationCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const [openNotification, setOpenNotification] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logoutUserAction());
    navigate("/login");
  };

  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  const navigationMenu = [
    { 
      title: "Home", 
      icon: <HomeOutlinedIcon sx={{ fontSize: '1.9rem' }} />, 
      activeIcon: <HomeIcon sx={{ fontSize: '1.9rem' }} />, 
      path: "/" 
    },
    { 
      title: "Search", 
      icon: <SearchIcon sx={{ fontSize: '1.9rem' }} />, 
      activeIcon: <SearchIcon sx={{ fontSize: '1.9rem', stroke: "black", strokeWidth: 1 }} />, 
      path: "/search" 
    },
    { 
      title: "Explore", 
      icon: <ExploreOutlinedIcon sx={{ fontSize: '1.9rem' }} />, 
      activeIcon: <ExploreIcon sx={{ fontSize: '1.9rem' }} />, 
      path: "/explore" 
    },
    { 
      title: "Reels", 
      icon: <SmartDisplayOutlinedIcon sx={{ fontSize: '1.9rem' }} />, 
      activeIcon: <SmartDisplayIcon sx={{ fontSize: '1.9rem' }} />, 
      path: "/short-videos" 
    },
    { 
      title: "Messages", 
      icon: <SendOutlinedIcon sx={{ fontSize: '1.9rem' }} />, 
      activeIcon: <SendIcon sx={{ fontSize: '1.9rem' }} />, 
      path: "/message" 
    },
    { 
      title: "Notifications", 
      icon: <FavoriteBorderIcon sx={{ fontSize: '1.9rem' }} />, 
      activeIcon: <FavoriteIcon sx={{ fontSize: '1.9rem' }} />, 
      path: "/notifications" 
    },
    { 
      title: "Create", 
      icon: <AddBoxOutlinedIcon sx={{ fontSize: '1.9rem' }} />, 
      activeIcon: <AddBoxIcon sx={{ fontSize: '1.9rem' }} />, 
      path: "/create-short-videos" 
    },
    { 
      title: "Profile", 
      icon: <AccountCircleOutlinedIcon sx={{ fontSize: '1.9rem' }} />, 
      activeIcon: <AccountCircleIcon sx={{ fontSize: '1.9rem' }} />, 
      path: `/profile/${auth.user?.id}` 
    },
  ];

  const handleNavigate = (item) => {
    if (item.title === "Notifications") {
      setOpenNotification(!openNotification);
      return;
    }
    setOpenNotification(false);

    if (item.title === "Profile") {
      navigate(`/profile/${auth.user?.id || 1}`);
    } else {
      navigate(item.path);
    }
  };

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  return (
    <Box 
        className='h-screen sticky top-0 flex z-50'
        sx={{ 
            bgcolor: 'background.paper', 
            borderRight: 1,
            borderColor: 'divider' 
        }}
    >
      <div className={`h-full flex flex-col justify-between transition-all duration-300 ${isSmallScreen ? 'w-[72px] items-center px-2' : 'w-[245px] px-4'}`}>
        
        <div className='pt-8 w-full'>
          {/* LOGO */}
          <div className={`mb-10 ${isSmallScreen ? 'flex justify-center' : 'pl-3'}`}>
            {isSmallScreen ? (
              <InstagramIcon 
                sx={{ fontSize: '1.8rem', color: 'text.primary' }} 
                className='cursor-pointer hover:scale-110 transition-transform' 
                onClick={() => navigate('/')}
              /> 
            ) : (
              <span 
                className='font-bold text-2xl cursor-pointer select-none'
                style={{ 
                  fontFamily: '"Grand Hotel", cursive',
                  fontSize: '29px',
                  color: theme.palette.text.primary
                }} 
                onClick={() => navigate('/')}
              >
                Duli Social
              </span>
            )}
          </div>

          <div className='space-y-1'>
            {navigationMenu.map((item) => {
              const isPathActive = location.pathname === item.path || (item.title === "Profile" && location.pathname.startsWith("/profile"));
              const isNotiActive = openNotification && item.title === "Notifications";
              const isActive = isPathActive || isNotiActive;

              return (
                <div 
                  key={item.title} 
                  onClick={() => handleNavigate(item)}
                  className={`flex items-center cursor-pointer p-3 my-1 transition-all duration-200 group
                    ${isSmallScreen ? 'justify-center rounded-lg' : 'rounded-full'}
                  `}
                  style={{
                      backgroundColor: isActive ? (mode === 'dark' ? '#333' : '#f3f4f6') : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = mode === 'dark' ? '#1e1e1e' : '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className={`relative flex items-center justify-center transition-transform group-hover:scale-105 ${!isSmallScreen && 'mr-4'}`}>
                    {item.title === "Notifications" ? (
                      <Badge color="error" variant='dot' invisible={newNotificationCount === 0}>
                        <div style={{ color: isActive ? theme.palette.text.primary : theme.palette.text.primary }}>
                            {isActive ? item.activeIcon : item.icon}
                        </div>
                      </Badge>
                    ) : (
                      <div style={{ color: isActive ? theme.palette.text.primary : theme.palette.text.primary }}>
                         {isActive ? item.activeIcon : item.icon}
                      </div>
                    )}
                  </div>

                  {!isSmallScreen && (
                    <span 
                        className={`text-[16px] ${isActive ? 'font-bold' : 'font-normal'}`}
                        style={{ color: isActive ? theme.palette.text.primary : theme.palette.text.primary }}
                    >
                      {item.title}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className='pb-6 w-full'>
          <div 
            onClick={handleOpenMenu}
            className={`flex items-center p-3 rounded-full hover:bg-action-hover cursor-pointer transition-all
              ${isSmallScreen ? 'justify-center' : ''} 
              ${openMenu ? 'bg-action-selected' : ''}`}
            style={{ 
              backgroundColor: openMenu ? (mode === 'dark' ? '#333' : '#f3f4f6') : 'transparent' 
            }}
          >
            <MenuIcon sx={{ fontSize: '1.9rem', color: 'text.primary' }} />
            {!isSmallScreen && (
              <span className={`ml-4 text-[16px] ${openMenu ? 'font-bold' : 'font-normal'}`} 
                    style={{ color: theme.palette.text.primary }}>
                More
              </span>
            )}
          </div>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
            transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            PaperProps={{
              sx: {
                width: 250,
                borderRadius: '12px',
                mt: -1,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                p: 1
              },
            }}
          >
            <MenuItem onClick={() => navigate('/settings')} sx={{ borderRadius: '8px', py: 1.5 }}>
              <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>

            <MenuItem onClick={() => navigate(`/profile/${auth.user?.id}`)} sx={{ borderRadius: '8px', py: 1.5 }}>
              <ListItemIcon><BookmarkBorderOutlinedIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Saved" />
            </MenuItem>

            <MenuItem sx={{ borderRadius: '8px', py: 1.5 }}>
              <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Your Activity" />
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem onClick={toggleColorMode} sx={{ borderRadius: '8px', py: 1.5 }}>
              <ListItemIcon>
                {mode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText primary={`Switch appearance`} />
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem onClick={handleLogout} sx={{ borderRadius: '8px', py: 1.5 }}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Log out" />
            </MenuItem>
          </Menu>
        </div>
      </div>

      <NotificationPanel 
        open={openNotification} 
        handleClose={handleCloseNotification} 
      />
    </Box>
  );
};

export default Sidebar;