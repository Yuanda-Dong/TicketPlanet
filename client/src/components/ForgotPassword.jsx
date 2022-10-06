import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';

export default function ForgotPassword() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = () => {};

  return (
    <div>
      <Link variant="body2" onClick={handleClickOpen}>
        Forgot Password?
      </Link>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Need help with your password?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the email you use for registration, and we will send you a code to verify your account.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSend}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
