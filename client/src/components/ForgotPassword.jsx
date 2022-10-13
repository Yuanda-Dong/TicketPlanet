import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import { axiosInstance } from '../config';

export default function ForgotPassword() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [seconds, setSeconds] = useState(null);
  // { params: { email } }

  const setTimer = () => {
    setSeconds(60);
    let mySeconds = 60;
    // TODO Clear previos interval
    const intervalId = setInterval(() => {
      mySeconds = mySeconds - 1;
      setSeconds(mySeconds);
      if (mySeconds === 0) {
        clearInterval(intervalId);
        setSeconds(null);
      }
    }, 1000);
  };
  const handleSend = (e) => {
    axiosInstance
      .post('/user/forgot-password', { email })
      .then((res) => {
        setTimer();
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
        if (e.response) {
          alert(e.response.data.detail);
        } else if (e.request) {
          console.error(e.request);
        } else {
          console.errorr('Error', e.message);
        }
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Link variant="body2" onClick={handleClickOpen}>
        Forgot Password?
      </Link>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Need help with your password?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the email you use for registration, and we will send you an email to reset your password.
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
            helperText={seconds && `Password reset email has been sent (${seconds}s)`}
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
