import React from 'react';
import { Box, Button, ButtonGroup, Card, CardContent, CardHeader, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { grey } from '@mui/material/colors';

function PriceCard({ ticketInfo, quantities, setQuantities }) {
  let [quantity, setQuantity] = React.useState(0);

  function plusQuantity() {
    quantity = quantity + 1;
    quantity = quantity <= ticketInfo.availability ? quantity : ticketInfo.availability;
    setQuantity(quantity);
    const cost = ticketInfo.price * quantity;
    setQuantities({ id: ticketInfo._id, name: ticketInfo.ticket_name, quantity: quantity, cost: cost });
  }

  function minusQuantity() {
    quantity = quantity - 1;
    quantity = quantity >= 0 ? quantity : 0;
    setQuantity(quantity);
    const cost = ticketInfo.price * quantity;
    setQuantities({ id: ticketInfo._id, name: ticketInfo.ticket_name, quantity: quantity, cost: cost });
  }

  return (
    <Card
      id={ticketInfo._id}
      sx={{
        maxWidth: 345,
        minWidth: 280,
        ':hover': { boxShadow: '0 8px 12px 0 rgba(0,0,0,0.2)' },
      }}
      className="price-card"
    >
      <CardHeader
        title={ticketInfo.ticket_name}
        titleTypographyProps={{ align: 'center' }}
        sx={{ backgroundColor: grey[200] }}
      />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            mb: 2,
          }}
        >
          <Typography component="h2" variant="h3" color="text.primary">
            ${ticketInfo.price}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            /AUS
          </Typography>
        </Box>
        <Typography variant="h5" align="center">
          Availability: {ticketInfo.availability}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
              m: 1,
            },
            margin: '20px',
          }}
        >
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button color={'error'} onClick={minusQuantity}>
              -
            </Button>
            <Button disabled>{ticketInfo._id === quantities.id ? quantity : 0}</Button>
            <Button onClick={plusQuantity}>+</Button>
          </ButtonGroup>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h6" variant="h5" color="text.secondary">
            Total Price:
          </Typography>
          <Typography variant="h4" color="text.primary">
            {`$${ticketInfo._id === quantities.id ? ticketInfo.price * quantity : 0}`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

PriceCard.propTypes = {
  ticketInfo: PropTypes.object,
};

export default PriceCard;
