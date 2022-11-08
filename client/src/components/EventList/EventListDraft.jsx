import React from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import './EventList.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../config';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const EventListDraft = (props) => {
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
  const handleClickOpen1 = () => {
    setOpen(true);
  };

  const handleClose1 = () => {
    setOpen(false);
  };
  const handleCloseYes1 = () =>{
    handlePublish();
    setOpen(false);
  }

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleCloseYes2 = () =>{
    handleDelete();
    setOpen2(false);
  }
    const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [anchoEl, setanchoEl] = React.useState(false);
  const handleOpenNavMenu = (event) => {
    event.preventDefault();
    setanchoEl(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setanchoEl(null);
  };
  const handleDelete = async ()  => {
    let res = await axiosInstance.delete(`/event/${props.eventInfo._id}`,config);
    props.rerender(!props.re);
  };

  const handlePublish = async ()  => {
    let res = await axiosInstance.post(`/event/publish/${props.eventInfo._id}`,null,config);
    props.rerender(!props.re);
  }; 

  const publsihed_operations = [
    { id: 'Edit', to: `/edit/${props.eventInfo._id}` },
    { id: 'View', to: `/event/${props.eventInfo._id}` },
  ];
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
        <MenuItem onClick={handleClickOpen1}> 
            <Typography textAlign="center">Publish</Typography>
          </MenuItem>

        <MenuItem onClick={handleClickOpen2}> 
            <Typography textAlign="center">Delete</Typography>
          </MenuItem>
      {publsihed_operations.map((operation) => 
      
     (
        <Link key={operation.id} to={operation.to} style={{ color: 'inherit', textDecoration: 'none' }}>
          <MenuItem>
            <Typography textAlign="center">{operation.id}</Typography>
          </MenuItem>
        </Link>
        
      ))}
    </Menu>
  );
  return (
    <Paper elevation={3} sx={{ margin: '20px 0', backgroundColor: '#e8e8ea' }}>
         <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Event"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2}>Disagree</Button>
          <Button onClick={handleCloseYes2} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Publish Event"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to publish this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose1}>Disagree</Button>
          <Button onClick={handleCloseYes1} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>


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

export default EventListDraft;
EventListDraft.propTypes = {
  eventInfo: PropTypes.object,
  re:PropTypes.bool,
  rerender: PropTypes.func,
};
