import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import './EventList.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { axiosInstance } from '../../config.js';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const EventList = (props) => {
  const [anchoEl, setanchoEl] = React.useState(false);
  const [DeleteOpen, setDeleteOpen] = useState(false);

  const handleOpenNavMenu = (event) => {
    event.preventDefault();
    setanchoEl(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setanchoEl(null);
  };

  const handleClickDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const publsihed_operations = [
    { id: 'Edit', to: `/edit/${props.eventInfo._id}` },
    // { id: 'Cancel', to: '/cancel-event' },
    { id: 'View', to: `/event/${props.eventInfo._id}` },
  ];

  const handleCancelEvent = async () => {
    console.log('sneding cancel api');
    await axiosInstance.post(`/event/cancel/${props.eventInfo._id}`);
    // setanchoEl(null);
    handleDeleteClose();
  };
  const event_menu_id = props.eventInfo._id;
  const event_menu = (
    <Menu
      id={event_menu_id}
      anchorEl={anchoEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchoEl)}
      onClose={handleCloseNavMenu}
    >
      {publsihed_operations.map((operation) => (
        <Link key={operation.id} to={operation.to} style={{ color: 'inherit', textDecoration: 'none' }}>
          <MenuItem>
            <Typography textAlign="center">{operation.id}</Typography>
          </MenuItem>
        </Link>
      ))}
      <MenuItem>
        <Typography onClick={handleClickDeleteOpen} textAlign="center">
          Cancel
        </Typography>
      </MenuItem>

      <Dialog
        open={DeleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Cancel Booking'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you need to cancel this event and process all refunds?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Disagree</Button>
          <Button onClick={handleCancelEvent} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Menu>
  );
  return (
    <Paper elevation={3} sx={{ margin: '20px 0', backgroundColor: 'white' }}>
      <div className="event-list-item">
        <div className="date">
          <span className="month">
            {new Date(props.eventInfo.start_dt).toLocaleString('default', { month: 'long' })}
          </span>
          <span className="day">
            {new Date(props.eventInfo.start_dt).toLocaleString('default', { day: 'numeric' })}
          </span>
        </div>
        <div className="event-info">
          <Typography gutterBottom variant="body1" color="text.primary">
            {props.eventInfo.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.eventInfo.address}
          </Typography>
        </div>
        <IconButton
          size="large"
          aria-label="event-card-operation"
          aria-controls="event-operation"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MoreVertIcon />
        </IconButton>
        {event_menu}
      </div>
    </Paper>
  );
};

export default EventList;
EventList.propTypes = {
  eventInfo: PropTypes.object,
};
