import * as React from 'react';
import {useState} from 'react';
import {
	alpha,
	Box,
	Card,
	CardHeader,
	Collapse,
	Divider,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	Typography
} from '@mui/material';
import {Label} from "./Label";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DetailsTwoToneIcon from "@mui/icons-material/DetailsTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

const getStatusLabel = (ticketOrderStatus) => {
	const map = {
		passed: {
			text: 'Passed',
			color: 'success'
		},
		pending: {
			text: 'Pending',
			color: 'warning'
		},
		canceled: {
			text: 'Canceled',
			color: 'error'
		}
	};

	const {text, color} = map[ticketOrderStatus];

	return <Label color={color}>{text}</Label>;
};

const applyFilters = (ticketOrders, filters) => {
	return ticketOrders.filter((ticketOrder) => {
		let matches = true;

		if (filters.status && ticketOrder.status !== filters.status) {
			matches = false;
		}

		return matches;
	});
};

const applyPagination = (ticketOrders, page, limit) => {
	return ticketOrders.slice(page * limit, page * limit + limit);
};

function TicketRow(props) {
	const navigate = useNavigate();
	const {ticketRow} = props;
	const [open, setOpen] = useState(false)

	const handleClickEventDetail = () => {
		navigate(`/event/${ticketRow.event_id}`);
	}

	return (
		<React.Fragment>
			<TableRow hover key={ticketRow.id}>
				<TableCell>
					<IconButton aria-label={'expend row'} size={"small"} onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
					</IconButton>
				</TableCell>
				<TableCell>
					<Typography variant="body1" fontWeight="bold" color='#223354' gutterBottom noWrap>
						{ticketRow.ticket_name}
					</Typography>
				</TableCell>
				<TableCell>
					<Typography variant="body1" fontWeight="bold" color='#223354' gutterBottom noWrap>
						{ticketRow.start_dt}
					</Typography>
					<Typography variant="body1" fontWeight="bold" color='#223354' gutterBottom noWrap>
						{ticketRow.end_dt}
					</Typography>
				</TableCell>
				<TableCell align="right">
					<Typography variant="body1" fontWeight="bold" color='#223354' gutterBottom noWrap>
						{ticketRow.amount}
					</Typography>
				</TableCell>
				<TableCell align="right">
					<Typography variant="body1" fontWeight="bold" color='#223354' gutterBottom noWrap>
						{ticketRow.price}
					</Typography>
				</TableCell>
				<TableCell align="right">
					{getStatusLabel(ticketRow.status)}
				</TableCell>
				<TableCell align="right">
					<Tooltip title="Event Detail" arrow>
						<IconButton
							sx={{'&:hover': {background: alpha('#5569ff', 0.1)}, color: '#5569ff'}}
							color="inherit"
							size="small"
							onClick={handleClickEventDetail}>
							<DetailsTwoToneIcon fontSize="small"/>
						</IconButton>
					</Tooltip>
					{ticketRow.status === 'pending' ? (<Tooltip title="Cancel booking" arrow>
						<IconButton
							sx={{'&:hover': {background: alpha('#FF1943', 0.1)}, color: '#FF1943'}}
							color="inherit"
							size="small">
							<DeleteTwoToneIcon fontSize="small"/>
						</IconButton></Tooltip>) : <Tooltip title="Delete booking" arrow>
						<IconButton
							sx={{'&:hover': {background: alpha('#FF1943', 0.1)}, color: '#FF1943'}}
							color="inherit"
							size="small">
							<DeleteTwoToneIcon fontSize="small"/>
						</IconButton></Tooltip>}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
					<Collapse in={open} timeout={'auto'} unmountOnExit>
						<Box sx={{margin: 1}}>
							<Typography variant={"h6"} gutterBottom component='div'>
								Ticket Detail
							</Typography>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>EVENT TITLE</TableCell>
										<TableCell>CATEGORY</TableCell>
										<TableCell>ADDRESS</TableCell>
										<TableCell align={"right"}>POSTCODE</TableCell>
										<TableCell align={"right"}>SECTION</TableCell>
										<TableCell align={"right"}>SEAT</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{ticketRow.detail.map((detail) => (
										<TableRow>
											<TableCell>
												<Typography variant="body1" fontWeight="bold" color gutterBottom noWrap>
													{detail.title}
												</Typography>
											</TableCell>
											<TableCell>{detail.category}</TableCell>
											<TableCell>{detail.address}</TableCell>
											<TableCell align={"right"}>{detail.postcode}</TableCell>
											<TableCell align={"right"}>{detail.section_number}</TableCell>
											<TableCell align={"right"}>{detail.seat_number}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>)
}

TicketRow.propTypes = {
	ticketRow: PropTypes.shape({
		ticket_name: PropTypes.string.isRequired,
		event_id: PropTypes.string.isRequired,
		start_dt: PropTypes.string.isRequired,
		end_dt: PropTypes.string.isRequired,
		amount: PropTypes.number.isRequired,
		price: PropTypes.number.isRequired,
		status: PropTypes.string.isRequired,
		detail: PropTypes.arrayOf(
			PropTypes.shape({
				title: PropTypes.string.isRequired,
				category: PropTypes.string.isRequired,
				address: PropTypes.string,
				postcode: PropTypes.number.isRequired,
				seat_number: PropTypes.string.isRequired,
				section_number: PropTypes.string.isRequired,
			})
		).isRequired,
	}).isRequired,
}

const TicketTable = ({ticketOrders}) => {
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(5);
	const [filters, setFilters] = useState({
		status: null
	});

	const statusOptions = [
		{
			id: 'all',
			name: 'All'
		},
		{
			id: 'passed',
			name: 'Passed'
		},
		{
			id: 'pending',
			name: 'Pending'
		},
		{
			id: 'canceled',
			name: 'Canceled'
		},
	];

	const handleStatusChange = (e) => {
		let value = null;

		if (e.target.value !== 'all') {
			value = e.target.value;
		}

		setFilters((prevFilters) => ({
			...prevFilters,
			status: value
		}));
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filteredTicketOrders = applyFilters(ticketOrders, filters);
	const paginatedTicketOrders = applyPagination(
		filteredTicketOrders,
		page,
		limit
	);

	return (
		<Card>
			<CardHeader
				action={
					<Box width={150}>
						<FormControl fullWidth variant="outlined">
							<InputLabel>Status</InputLabel>
							<Select
								value={filters.status || 'all'}
								onChange={handleStatusChange}
								label="Status"
								autoWidth
							>
								{statusOptions.map((statusOption) => (
									<MenuItem key={statusOption.id} value={statusOption.id}>
										{statusOption.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				}
				title="Recent Tickets"
			/>
			<Divider/>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell/>
							<TableCell>TICKET NAME</TableCell>
							<TableCell>TIME</TableCell>
							<TableCell align="right">AMOUNT</TableCell>
							<TableCell align="right">TOTAL PRICE($)</TableCell>
							<TableCell align="right">STATUS</TableCell>
							<TableCell align="right">ACTIONS</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedTicketOrders.map((ticketOrder) => (
							<TicketRow ticketRow={ticketOrder}/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Box p={2}>
				<TablePagination
					component="div"
					count={filteredTicketOrders.length}
					onPageChange={handlePageChange}
					onRowsPerPageChange={handleLimitChange}
					page={page}
					rowsPerPage={limit}
					rowsPerPageOptions={[5, 10, 25, 30]}
				/>
			</Box>
		</Card>
	);
};

export default TicketTable;
