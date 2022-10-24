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

import DetailsTwoToneIcon from '@mui/icons-material/DetailsTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import {Label} from "./Label";

const getStatusLabel = (ticketOrderStatus) => {
	const map = {
		passed: {
			text: 'Passed',
			color: 'success'
		},
		pending: {
			text: 'Pending',
			color: 'warning'
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

const TicketRow = (props) => {
	const {row} = props;

}

const TicketTable = ({ticketOrders}) => {
	const [open, setOpen] = useState(false)
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
			{/*)}*/}
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
						{paginatedTicketOrders.map((ticketOrder) => {
							return (
								<>
									<TableRow hover key={ticketOrder.id}>
										<TableCell>
											<IconButton aria-label={'expend row'} size={"small"} onClick={() => setOpen(!open)}>
												{open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
											</IconButton>
										</TableCell>
										<TableCell>
											<Typography variant="body1" fontWeight="bold" color='#223354' gutterBottom noWrap>
												{ticketOrder.ticket_name}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="body1" fontWeight="bold" color='#223354' gutterBottom noWrap>
												{ticketOrder.start_dt}
											</Typography>
											<Typography variant="body1" fontWeight="bold" color='#223354' gutterBottom noWrap>
												{ticketOrder.end_dt}
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography variant="body1" fontWeight="bold" color='#223354' gutterBottom noWrap>
												{ticketOrder.amount}
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography variant="body1" fontWeight="bold" color='#223354' gutterBottom noWrap>
												{ticketOrder.price}
											</Typography>
										</TableCell>
										<TableCell align="right">
											{getStatusLabel(ticketOrder.status)}
										</TableCell>
										<TableCell align="right">
											<Tooltip title="Event Detail" arrow>
												<IconButton
													sx={{
														'&:hover': {
															background: alpha('#5569ff', 0.1)
														},
														color: '#5569ff'
													}}
													color="inherit"
													size="small"
												>
													<DetailsTwoToneIcon fontSize="small"/>
												</IconButton>
											</Tooltip>
											<Tooltip title="Delete Tickets" arrow>
												<IconButton
													sx={{
														'&:hover': {background: alpha('#FF1943', 0.1)},
														color: '#FF1943'
													}}
													color="inherit"
													size="small"
												>
													<DeleteTwoToneIcon fontSize="small"/>
												</IconButton>
											</Tooltip>
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
															{ticketOrder.detail.map((order) => (
																<TableRow>
																	<TableCell>
																		<Typography variant="body1" fontWeight="bold" color gutterBottom noWrap>
																			{order.title}
																		</Typography>
																	</TableCell>
																	<TableCell>{order.category}</TableCell>
																	<TableCell>{order.address}</TableCell>
																	<TableCell align={"right"}>{order.postcode}</TableCell>
																	<TableCell align={"right"}>{order.seat_number}</TableCell>
																	<TableCell align={"right"}>{order.section_number}</TableCell>
																</TableRow>
															))}
														</TableBody>
													</Table>
												</Box>
											</Collapse>
										</TableCell>
									</TableRow>
								</>
							);
						})}
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
