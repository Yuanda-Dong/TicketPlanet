import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function SignUpForm({ state }) {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={state[0].username}
            onChange={(e) => {
              state[1]({ ...state[0], username: e.target.value });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={state[0].email}
            onChange={(e) => {
              state[1]({ ...state[0], email: e.target.value });
            }}
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
            onChange={(e) => {
              state[1]({ ...state[0], password: e.target.value });
            }}
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
