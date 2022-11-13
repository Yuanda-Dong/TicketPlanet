import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {SignUpForm1, SignUpForm2} from '../components/SignUp/SignUpForm';
import {useNavigate} from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';
import GoogleIcon from '@mui/icons-material/Google';
// import './Payment/Payment.css';
// firebase google auth
import {auth, provider} from '../firebase';
import {signInWithPopup} from 'firebase/auth';
// axios baseUrl
import {axiosInstance} from '../config';
import GoogleSignupDialog from '../components/SignUp/GoogleSignupDialog';
import {useDispatch} from 'react-redux';
import {failedLogin, startLogin, storeToken, successfulLogin} from '../redux/userSlice';
import styled from "styled-components";
import {Button as ButtonMui} from "@mui/material";

const Button = styled(ButtonMui)`
  && {
    color: white;
    padding: 7px 13px;
    background-color: #4f4cee;
    :hover {
      background-color: rgba(100, 100, 255, 0.82);
    }
  }
`;

const steps = ['Register your account', 'Enter your details'];

function getStepContent(step, [state1, state2]) {
	switch (step) {
		case 0:
			return <SignUpForm1 state={state1}/>;
		case 1:
			return <SignUpForm2 state={state2}/>;
		default:
			throw new Error('Unknown step');
	}
}

export default function SignUp() {
	const dispatch = useDispatch();

	const [openDialog, setOpenDialog] = useState(false);
	const [googleUserInfo, setGoogleUserInfo] = useState({});

	const navigate = useNavigate();
	const [activeStep, setActiveStep] = React.useState(0);
	const navSignIn = (e) => {
		e.preventDefault();
		navigate('/signin');
	};

	const [signupInfo, setSignupInfo] = React.useState({
		firstname: '',
		lastname: '',
		email: '',
		password: '',
		error: true
	});
	const [profileInfo, setProfileInfo] = React.useState({gender: '', age: '', postcode: '', error: false});

	const handleNext = (e) => {
		e.preventDefault();
		if (activeStep === 1) {
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
			dispatch(startLogin());
			const res = await axiosInstance.post('/user/', {
				email: signupInfo.email,
				first_name: signupInfo.firstname,
				last_name: signupInfo.lastname,
				password: signupInfo.password,
				gender: profileInfo.gender,
				postcode: profileInfo.postcode,
				age: profileInfo.age,
			});

			let {token, ...userData} = res.data;
			dispatch(storeToken(token.access_token));
			dispatch(successfulLogin(userData));
			navigate('/');
		} catch (e) {
			console.error(e.response.data.detail);
			dispatch(failedLogin());
		}
	};

	const signUpWithGoogle = () => {
		signInWithPopup(auth, provider)
			.then((user) => {
				const userInfo = {
					first_name: user._tokenResponse.firstName,
					last_name: user._tokenResponse.lastName,
					email: user.user.email,
					password: user._tokenResponse.idToken.slice(0, 10),
				};
				setGoogleUserInfo(userInfo);
				setOpenDialog(true);
			})
			.catch((e) => {
				console.error(e);
			});
	};

	return (
		<div>
			<GoogleSignupDialog open={openDialog} setOpen={setOpenDialog} userInfo={googleUserInfo}/>
			<NavBar/>
			<div className="Signs">
				<Container component="main" maxWidth="sm" sx={{mb: 4}}>
					<Paper variant="outlined"
					       sx={{
						       my: {xs: 3, md: 6}, p: {xs: 2, md: 3},
						       boxShadow: '0 8px 12px 0 rgba(202,200,255,0.8)',
						       ':hover': {boxShadow: '0 12px 16px 0 rgba(100,100,255,0.82)'},
						       borderColor: '#6765e8'
					       }}>
						<Typography component="h1" variant="h4" align="center">
							Sign Up Account
						</Typography>
						<Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
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
										<span style={{color: 'blue', textDecoration: 'underline'}} onClick={navSignIn}>
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
									<Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
										{activeStep !== 0 && (
											<Button onClick={handleBack} sx={{mt: 3, ml: 1}}>
												Back
											</Button>
										)}
										<Button variant="contained" onClick={handleNext} sx={{mt: 3, ml: 1}} disabled={signupInfo.error}>
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
									<Button color={"error"} startIcon={<GoogleIcon/>} variant="contained" onClick={signUpWithGoogle}>
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
