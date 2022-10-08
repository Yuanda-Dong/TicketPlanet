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
import PublicIcon from '@mui/icons-material/Public';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import './Navigator.css';

const categories = [
  {
    id: 'Management',
    children: [
      {
        id: 'My Events',
        icon: <PeopleIcon />,
        active: true,
        to: 'events',
      },
      { id: 'Orders', icon: <DnsRoundedIcon />, to: 'orders' },
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

  return (
    <Drawer className="drawer" variant="permanent" {...other}>
      {/* <Box sx={{ overflow: 'auto' }}> */}
      <List className="drawer-list">
        {categories.map(({ id, children }) => (
          <Box key={id}>
            <ListItem className="category">
              <ListItemText>{id}</ListItemText>
            </ListItem>

            {children.map(({ id: childId, icon, active, to }) => (
              <Link key={childId} to={to}>
                <ListItem disablePadding>
                  <ListItemButton selected={active} className="item">
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
