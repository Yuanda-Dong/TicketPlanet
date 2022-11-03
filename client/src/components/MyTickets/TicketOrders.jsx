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
		event_id: '45e78767-2e25-4188-bd9e-dd3dbd935dac',
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
			seat_number: '6-6',
			section_number: 'Section B',
		}],
	},
		{
			id: '2',
			event_id: '966d5fb2-5fd0-46d1-941b-4ad2e4d72385',
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
				seat_number: '5-5',
				section_number: '',
			}],
		},
		{
			id: '3',
			event_id: '2',
			ticket_name: 't3',
			start_dt: '2022-10-11T12:55',
			end_dt: '2022-11-11T03:55',
			price: 200,
			amount: 2,
			status: 'pending',
			detail: [{
				title: 'Movie Night',
				category: 'movie',
				address: '123 Sea-seme Street',
				postcode: 1000,
				seat_number: '2-1',
				section_number: 'Section 1',
			}],
		},
		{
			id: '4',
			event_id: '3',
			ticket_name: 't4',
			start_dt: '2022-10-11T12:55',
			end_dt: '2022-11-11T03:55',
			price: 200,
			amount: 2,
			status: 'canceled',
			detail: [{
				title: 'Movie Night',
				category: 'movie',
				address: '123 Sea-seme Street',
				postcode: 1000,
				seat_number: '2-1',
				section_number: 'Section 1',
			}],
		},
		{
			id: '5',
			event_id: '45e78767-2e25-4188-bd9e-dd3dbd935dac',
			ticket_name: 't5',
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
				seat_number: '6-6',
				section_number: 'Section B',
			}],
		},
		{
			id: '6',
			event_id: 'cb7f08b0-51a1-44dd-aecf-c8001b0d8a4c',
			ticket_name: 't6',
			start_dt: '2022-10-11T12:55',
			end_dt: '2022-11-11T03:55',
			price: 75,
			amount: 1,
			status: 'canceled',
			detail: [{
				title: 'Event with tickets',
				category: 'Art',
				address: '123 Sea-seme Street',
				postcode: 1111,
				seat_number: '6-6',
				section_number: 'Section B',
			}],
		}]

	return (
		<Card>
			<TicketTable ticketOrders={Tickets}/>
		</Card>
	);
}

export default TicketOrders