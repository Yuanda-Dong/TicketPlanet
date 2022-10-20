import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
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
// firebase google auth
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import GoogleSignupDialog from '../components/SignUp/GoogleSignupDialog';
// axios baseUrl
import { axiosInstance } from '../config';
// redux import
import { useDispatch } from 'react-redux';
import { failedLogin, startLogin, successfulLogin } from '../redux/userSlice';
import { useState } from 'react';

export default function SignInSide() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [googleUserInfo, setGoogleUserInfo] = useState({});

  const signUp = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((user) => {
        const userInfo = {
          firstname: user._tokenResponse.firstName,
          lastname: user._tokenResponse.lastName,
          email: user.user.email,
          password: user._tokenResponse.idToken,
        };
        setGoogleUserInfo(userInfo);
        // TODO
        // check if user has already registered with backend server
        // if registered:
        // get full user info:  token needed? or not?
        // navigate('/')
        // else
        setOpenDialog(true);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const [info, setInfo] = useState({
    email: '',
    password: '',
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
    setInfo((info) => ({ ...info, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    const item = e.target.name;
    switch (item) {
      case 'email':
        if (info.email === '') {
          setErrors((err) => ({ ...err, error1: { error: true, message: 'Email can not be empty' } }));
        } else {
          setErrors((err) => ({ ...err, error1: { error: false, message: '' } }));
        }
      case 'password':
        if (info.password === '') {
          setErrors((err) => ({ ...err, error2: { error: true, message: 'Password can not be empty' } }));
        } else {
          setErrors((err) => ({ ...err, error2: { error: false, message: '' } }));
        }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    handleSignin(data);
  };

  const handleSignin = async (data) => {
    try {
      // fetch token
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      dispatch(startLogin());
      const res = await axiosInstance.post(
        '/token',
        {
          grant_type: 'password',
          username: data.get('email'),
          password: data.get('password'),
        },
        config
      );
      // store token in localStorage
      localStorage.setItem('token', res.data.access_token);

      // fetch user info
      config = {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      };
      const user = await axiosInstance.get('/user/me', config);
      dispatch(successfulLogin(user.data));
      navigate('/');
    } catch (e) {
      if (e.response) {
        alert(e.response.data.detail);
      } else if (e.request) {
        console.error(e.request);
      } else {
        console.errorr('Error', e.message);
      }
      dispatch(failedLogin());
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100%' }}>
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
              error={errors.error1.error}
              helperText={errors.error1.message}
              onChange={handleChange}
              onBlur={handleBlur}
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
              error={errors.error2.error}
              helperText={errors.error2.message}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={errors.error1.error || errors.error2.error}
            >
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
          <Button startIcon={<GoogleIcon />} sx={{ margin: '50px 0' }} variant="outlined" onClick={signInWithGoogle}>
            Sign in with Google
          </Button>
        </Box>
      </Grid>
      <GoogleSignupDialog open={openDialog} setOpen={setOpenDialog} userInfo={googleUserInfo} />
    </Grid>
  );
}
