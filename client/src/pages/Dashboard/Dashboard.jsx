import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Navigator from '../../components/Dashboard/Navigator';
import NavBar from '../../components/Navbar/NavBar';
import { Outlet } from 'react-router-dom';

let theme = createTheme({});

const drawerWidth = 256;

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <NavBar onDrawerToggle={handleDrawerToggle} dashboard={true} />
      <Box sx={{ display: 'flex', height: '130vh', flexDirection: 'column' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}>
            {isSmUp ? null : (
              <Navigator
                PaperProps={{ style: { width: drawerWidth } }}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
              />
            )}

            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              sx={{ display: { md: 'block', sm: 'none', xs: 'none' } }}
            />
          </Box>
          <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
            <Outlet />
          </Box>
        </div>
      </Box>
    </>
  );
}
