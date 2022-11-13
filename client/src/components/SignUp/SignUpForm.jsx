import React, {useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {TextField} from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {ValidateEmail, ValidatePassword} from '../../helper.js';
// import styled from 'styled-components';

// const TextField = styled(TextFieldMui)`
//   & label.Mui-focused {
//     color: white;
//   }
//   & .MuiOutlinedInput-root {
//     &.Mui-focused fieldset {
//       border-color: #4f4cee;
//     }
//   }
// `;

function SignUpForm1({state}) {
	const handler = (e) => {
		// console.log(state[0]);
		state[1]({...state[0], [e.target.name]: e.target.value});
	};
	const [errors, setErrors] = useState({
		firstname: {
			error: false,
			message: '',
		},
		lastname: {
			error: false,
			message: '',
		},
		email: {
			error: false,
			message: '',
		},
		password: {
			error: false,
			message: '',
		},
	});

	const handleError = (e) => {
		switch (e.target.name) {
			case 'firstname':
				if (state[0].firstname === '') {
					setErrors((prev) => ({...prev, firstname: {error: true, message: 'Firstname can not be empty'}}));
					state[1]({...state[0], error: true})
				} else {
					setErrors((prev) => ({...prev, firstname: {error: false, message: ''}}));
					state[1]({...state[0], error: false})
				}
				break;
			case 'lastname':
				if (state[0].lastname === '') {
					setErrors((prev) => ({...prev, lastname: {error: true, message: 'Lastname can not be empty'}}));
					state[1]({...state[0], error: true})
				} else {
					setErrors((prev) => ({...prev, lastname: {error: false, message: ''}}));
					state[1]({...state[0], error: false})
				}
				break;
			case 'email':
				if (!ValidateEmail(state[0].email)) {
					setErrors((prev) => ({...prev, email: {error: true, message: 'Please enter a valid email'}}));
					state[1]({...state[0], error: true})
				} else if (state[0].email === '') {
					setErrors((prev) => ({...prev, email: {error: true, message: 'Email can not be empty'}}));
					state[1]({...state[0], error: true})
				} else {
					setErrors((prev) => ({...prev, email: {error: false, message: ''}}));
					state[1]({...state[0], error: false})
				}
				break;
			case 'password':
				if (!ValidatePassword(state[0].password)) {
					setErrors((prev) => ({...prev, password: {error: true, message: 'Please enter a valid password'}}));
					state[1]({...state[0], error: true})
				} else if (state[0].password === '') {
					setErrors((prev) => ({...prev, password: {error: true, message: 'Password can not be empty'}}));
					state[1]({...state[0], error: true})
				} else {
					setErrors((prev) => ({...prev, password: {error: false, message: ''}}));
					state[1]({...state[0], error: false})
				}
				break;
			default:
				break;
		}
	};
	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline/>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<TextField
						required
						id="firstname"
						name="firstname"
						label="Firstname"
						autoComplete="firstname"
						onBlur={handleError}
						error={errors.firstname.error}
						helperText={errors.firstname.error && errors.firstname.message}
						value={state[0].firstname}
						onChange={handler}
					/>
				</Grid>
				<Grid item xs={6}>
					<TextField
						required
						id="lastname"
						name="lastname"
						label="Lastname"
						autoComplete="lastname"
						onBlur={handleError}
						error={errors.lastname.error}
						helperText={errors.lastname.error && errors.lastname.message}
						value={state[0].lastname}
						onChange={handler}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						required
						fullWidth
						id="email"
						name="email"
						label="Email Address"
						autoComplete="email"
						onBlur={handleError}
						error={errors.email.error}
						helperText={errors.email.error && errors.email.message}
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
						onBlur={handleError}
						error={errors.password.error}
						helperText={errors.password.error && errors.password.message}
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
		state[1]({...state[0], [e.target.name]: e.target.value});
	};

	const [errors, setErrors] = useState({
		postcode: {
			error: false,
			message: '',
		},
	});

	const handleError = (e) => {
		switch (e.target.name) {
			case 'postcode':
				if (!((state[0].postcode).length === 4)) {
					setErrors((prev) => ({...prev, postcode: {error: true, message: 'Please enter 4 digits'}}));
					state[1]({...state[0], error: true})
				} else {
					setErrors((prev) => ({...prev, postcode: {error: false, message: ''}}));
					state[1]({...state[0], error: false})
				}
				break;
			default:
				break;
		}
	};
	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline/>
			<FormControl>
				<FormLabel>Gender</FormLabel>
				<RadioGroup
					row
					aria-labelledby="demo-row-radio-buttons-group-label"
					name="gender"
					value={state[0].gender}
					onChange={handler}
				>
					<FormControlLabel value="female" control={<Radio/>} label="Female"/>
					<FormControlLabel value="male" control={<Radio/>} label="Male"/>
					<FormControlLabel value="nonbinary" control={<Radio/>} label="Other"/>
				</RadioGroup>
			</FormControl>
			<FormControl sx={{mt: 1}}>
				<FormLabel>Age Group</FormLabel>
				<RadioGroup
					aria-labelledby="demo-row-radio-buttons-group-label"
					name="age"
					value={state[0].age}
					onChange={handler}
				>
					<FormControlLabel value="<=14" control={<Radio/>} label="<=14 years"/>
					<FormControlLabel value="15-25" control={<Radio/>} label="15-25 years"/>
					<FormControlLabel value="26-35" control={<Radio/>} label="26-35 years"/>
					<FormControlLabel value="36-50" control={<Radio/>} label="36-50 years"/>
					<FormControlLabel value=">50" control={<Radio/>} label=">50 years"/>
				</RadioGroup>
			</FormControl>
			<Grid container spacing={2} mt={1}>
				<Grid item xs={12}>
					<TextField
						required
						fullWidth
						id="postcode"
						name="postcode"
						label="Postcode"
						autoComplete="postcode"
						onBlur={handleError}
						error={errors.postcode.error}
						helperText={errors.postcode.error ? errors.postcode.message : "Please enter 4 digits"}
						value={state[0].postcode}
						onChange={handler}
					/>
				</Grid>
			</Grid>
		</Container>
	);
}

export {SignUpForm1, SignUpForm2};
