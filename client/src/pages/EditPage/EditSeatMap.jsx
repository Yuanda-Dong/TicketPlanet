import React, { useState, useEffect } from 'react';
import SeatMap from '../../components/SeatCreation/SeatMap';
import NavBar from '../../components/Navbar/NavBar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { useLocation, useParams } from 'react-router-dom';
import './EditPage.css';
import { axiosInstance } from '../../config';

const EditSeatMap = () => {
  const { state } = useLocation();
  const params = useParams();

  const [seats, setSeats] = useState([]);

  useEffect(() => {
    async function fetch() {
      let res = await axiosInstance.get('event/seats/' + params.id);
      setSeats(res.data._id);
    }
    fetch();
  }, []);

  return (
    <div className="PostPage">
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ mb: 0, minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Box>
            <SeatMap tickets={state.tickets} inputMapId={seats} />
          </Box>
          <Divider />
        </Paper>
      </Container>
    </div>
  );
};

export default EditSeatMap;
