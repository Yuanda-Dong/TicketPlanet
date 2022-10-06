import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import ForgotPassword from '../components/ForgotPassword';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';
import GoogleIcon from '@mui/icons-material/Google';

export default function SignInSide() {
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <div style={{ position: 'absolute', width: '100vw' }}>
        <NavBar />
      </div>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          // backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1658093180204-fd48aa384ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODkyMjY0OA&ixlib=rb-1.2.1&q=80&w=1080)',

          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
          backgroundSize: 'cover',
          backgroundPosition: 'contain',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, mt: 35, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <ForgotPassword />
              </Grid>
              <Grid item>
                <Link onClick={signUp} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Button startIcon={<GoogleIcon />} sx={{ margin: '50px 0' }} variant="outlined">
            Sign in with Google
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
