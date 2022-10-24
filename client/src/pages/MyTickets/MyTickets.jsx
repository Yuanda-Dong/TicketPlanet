import {Container, Grid, Typography} from '@mui/material';
import {useSelector} from "react-redux";
import {PageTitleWrapper} from "../../components/MyTickets/Label";
import NavBar from "../../components/Navbar/NavBar";
import TicketOrders from "../../components/MyTickets/TicketOrders";
import './MyTickets.css'

const MyTickets = () => {
	const {currentUser} = useSelector((state) => state.user);

	return (
		<>
			<NavBar/>
			<div className={'myTicket'}>
				<PageTitleWrapper>
					<Grid container justifyContent="space-between" alignItems="center">
						<Grid item>
							<Typography variant="h4" component="h4">
								Tickets
							</Typography>
							<Typography variant={"h6"}>
								{currentUser.first_name}, these are your recent tickets.
							</Typography>
						</Grid>
					</Grid>
				</PageTitleWrapper>
				<Container maxWidth="lg">
					<Grid
						container
						direction="row"
						justifyContent="center"
						alignItems="stretch"
						spacing={3}
					>
						<Grid item xs={12}>
							<TicketOrders/>
						</Grid>
					</Grid>
				</Container>
			</div>
		</>
	);
};

export default MyTickets;