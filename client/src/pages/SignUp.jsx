import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { SignUpForm1, SignUpForm2 } from '../components/SignUp/SignUpForm';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';
import GoogleIcon from '@mui/icons-material/Google';
import './Payment/Payment.css';
// firebase google auth
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
// axios baseUrl
import { axiosInstance } from '../config';

const steps = ['Register your account', 'Enter your details'];

function getStepContent(step, [state1, state2]) {
  switch (step) {
    case 0:
      return <SignUpForm1 state={state1} />;
    case 1:
      return <SignUpForm2 state={state2} />;
    default:
      throw new Error('Unknown step');
  }
}

export default function SignUp() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const navSignIn = (e) => {
    e.preventDefault();
    navigate('/signin');
  };

  const [signupInfo, setSignupInfo] = React.useState({ firstname: '', lastname: '', email: '', password: '' });
  const [profileInfo, setProfileInfo] = React.useState({ gender: '', age: '', postcode: '' });

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep === 1) {
      console.log(signupInfo);
      console.log(profileInfo);
      handleSignup();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSignup = async () => {
    try {
      const res = await axiosInstance.post('/user/', {
        email: signupInfo.email,
        first_name: signupInfo.firstname,
        lastname: signupInfo.lastname,
        gender: profileInfo.gender === 'other' ? 'nobinary' : signupInfo.gender,
        postcode: profileInfo.postcode,
        age: profileInfo.age,
      });
      console.log(res.data);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const signUpWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((user) => {
        console.log(user);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div>
      <NavBar />
      <div className="Signs">
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Sign Up Account
            </Typography>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    Congrats! You've just created your account.
                  </Typography>
                  <Typography variant="subtitle1">
                    You can click{' '}
                    <span style={{ color: 'blue', textDecoration: 'underline' }} onClick={navSignIn}>
                      here
                    </span>{' '}
                    to login.
                  </Typography>
                  <Typography variant="subtitle1"></Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {getStepContent(activeStep, [
                    [signupInfo, setSignupInfo],
                    [profileInfo, setProfileInfo],
                  ])}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {activeStep !== 0 && (
                      <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                        Back
                      </Button>
                    )}
                    <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                      {activeStep === steps.length - 1 ? 'Sign Up' : 'Next'}
                    </Button>
                  </Box>
                </React.Fragment>
              )}
            </React.Fragment>
          </Paper>
          {activeStep === 0 && (
            <Box>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Button startIcon={<GoogleIcon />} variant="outlined" onClick={signUpWithGoogle}>
                    Sign up with Google
                  </Button>
                </Grid>
                <Grid item>
                  <Link variant="body2" onClick={navSignIn}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </div>
    </div>
  );
}
