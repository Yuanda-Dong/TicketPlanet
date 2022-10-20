import {
	Box,
	Button as ButtonMui,
	Card,
	CardContent,
	CardHeader,
	Divider,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	OutlinedInput
} from '@mui/material';
import React, {useState} from 'react';
import './Account.css';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const Button = styled(ButtonMui)`
  && {
    color: white;
    padding: 7px 13px;
    background-color: #4968a3;
    :hover {
      background-color: rgba(73, 104, 163, 0.7);
    }
  }
`;

const ResetPassword = () => {
	const [passwords, setPasswords] = useState({
		current: '',
		new: '',
		repeat: '',
		currentShowPassword: false,
		newShowPassword: false,
		repeatShowPassword: false,
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

	const handleClickCurrentShowPassword = () => {
		setPasswords({...passwords, currentShowPassword: !passwords.currentShowPassword,});
	};

	const handleClickNewShowPassword = () => {
		setPasswords({...passwords, newShowPassword: !passwords.newShowPassword,});
	};
	const handleClickRepeatShowPassword = () => {
		setPasswords({...passwords, repeatShowPassword: !passwords.repeatShowPassword,});
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
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
				break
			case 'new':
				if (passwords.new === '') {
					setErrors((err) => ({...err, error2: {error: true, message: 'New Password can not be empty'}}));
				} else {
					setErrors((err) => ({...err, error2: {error: false, message: ''}}));
				}
				break
			case 'repeat':
				if (passwords.new !== passwords.repeat) {
					setErrors((err) => ({...err, error3: {error: true, message: 'Passwords do not match'}}));
				} else {
					setErrors((err) => ({...err, error3: {error: false, message: ''}}));
				}
		}
	};

	return (
		<form autoComplete="off" noValidate onSubmit={handleSubmit}>
			<Card>
				<CardHeader subheader="Update password" title="Password"/>
				<Divider/>
				<CardContent className="profile">
					<Grid container spacing={3}>
						<Grid item md={6} xs={12}>
							<Grid container spacing={3}>
								<Grid item md={12} xs={12}>
									<FormControl variant="outlined">
										<InputLabel htmlFor="outlined-adornment-password">Current Password</InputLabel>
										<OutlinedInput
											fullWidth
											name="current"
											error={errors.error1.error}
											value={passwords.current}
											label="Current Password"
											type={passwords.currentShowPassword ? 'text' : 'password'}
											onChange={handleChange}
											onBlur={handleBlur}
											endAdornment={
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visibility"
														onClick={handleClickCurrentShowPassword}
														onMouseDown={handleMouseDownPassword}
														edge="end"
													>
														{passwords.currentShowPassword ? <VisibilityOff/> : <Visibility/>}
													</IconButton>
												</InputAdornment>
											}
										/>
										<FormHelperText id="component-helper-text">
											{errors.error1.message}
										</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item md={12} xs={12}>
									<FormControl variant="outlined">
										<InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
										<OutlinedInput
											fullWidth
											name="new"
											error={errors.error2.error}
											value={passwords.new}
											label="New Password"
											type={passwords.newShowPassword ? 'text' : 'password'}
											onChange={handleChange}
											onBlur={handleBlur}
											endAdornment={
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visibility"
														onClick={handleClickNewShowPassword}
														onMouseDown={handleMouseDownPassword}
														edge="end"
													>
														{passwords.newShowPassword ? <VisibilityOff/> : <Visibility/>}
													</IconButton>
												</InputAdornment>
											}
										/>
										<FormHelperText id="component-helper-text">
											{errors.error2.message}
										</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item md={12} xs={12}>
									<FormControl variant="outlined">
										<InputLabel htmlFor="outlined-adornment-password">Repeat Password</InputLabel>
										<OutlinedInput
											fullWidth
											name="repeat"
											error={errors.error3.error}
											value={passwords.repeat}
											label="Repeat Password"
											type={passwords.repeatShowPassword ? 'text' : 'password'}
											onChange={handleChange}
											onBlur={handleBlur}
											endAdornment={
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visibility"
														onClick={handleClickRepeatShowPassword}
														onMouseDown={handleMouseDownPassword}
														edge="end"
													>
														{passwords.repeatShowPassword ? <VisibilityOff/> : <Visibility/>}
													</IconButton>
												</InputAdornment>
											}
										/>
										<FormHelperText id="component-helper-text">
											{errors.error3.message}
										</FormHelperText>
									</FormControl>
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
						p: 2,
					}}
				>
					<Button color="primary" variant="contained" type="submit">
						Update
					</Button>
				</Box>
			</Card>
		</form>
	);
};

export default ResetPassword;
