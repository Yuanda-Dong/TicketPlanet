import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { thumbnail } from '../../assets/dummy_img';
import './EventCard.css';

const EventCard = (props) => {
  const navigate = useNavigate();

  const viewEvent = (e) => {
    navigate(`/event/${props.eventInfo._id}`);
  };
  return (
    <Card id={props.eventInfo._id} sx={{ maxWidth: 345 }} className="event-card" onClick={viewEvent}>
      <CardMedia component="img" height="250" image={props.eventInfo.image_url || thumbnail} alt="green iguana" />
      <CardContent>
        <div className="date">
          <span className="month">
            {new Date(props.eventInfo.start_dt).toLocaleString('default', { month: 'long' })}
          </span>
          <span className="day">
            {new Date(props.eventInfo.start_dt).toLocaleString('default', { day: 'numeric' })}
          </span>
        </div>
        <div className="event-info">
          <Typography gutterBottom variant="h5" component="div">
            {props.eventInfo.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {props.eventInfo.category}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <LocationOnIcon />
            {props.eventInfo.address}
          </Typography>
        </div>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
};

export default EventCard;
EventCard.propTypes = {
  eventInfo: PropTypes.object,
};
