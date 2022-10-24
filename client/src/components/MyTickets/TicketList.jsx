import React from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import '../EventList/EventList.css'
import {Link} from 'react-router-dom';

const TicketList = ({id, published}) => {
  const [anchoEl, setanchoEl] = React.useState(false);
  const handleOpenNavMenu = (event) => {
    event.preventDefault();
    setanchoEl(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setanchoEl(null);
  };
  const deleteHandler = (event) => {
    handleCloseNavMenu();
    console.log(event.currentTarget);
    console.log('delete');
  };
  const operations = [
    {id: 'Delete', handler: deleteHandler},
  ];
  const publsihed_operations = [
    {id: 'Cancel', to: '/cancel-event'},
    {id: 'View', to: `/event/${id}`},
  ];
  const event_menu_id = id;
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
      {published
        ? publsihed_operations.map((operation) => (
          <Link key={operation.id} to={operation.to} style={{color: 'inherit', textDecoration: 'none'}}>
            <MenuItem>
              <Typography textAlign="center">{operation.id}</Typography>
            </MenuItem>
          </Link>
        ))
        : operations.map((operation) => (
          <Link key={operation.id} to={operation.to} style={{color: 'inherit', textDecoration: 'none'}}>
            <MenuItem onClick={operation.handler}>
              <Typography textAlign="center">{operation.id}</Typography>
            </MenuItem>
          </Link>
        ))}
    </Menu>
  );
  return (
    <Paper elevation={3} sx={{margin: '20px 0', backgroundColor: '#e8e8ea'}}>
      <div className="event-list-item">
        <div className="date">
          <span className="month">Nov</span>
          <span className="day">13</span>
        </div>
        <div className="event-info">
          <Typography gutterBottom variant="body1" color="text.primary">
            Event Title
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Event price
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Event Location
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
          <MoreVertIcon/>
        </IconButton>
        {event_menu}
      </div>
    </Paper>
  );
};

export default TicketList;
