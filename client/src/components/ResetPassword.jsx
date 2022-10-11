import { TextField, Button as ButtonMui } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Button = styled(ButtonMui)`
  && {
    color: white;
    width: 32px;
    background-color: #4968a3;
    :hover {
      background-color: rgba(73, 104, 163, 0.7);
    }
  }
`;

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    current: '',
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
    error3: {
      error: false,
      message: '',
    },
  });

  const handleChange = (e) => {
    setPasswords((passwords) => ({ ...passwords, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO
  };

  const handleBlur = (e) => {
    const item = e.target.name;
    switch (item) {
      case 'current':
        if (passwords.current === '') {
          setErrors((err) => ({ ...err, error1: { error: true, message: 'Current Password can not be empty' } }));
        } else {
          setErrors((err) => ({ ...err, error1: { error: false, message: '' } }));
        }
      case 'new':
        if (passwords.new === '') {
          setErrors((err) => ({ ...err, error2: { error: true, message: 'New Password can not be empty' } }));
        } else {
          setErrors((err) => ({ ...err, error2: { error: false, message: '' } }));
        }
      case 'repeat':
        if (passwords.new !== passwords.repeat) {
          setErrors((err) => ({ ...err, error3: { error: true, message: 'Passwords do not match' } }));
        } else {
          setErrors((err) => ({ ...err, error3: { error: false, message: '' } }));
        }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        name="current"
        error={errors.error1.error}
        value={passwords.current}
        sx={{ width: '280px' }}
        label="Current Password"
        type="password"
        helperText={errors.error1.message}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <TextField
        name="new"
        error={errors.error2.error}
        value={passwords.new}
        sx={{ width: '280px' }}
        label="New Password"
        type="password"
        helperText={errors.error2.message}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <TextField
        name="repeat"
        error={errors.error3.error}
        value={passwords.repeat}
        sx={{ width: '280px' }}
        label="Repeat Password"
        type="password"
        helperText={errors.error3.message}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Button variant="contained" type="submit">
        Save
      </Button>
    </Form>
  );
};

export default ResetPassword;
