import React from "react";
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Ticket = (props) =>{
    return  <Card sx={{ minWidth: 250 }} >
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {props.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Price: ${props.price}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Available quantity: {props.quantity}
      </Typography>
    </CardContent>
   
  </Card>
    
}


Ticket.propTypes = {
    price: PropTypes.number,
    quantity: PropTypes.number,
    name: PropTypes.string,
};
  
export default Ticket;
  