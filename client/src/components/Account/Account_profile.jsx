import {Avatar, Box, Button, Card, CardActions, CardContent, Divider, Typography} from '@mui/material';
import React from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";


export const AccountProfile = (props) => {
	const {currentUser} = useSelector((state) => state.user);
	console.log(currentUser)
	return (
		<Card {...props}>
			<CardContent>
				<Box
					sx={{
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'column'
					}}
				>
					<Avatar sx={{
						height: 64,
						mb: 2,
						width: 64
					}}>{`${currentUser.first_name[0]}.${currentUser.last_name[0]}`}</Avatar>
					<Typography
						color="textPrimary"
						gutterBottom
						variant="h5"
					>
						{`${currentUser.first_name} ${currentUser.last_name}`}
					</Typography>
					<Typography
						color="textSecondary"
						variant="body2"
					>
						{currentUser.email}
					</Typography>
					<Typography
						color="textSecondary"
						variant="body2"
					>
						{currentUser.postcode}
					</Typography>
				</Box>
			</CardContent>
			<Divider/>
			<Link className="link" to={'/my-tickets'}><CardActions>
				<Button
					color="primary"
					fullWidth
					variant="text"
				>My Tickets
				</Button>
			</CardActions></Link>
		</Card>
	);
};