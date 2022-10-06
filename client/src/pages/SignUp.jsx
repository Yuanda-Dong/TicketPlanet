import * as React from 'react';
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
import SignUpForm from '../components/SignUp/SignUpForm';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';
import GoogleIcon from '@mui/icons-material/Google';

const steps = ['Register your account', 'Enter your details', 'Choose your preferences'];

function getStepContent(step, [state1, state2, state3]) {
  switch (step) {
    case 0:
      return <SignUpForm state={state1} />;
    case 1:
      return <SignUpForm state={state2} />;
    case 2:
      return <SignUpForm state={state3} />;
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

  const [signupInfo, setSignupInfo] = React.useState({ email: '', password: '' });
  const [profileInfo, setProfileInfo] = React.useState({ gender: '', age: '', postcode: '' });
  const [preference, setPreference] = React.useState([]);

  const handleNext = (e) => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <div>
      <NavBar />
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
                  [preference, setPreference],
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
                <Button startIcon={<GoogleIcon />} variant="outlined">
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
  );
}
