import React, {useState} from 'react';
import {
	Box,
	Button as ButtonMui,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	Snackbar,
	TextField
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import './Account.css';
import {axiosInstance} from "../../config";
import {successfulLogin} from "../../redux/userSlice";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant={"filled"} {...props}/>
})

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

const genders = [
	{
		value: 'female',
		label: 'Female',
	},
	{
		value: 'male',
		label: 'Male',
	},
	{
		value: 'nonbinary',
		label: 'Other',
	},
];

const ageGroups = [
	{
		value: '<=14',
		label: '<=14 years',
	},
	{
		value: '15-25',
		label: '15-25 years',
	},
	{
		value: '26-35',
		label: '26-35 years',
	},
	{
		value: '36-50',
		label: '36-50 years',
	},
	{
		value: '>50',
		label: '>50 years',
	},
];

export const PersonalInformation = (props) => {
	const dispatch = useDispatch();
	const [changeInfo, setChangeInfo] = useState(false);
	const {currentUser, token} = useSelector((state) => state.user);
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const [values, setValues] = useState({
		email: currentUser.email,
		first_name: currentUser.first_name,
		last_name: currentUser.last_name,
		gender: currentUser.gender,
		postcode: currentUser.postcode,
		age: currentUser.age,
	});

	const handleChange = (event) => {
		setValues({
			...values,
			[event.target.name]: event.target.value,
		});
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}
		setChangeInfo(false)
	}

	const updateData = async () => {
		try {
			const res = await axiosInstance.put(`/user/${currentUser._id}`, values, config)
			console.log('data', res.data)
			dispatch(successfulLogin(res.data))
			setChangeInfo(true)
		} catch (e) {
			if (e.response) {
				alert(e.response.data.detail);
			} else if (e.request) {
				console.error(e.request);
			} else {
				console.error('Error', e.message);
			}
		}
	}

	return (
		<form autoComplete="off" noValidate {...props}>
			{changeInfo && <Snackbar open={changeInfo} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity={"success"} sx={{width: '100%'}}>Personal information updated
					successfully!
				</Alert></Snackbar>}
			<Card>
				<CardHeader subheader="The information can be edited" title="Personal Information"/>
				<Divider/>
				<CardContent className="profile">
					<Grid container spacing={3}>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								required
								helperText="Please specify the first name"
								label="First name"
								name="first_name"
								onChange={handleChange}
								value={values.first_name}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								required
								label="Last name"
								name="last_name"
								onChange={handleChange}
								value={values.last_name}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								required
								label="Email Address"
								name="email"
								onChange={handleChange}
								value={values.email}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								required
								label="Postcode"
								name="postcode"
								onChange={handleChange}
								value={values.postcode}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								required
								label="Gender"
								name="gender"
								onChange={handleChange}
								select
								SelectProps={{native: true}}
								value={values.gender}
								variant="outlined"
							>
								{genders.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</TextField>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								required
								label="Age Group"
								name="age"
								onChange={handleChange}
								select
								SelectProps={{native: true}}
								value={values.age}
								variant="outlined"
							>
								{ageGroups.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</TextField>
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
					<Button color="primary" variant="contained" onClick={updateData}>
						Save details
					</Button>
				</Box>
			</Card>
		</form>
	);
};
