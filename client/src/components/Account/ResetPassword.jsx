import {Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField} from '@mui/material';
import React, {useState} from 'react';
import './Account.css'
import Typography from "@mui/material/Typography";
// import styled from 'styled-components';

// const Button = styled(ButtonMui)`
//   && {
//     color: white;
//     width: 32px;
//     background-color: #4968a3;
//     :hover {
//       background-color: rgba(73, 104, 163, 0.7);
//     }
//   }
// `;

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
		setPasswords((passwords) => ({...passwords, [e.target.name]: e.target.value}));
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
					setErrors((err) => ({...err, error1: {error: true, message: 'Current Password can not be empty'}}));
				} else {
					setErrors((err) => ({...err, error1: {error: false, message: ''}}));
				}
			case 'new':
				if (passwords.new === '') {
					setErrors((err) => ({...err, error2: {error: true, message: 'New Password can not be empty'}}));
				} else {
					setErrors((err) => ({...err, error2: {error: false, message: ''}}));
				}
			case 'repeat':
				if (passwords.new !== passwords.repeat) {
					setErrors((err) => ({...err, error3: {error: true, message: 'Passwords do not match'}}));
				} else {
					setErrors((err) => ({...err, error3: {error: false, message: ''}}));
				}
		}
	};

	return (
		<form
			autoComplete="off"
			noValidate
			onSubmit={handleSubmit}
		>
			<Card>
				<CardHeader
					subheader="Update password"
					title="Password"
				/>
				<Divider/>
				<CardContent className='profile'>
					<Grid container spacing={3}>
						<Grid item md={6} xs={12}>
							<Grid container spacing={3}>
								<Grid item md={12} xs={12}>
									<TextField
										fullWidth
										name="current"
										error={errors.error1.error}
										value={passwords.current}
										label="Current Password"
										type="password"
										helperText={errors.error1.message}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</Grid>
								<Grid item md={12} xs={12}>
									<TextField
										fullWidth
										name="new"
										error={errors.error2.error}
										value={passwords.new}
										label="New Password"
										type="password"
										helperText={errors.error2.message}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</Grid>
								<Grid item md={12} xs={12}>
									<TextField
										fullWidth
										name="repeat"
										error={errors.error3.error}
										value={passwords.repeat}
										label="Repeat Password"
										type="password"
										helperText={errors.error3.message}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item md={6} xs={12}>
							<Typography variant="h8">Your password should:</Typography>
							<ul>
								<li> contain 6 to 20 characters</li>
								<li> and contain at least one numeric digit</li>
								<li> and contain at least one uppercase</li>
								<li>and contain at least one lowercase letter</li>
							</ul>
						</Grid>
					</Grid>
				</CardContent>
				<Divider/>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						p: 2
					}}
				>
					<Button
						color="primary"
						variant="contained"
						type="submit"
					>
						Update
					</Button>
				</Box>
			</Card>
		</form>
	);
};

export default ResetPassword;
