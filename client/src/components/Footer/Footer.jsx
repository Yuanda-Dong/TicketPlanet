import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Our Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

const Footer = () => {
  return (
    <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
      <Copyright />
    </Box>
  );
};

export default Footer;
