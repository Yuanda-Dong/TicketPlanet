import React from 'react';
import {Box, Button, ButtonGroup, Card, CardContent, CardHeader, Typography} from "@mui/material";
import PropTypes from 'prop-types';
import {grey} from "@mui/material/colors";

function PriceCard(props) {
	let [quantity, setQuantity] = React.useState(0)

	function plusQuantity() {
		quantity = quantity + 1
		quantity = quantity <= props.ticketInfo.availability ? quantity : props.ticketInfo.availability
		setQuantity(quantity)
	}

	function minusQuantity() {
		quantity = quantity - 1
		quantity = quantity >= 0 ? quantity : 0
		setQuantity(quantity)
	}

	return (
		<Card id={props.ticketInfo._id}
		      sx={{
			      maxWidth: 345,
			      minWidth: 280,
			      ":hover": {boxShadow: '0 8px 12px 0 rgba(0,0,0,0.2)'}
		      }}
		      className="price-card">
			<CardHeader
				title={props.ticketInfo.ticket_name}
				titleTypographyProps={{align: 'center'}}
				sx={{backgroundColor: grey[200]}}/>
			<CardContent>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'baseline',
						mb: 2,
					}}
				>
					<Typography component="h2" variant="h3" color="text.primary">
						${props.ticketInfo.price}
					</Typography>
					<Typography variant="h6" color="text.secondary">
						/AUS
					</Typography>
				</Box>
				<Typography variant="h5" align="center">
					Availability: {props.ticketInfo.availability}
				</Typography>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						'& > *': {
							m: 1,
						},
						margin: '20px'
					}}
				>
					<ButtonGroup variant="outlined" aria-label="outlined button group">
						<Button color={'error'} onClick={minusQuantity}>-</Button>
						<Button disabled>{quantity}</Button>
						<Button onClick={plusQuantity}>+</Button>
					</ButtonGroup>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}
				>
					<Typography component="h6" variant="h5" color="text.secondary">
						Total Price:
					</Typography>
					<Typography variant="h4" color="text.primary">
						${props.ticketInfo.price * quantity}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
}

PriceCard.propTypes = {
	ticketInfo: PropTypes.object,
}

export default PriceCard;