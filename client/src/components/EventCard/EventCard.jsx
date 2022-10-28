import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import './EventCard.css';

const  EventCard = (props) => {
  const navigate = useNavigate();

  const viewEvent = (e) => {
    navigate(`/event/${props.eventInfo._id}`);
  };
  return (
    <Card id={props.eventInfo._id} sx={{ maxWidth: 345 }} className="event-card" onClick={viewEvent}>
      <CardMedia
        component="img"
        height="250"
        image="data:image/png;base64,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"
        alt="green iguana"
      />
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
}

export default EventCard;
EventCard.propTypes = {
  eventInfo: PropTypes.object,
};
