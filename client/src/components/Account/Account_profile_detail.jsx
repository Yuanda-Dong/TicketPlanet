import { useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import './Account.css';

const genders = [
  {
    value: 'female',
    label: 'female',
  },
  {
    value: 'male',
    label: 'male',
  },
  {
    value: 'nobinary',
    label: 'other',
  },
];

const ageGroups = [
  {
    value: '<=14',
    label: '<=14 years',
  },
  {
    value: '15-25',
    label: '15-25 years',
  },
  {
    value: '26-35',
    label: '26-35 years',
  },
  {
    value: '36-50',
    label: '36-50 years',
  },
  {
    value: '>50',
    label: '>50 years',
  },
];

export const PersonalInformation = (props) => {
  const { currentUser } = useSelector((state) => state.user);
  const [values, setValues] = useState({
    firstName: currentUser.first_name,
    lastName: currentUser.last_name,
    email: currentUser.email,
    gender: currentUser.gender === 'nobinary' ? 'other' : currentUser.gender,
    age: currentUser.age,
    postcode: currentUser.postcode,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent className="profile">
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Postcode"
                name="postcode"
                onChange={handleChange}
                value={values.postcode}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Gender"
                name="gender"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.gender}
                variant="outlined"
              >
                {genders.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Age Group"
                name="age"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.age}
                variant="outlined"
              >
                {ageGroups.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2,
          }}
        >
          <Button color="primary" variant="contained" type="submit">
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};
