import {Card} from "@mui/material";
import TicketTable from "./TicketTable";
import {useState} from "react";

const TicketOrders = () => {

	const [Ticket, setTicket] = useState({
		id: '1',
		event_id: '1',
		ticket_name: 't1',
		start_dt: '2022-10-11T12:55',
		end_dt: '2022-11-11T03:55',
		price: 100,
		amount: 1,
		status: 'passed',
		detail: [{
			title: 'Movie Night',
			category: 'movie',
			address: '123 Sea-seme Street',
			postcode: 1111,
			seat_number: 1,
			section_number: 1,
		}],
	});

	const Tickets = [{
		id: '1',
		event_id: '34636e42-62a5-474d-986d-4ec5e92897cd',
		ticket_name: 't1',
		start_dt: '2022-10-11T12:55',
		end_dt: '2022-11-11T03:55',
		price: 100,
		amount: 1,
		status: 'passed',
		detail: [{
			title: 'Movie Night',
			category: 'movie',
			address: '123 Sea-seme Street',
			postcode: 1111,
			seat_number: 1,
			section_number: 1,
		}],
	},
		{
			id: '2',
			event_id: '2',
			ticket_name: 't2',
			start_dt: '2022-10-11T12:55',
			end_dt: '2022-11-11T03:55',
			price: 100,
			amount: 1,
			status: 'pending',
			detail: [{
				title: 'Movie Night',
				category: 'movie',
				address: '123 Sea-seme Street',
				postcode: 2222,
				seat_number: 2,
				section_number: 1,
			}],
		}]

	return (
		<Card>
			<TicketTable ticketOrders={Tickets}/>
		</Card>
	);
}

export default TicketOrders