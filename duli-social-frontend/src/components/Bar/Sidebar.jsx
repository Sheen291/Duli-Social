import React, { useState } from 'react' // 1. Nhớ import useState
import HomeIcon from '@mui/icons-material/HomeFilled';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import VideoIcon from '@mui/icons-material/Slideshow';
import SendIcon from '@mui/icons-material/Send';
import NotificationIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation, useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import { useSelector } from 'react-redux';
import InstagramIcon from '@mui/icons-material/Instagram';
import NotificationPanel from '../Notifications/NotificationPanel'; // Đảm bảo đường dẫn đúng

const navigateMenu = [
  { title: "Home", icon: <HomeIcon/>, path: "/" },
  { title: "Search", icon: <SearchIcon/>, path: "/home" },
  { title: "Explore", icon: <ExploreIcon/>, path: "/home" },
  { title: "Reels", icon: <VideoIcon/>, path: "/home" },
  { title: "Message", icon: <SendIcon/>, path: "/message" },
  { title: "Notifications", icon: <NotificationIcon/>, path: "/notifications" },
  { title: "Create", icon: <AddCircleOutlineIcon/>, path: "/home" },
  { title: "Profile", icon: <AccountCircleIcon/>, path: "/profile" }
];

const Sidebar = ({ isSmallScreen }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useSelector(store => store);

  const [openNotification, setOpenNotification] = useState(false);

  const handleNavigate = (item) => {
    if (item.title === "Notifications") {
        setOpenNotification(true);
        return;
    }

    if (item.title === "Profile") {
      if (auth.user?.id) {
        navigate(`/profile/${auth.user.id}`);
      } else {
        navigate('/profile/1');
      }
    } else {
      navigate(item.path);
    }
  };

  const handleCloseNotification = () => {
      setOpenNotification(false);
  }

  return (
    <div className='h-screen flex'> 
      
      <Card className='card h-screen flex flex-col justify-between' sx={{ overflowX: 'hidden', borderRight: '1px solid #dbdbdb', boxShadow: 'none' }}>
        <div className={`space-y-8 ${isSmallScreen ? 'px-2 flex flex-col items-center' : 'pl-5'}`}>
          <div className='pt-4 pl-2'>
            {isSmallScreen ? (
              <InstagramIcon sx={{ fontSize: '2rem', pr: 1 }} className='cursor-pointer' onClick={() => navigate('/')}/> 
            ) : (
                <span className='logo font-bold text-xl cursor-pointer' onClick={() => navigate('/')}>Duli Social</span>
            )}
          </div>
          
          <div className='space-y-6'>
            {navigateMenu.map((item) => {
              return (
              <div key={item.title} onClick={() => handleNavigate(item)}
                   className={`flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-all 
                   ${isSmallScreen ? 'justify-center' : 'space-x-4'}
                   ${item.title === "Notifications" && openNotification ? 'font-bold' : ''} 
                   `}> 
                   
                <span className={`${item.title === "Notifications" && openNotification ? 'text-black' : 'text-gray-800'}`}>
                    {item.icon}
                </span>
                
                {!isSmallScreen && (
                  <p className={`text-lg ${item.title === "Notifications" && openNotification ? 'font-bold' : 'font-semibold'}`}>
                      {item.title}
                  </p>
                )}
              </div>
              )
            })}
          </div>
        </div>
        
        <div>
          <Divider/>
          <div className={`${isSmallScreen ? 'flex justify-center' : 'pl-5'}`}>
          </div>
        </div>
      </Card>

      <NotificationPanel 
          open={openNotification} 
          handleClose={handleCloseNotification} 
      />
      
    </div>
  )
}

export default Sidebar