import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { SignUpForm2 } from './SignUpForm';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../../config';
import { failedLogin, startLogin, successfulLogin, storeToken } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const GoogleSignupDialog = ({ open, setOpen, userInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      dispatch(startLogin());
      const res = await axiosInstance.post('/user/', {
        email: userInfo.email,
        first_name: userInfo.firstname,
        last_name: userInfo.lastname,
        password: userInfo.password,
        ...profileInfo,
      });
      let { token, ...userData } = res.data;
      dispatch(storeToken(token.access_token));
      dispatch(successfulLogin(userData));
      navigate('/');
    } catch (err) {
      dispatch(failedLogin());
    }

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
          <Button onClick={handleSignup} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GoogleSignupDialog;
