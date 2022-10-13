import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './NavBar.css';
import UserMenu from './UserMenu';
import SearchBar from '../SearchBar/SearchBar';
// redux
import { useSelector } from 'react-redux';

const pages = ['Products', 'Pricing', 'Blog'];

const NavBar = (props) => {
  const { currentUser } = useSelector((state) => state.user);
  const dashboard = props.dashboard;
  const onDrawerToggle = props.onDrawerToggle;
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div className="app_bar">
      <div className="wrapper">
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={dashboard ? onDrawerToggle : handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Link className="link" to="/">
          <Typography className="logo">LOGO</Typography>
        </Link>

        {props.search === 1 ? (
          <SearchBar />
        ) : (
          // 'yoyo'
          <Box className="page_nav" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'inherit', display: 'block' }}>
                {page}
              </Button>
            ))}
          </Box>
        )}

        <div className="button_group">
          <Link className="link" to={currentUser ? '/post' : '/signup'}>
            <Button variant="outlined" className="create-event">
              Create Event
            </Button>
          </Link>

          {currentUser ? (
            <UserMenu />
          ) : (
            <>
              <Link className="link" to={'/signin'}>
                <Button variant="outlined" className="login">
                  Log in
                </Button>
              </Link>
              <Link className="link" to={'/signup'}>
                <Button variant="contained" className="signup">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  search: PropTypes.number,
};

export default NavBar;
