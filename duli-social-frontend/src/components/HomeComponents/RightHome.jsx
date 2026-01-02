import Avatar from '@mui/material/Avatar'
import * as React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import SuggestionUserList from './SuggestionUserList';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUserAction } from '../../Redux/Auth/auth.action';

const suggestionUser = [1,1,1,1,1];

const RightHome = () => {
  const {auth} = useSelector(store => store);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    dispatch(logoutUserAction());
    navigate("/login");
  }

  return (
    <Card className='card h-screen flex flex-col p-5'>
      <div className='flex items-center space-x-3'>
        <Avatar src={auth.user?.image}
                sx={{ width: 50, height: 50 }}/>
        <div className='flex flex-col'>
          <p className='font-bold text-lg'>{auth.user?.firstName + " " + auth.user?.lastName}</p>
          <p className='opacity-70 text-sm'>@{auth.user?.firstName.toLowerCase() + "_" + auth.user?.lastName.toLowerCase()}</p>
        </div>
        <div className='ml-auto'>
          <IconButton
            id="option-button"
            aria-controls={open ? 'option-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MenuIcon/>
          </IconButton>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={() => {handleClose(); handleLogOut()}}>Log out</MenuItem>
          </Menu>
        </div>
      </div>

        <div className='flex items-center pt-5'>
          <p className='font-semibold opacity-80'>Suggestions for you</p>
          <p className='text-xs font-semibold opacity-95 ml-auto'>View All</p>
        </div>

        <div className='-space-y-5'>
          {suggestionUser.map((item, index) => (<SuggestionUserList key={index} />))}
        </div>

      
    </Card>
  )
}

export default RightHome
