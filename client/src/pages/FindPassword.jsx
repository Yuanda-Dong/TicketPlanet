import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import ReactInputVerificationCode from 'react-input-verification-code';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { axiosInstance } from '../config';
import Alert from '@mui/material/Alert';

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Wrapper = styled.form`
  display: flex;
  width: 300px;
  height: 250px;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: space-evenly;
  background-color: #dae9ff;
  border: 1px solid #ccc;
  border-radius: 10px;

  padding: 30px 15px;
`;

const StyledButton = styled.button`
  margin-top: 35px;
  color: white;
  background: #3c3f6d;
  border-radius: 24px;
  border: none;
  outline: none;
  width: 212px;
  height: 48px;
  cursor: pointer;
  :hover {
    background: #6b6f9d;
  }
  :disabled {
    background-color: #676767;
  }
`;

const StyledAlert = styled(Alert)`
  position: absolute;
  top: 30px;
`;

// const ReturnButton = styled.button`
//   margin-top: 20px;
//   position: absolute;
//   top: 0;
//   left: 15px;
//   color: white;
//   background: rgba(60, 63, 109, 0.8);
//   border-radius: 5px;
//   border: none;
//   outline: none;
//   width: 120px;
//   height: 48px;
//   text-decoration: none;
// `;

export default function FindPassword() {
  const [reset, setReset] = useState(false);
  const [passwords, setPasswords] = useState({
    new: '',
    repeat: '',
  });
  const [errors, setErrors] = useState({
    error1: {
      error: false,
      message: '',
    },
    error2: {
      error: false,
      message: '',
    },
  });

  const handleChange = (e) => {
    setPasswords((passwords) => ({ ...passwords, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    const item = e.target.name;
    switch (item) {
      case 'new':
        if (passwords.new === '') {
          setErrors((err) => ({ ...err, error1: { error: true, message: 'New Password can not be empty' } }));
        } else {
          setErrors((err) => ({ ...err, error1: { error: false, message: '' } }));
        }
      case 'repeat':
        if (passwords.new !== passwords.repeat) {
          setErrors((err) => ({ ...err, error2: { error: true, message: 'Passwords do not match' } }));
        } else {
          setErrors((err) => ({ ...err, error2: { error: false, message: '' } }));
        }
    }
  };

  const location = useLocation();
  const reset_token = location.search.split('=')[1];
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log({
      reset_password_token: reset_token,
      new_password: data.get('new'),
      confirm_password: data.get('repeat'),
    });
    axiosInstance
      .post('/user/reset-password', {
        reset_password_token: reset_token,
        new_password: data.get('new'),
        confirm_password: data.get('repeat'),
      })
      .then((res) => setReset(true));
  };
  return (
    <Container>
      <Link to="/signin">{/* <ReturnButton>Return</ReturnButton> */}</Link>

      {reset && <StyledAlert severity="success">Password has been reset, you can clow this window now</StyledAlert>}
      <Wrapper onSubmit={handleSubmit}>
        <TextField
          name="new"
          error={errors.error1.error}
          value={passwords.new}
          sx={{ width: '280px' }}
          label="New Password"
          type="password"
          helperText={errors.error1.message}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextField
          name="repeat"
          error={errors.error2.error}
          value={passwords.repeat}
          sx={{ width: '280px' }}
          label="Repeat Password"
          type="password"
          helperText={errors.error2.message}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <StyledButton type="submit" disabled={errors.error1.error || errors.error2.error}>
          Send
        </StyledButton>
      </Wrapper>
    </Container>
  );
}
