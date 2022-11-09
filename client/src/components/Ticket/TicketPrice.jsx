import React from 'react';
import NavBar from '../Navbar/NavBar';
import PriceCard from './PriceCard';
import { Alert, alpha, Box, Card, Container, Divider, IconButton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../config';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import moment from 'moment/moment';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import Paper from '@mui/material/Paper';
import './TicketPrice.css';
import SeatGrid from './SeatGrid';
import { useSelector } from 'react-redux';

function getCheckout(cancel_url, success_url, email, quantity, price, product_name, seats) {
  const body = {
    cancel_url: cancel_url,
    success_url: success_url,
    mode: 'payment',
    customer_email: email,
    line_items: [
      {
        quantity: quantity,
        price_data: {
          currency: 'aud',
          unit_amount: price,
          product_data: {
            name: product_name,
          },
        },
      },
    ],
    metadata: {
      seats: seats,
    },
  };
  return body;
}

function TicketPrice(props) {
  const { currentUser, token } = useSelector((state) => state.user);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const navigate = useNavigate();
  const params = useParams();
  const [eventInfo, setEventInfo] = React.useState({});
  const [priceInfo, setPriceInfo] = React.useState([]);
  const [quantities, setQuantities] = React.useState({});
  const [selected, setSelected] = React.useState([]);
  React.useEffect(() => {
    async function fetchData() {
      let resE = await axiosInstance.get('/event/' + params.id);
      setEventInfo(resE.data);
      const resP = await axiosInstance.get('/ticket/e/' + params.id);
      setPriceInfo(resP.data);
      for (let data of resP.data) {
        setQuantities((prev) => ({ ...prev, [data._id]: 0 }));
      }
    }

    fetchData();
  }, [params.id]);

  const handleClickBack = () => {
    navigate(`/event/${eventInfo._id}`);
  };

  const handleCheckout = async () => {
    try {
      const checkout_body = getCheckout(
        `http://localhost:3000/event/price/${eventInfo._id}`,
        'http://localhost:3000/my-tickets',
        currentUser.email,
        quantities.quantity,
        quantities.cost,
        quantities.name,
        selected
      );
      let res = await axiosInstance.post('/ticket/session/' + quantities.id, checkout_body, config);
      window.location.href = res.data?.url;
    } catch (e) {
      alert(e.response?.data.detail);
      // alert('Sorry, we encountered system issue, please try again later');
    }
  };
  return (
    <>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ mb: 0 }}>
        <Paper elevation={3} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Card sx={{ display: 'flex', mt: '20px', mb: '30px', boxShadow: 'none' }}>
            <IconButton
              sx={{ '&:hover': { background: alpha('#5569ff', 0.1) }, color: '#5569ff', pr: '16px' }}
              color="inherit"
              onClick={handleClickBack}
            >
              <ArrowCircleLeftOutlinedIcon sx={{ width: '2em', height: '2em' }} />
            </IconButton>
            <Typography variant="h3">Ticket Options</Typography>
          </Card>
          <Card sx={{ display: 'flex', pb: 'inherit', mb: 'inherit' }}>
            <Box sx={{ pl: '42px', pr: '21px' }} />
            <CardMedia component="img" sx={{ width: 500, height: 333 }} image={eventInfo.image_url} alt="Event Image" />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h4" sx={{ padding: 'inherit' }}>
                  {eventInfo.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" component="div" sx={{ padding: 'inherit' }}>
                  <AccessTimeOutlinedIcon fontSize="medium" sx={{ pr: '6px' }} />
                  START TIME: {moment(eventInfo.start_dt).format('MM/DD/YYYY h:mm a')}
                </Typography>
                <Typography variant="h6" color="text.secondary" component="div" sx={{ padding: 'inherit', pl: '66px' }}>
                  END TIME: {moment(eventInfo.end_dt).format('MM/DD/YYYY h:mm a')}
                </Typography>
                <Typography variant="h6" color="text.secondary" component="div" sx={{ padding: 'inherit' }}>
                  <LocationOnOutlinedIcon fontSize="medium" sx={{ pr: '6px' }} />
                  LOCATION: {eventInfo.address}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                <IconButton aria-label="previous"></IconButton>
              </Box>
            </Box>
          </Card>
          <Divider sx={{ borderColor: '#6969ff', borderBottomWidth: 'medium', mb: 'inherit' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', margin: '20px 0' }}>
            {priceInfo.map((e) => (
              <PriceCard key={e._id} ticketInfo={e} quantities={quantities} setQuantities={setQuantities} />
            ))}
          </div>
          <SeatGrid
            eventId={params.id}
            tickets={priceInfo}
            quantities={quantities}
            selected={selected}
            setSelected={setSelected}
          />
          <Button fullWidth variant="contained" onClick={handleCheckout}>
            Checkout
          </Button>
        </Paper>
      </Container>
    </>
  );
}

export default TicketPrice;
