import * as React from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function More({ handleEdit, handleDelete, id }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="comment-more-btn"
        aria-controls={open ? 'comment-more-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="comment-more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() => {
            handleDelete(id);
            setAnchorEl(null);
          }}
        >
          Delete
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleEdit({ id, type: 'editing' });
            setAnchorEl(null);
          }}
        >
          Edit
        </MenuItem> */}
      </Menu>
    </div>
  );
}
