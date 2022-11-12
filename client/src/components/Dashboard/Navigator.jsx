import * as React from 'react';
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual';
import { useLocation } from 'react-router-dom';

import './Navigator.css';

const categories = [
  {
    id: 'Management',
    children: [
      {
        id: 'My Events',
        icon: <PeopleIcon />,
        to: 'events',
      },
      // { id: 'Orders', icon: <DnsRoundedIcon />, to: 'orders' },
      { id: 'Reports', icon: <PermMediaOutlinedIcon />, to: 'reports' },
    ],
  },
  // {
  //   id: 'Analystics',
  //   children: [
  //     { id: 'Analytics', icon: <SettingsIcon /> },
  //     { id: 'Performance', icon: <TimerIcon /> },
  //     { id: 'Test Lab', icon: <PhonelinkSetupIcon /> },
  //   ],
  // },
];

export default function Navigator(props) {
  const { ...other } = props;
  const { pathname } = useLocation();
  const path = pathname.split('/')[2];

  return (
    <Drawer className="drawer" variant="permanent" {...other}>
      {/* <Box sx={{ overflow: 'auto' }}> */}
      <List className="drawer-list">
        {categories.map(({ id, children }) => (
          <Box key={id}>
            <ListItem className="category">
              <ListItemText>{id}</ListItemText>
            </ListItem>

            {children.map(({ id: childId, icon, to }) => (
              <Link key={childId} to={to} className="link">
                <ListItem disablePadding>
                  <ListItemButton selected={to === path} className="item">
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{childId}</ListItemText>
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
      {/* </Box> */}
    </Drawer>
  );
}
