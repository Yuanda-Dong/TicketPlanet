import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { SignUpForm2 } from './SignUpForm';
const GoogleSignupDialog = ({ open, setOpen, userInfo }) => {
  const handleClose = () => {
    console.log({ ...userInfo, ...profileInfo });
    setOpen(false);
  };
  const [profileInfo, setProfileInfo] = useState({ gender: '', age: '', postcode: '' });

  return (
    <div>
      <Dialog open={open} aria-labelledby="google-signup-form-title" aria-describedby="google-signup-form-description">
        <DialogTitle id="google-signup-form-title">{'You are almost there!'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below for us to provide you with better tailored services
          </DialogContentText>
          <SignUpForm2 state={[profileInfo, setProfileInfo]} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GoogleSignupDialog;
