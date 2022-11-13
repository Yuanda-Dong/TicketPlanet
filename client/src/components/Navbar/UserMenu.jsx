import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/userSlice';
import LogoutdIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const settings = [
  <Typography style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#5d637c' }}>
    <ShoppingCartIcon /> <span>My Tickets</span>
  </Typography>,
  <Typography style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#5d637c' }}>
    <DashboardIcon /> <span>Dashboard</span>
  </Typography>,
  <Typography style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#5d637c' }}>
    <ManageAccountsIcon /> <span>Account</span>
  </Typography>,
  <Typography style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#5d637c' }}>
    <LogoutdIcon /> <span>Logout</span>
  </Typography>,
];

const UserMenu = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItem = (e) => {
    const item = e.target.innerText;
    switch (item) {
      case 'Dashboard':
        setAnchorElUser(null);
        navigate('/dashboard/events');
        break;
      case 'Account':
        setAnchorElUser(null);
        navigate('/account-setting');
        break;
      case 'My Tickets':
        setAnchorElUser(null);
        navigate('/my-tickets');
        break;
      case 'Logout':
        dispatch(logout());
        navigate('/');

        setAnchorElUser(null);

        break;
      default:
        setAnchorElUser(null);
    }
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar>{`${currentUser.first_name[0]}.${currentUser.last_name[0]}`}</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '27px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting, idx) => (
          <MenuItem key={idx} onClick={handleMenuItem}>
            <div style={{ textAlign: 'center' }}>{setting}</div>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default UserMenu;
