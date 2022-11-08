import React from 'react';
import SeatMap from '../../components/SeatCreation/SeatMap';
import NavBar from '../../components/Navbar/NavBar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import './PostPage.css';
import { useLocation } from 'react-router-dom';

const SeatCreationPage = () => {
  const { state } = useLocation();
  return (
    <div className="PostPage">
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ mb: 0, minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Box>
            <SeatMap tickets={state.tickets} />
          </Box>
          <Divider />
        </Paper>
      </Container>
    </div>
  );
};

export default SeatCreationPage;
