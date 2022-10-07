import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function SignUpForm1({state}) {

    const handler = (e) => {
        // console.log(e.target.value)
        state[1]({...state[0], [e.target.name]: e.target.value});
    };
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Grid container spacing={2}>
                <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            value={state[0].email}
            onChange={handler}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={state[0].password}
            onChange={handler}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h8">Your password should:</Typography>
          <ul>
              <li> contain 6 to 20 characters</li>
              <li> and contain at least one numeric digit</li>
              <li> and contain at least one uppercase</li>
              <li>and contain at least one lowercase letter</li>
          </ul>
        </Grid>
            </Grid>
        </Container>
    );
}

function SignUpForm2({state}) {

    const handler = (e) => {
        // console.log(e.target.value)
        state[1]({...state[1], [e.target.name]: e.target.value});
    };
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <FormControl>
                <FormLabel>Gender</FormLabel>
                <RadioGroup row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="gender"
                            value={state[1].gender}
                            onChange={handler}
                >
                    <FormControlLabel value="female" control={<Radio/>} label="Female"/>
                    <FormControlLabel value="male" control={<Radio/>} label="Male"/>
                    <FormControlLabel value="other" control={<Radio/>} label="Other"/>
                </RadioGroup>
                <FormLabel>Age Group</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="age"
                    value={state[1].age}
                    onChange={handler}
                >
                    <FormControlLabel value="<=14" control={<Radio/>} label="<=14 years"/>
                    <FormControlLabel value="15-25" control={<Radio/>} label="15-25 years"/>
                    <FormControlLabel value="26-35" control={<Radio/>} label="26-35 years"/>
                    <FormControlLabel value="36-50" control={<Radio/>} label="36-50 years"/>
                    <FormControlLabel value=">50" control={<Radio/>} label=">50 years"/>
                </RadioGroup>
            </FormControl>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="postcode"
                        name="postcode"
                        label="Postcode"
                        autoComplete="postcode"
                        helperText="Please enter 4 digits"
                        value={state[1].postcode}
                        onChange={handler}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

export {SignUpForm1, SignUpForm2}
