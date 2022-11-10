import { Card } from '@mui/material';
import TicketTable from './TicketTable';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../../config.js';
import { useSelector } from 'react-redux';

const TicketOrders = () => {
  const { token } = useSelector((state) => state.user);
  const [allInfo, setAllInfo] = useState({});
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getMyTickets = async () => {
    let res = await axiosInstance.get('/booking/me', config);
    return res.data;
  };
  const getTicketDetail = async (ticketIds) => {
    const responses = await Promise.all(ticketIds.map((id) => axiosInstance.get(`/ticket/${id}`)));
    return responses.map(({ data }) => data);
    // setAllInfo((prev) => ({ ...prev, ticketDetails: data }));
  };
  const getEvents = async (eventIds) => {
    const responses = await Promise.all(eventIds.map((id) => axiosInstance.get(`/event/${id}`)));
    return responses.map(({ data }) => data);
    // setAllInfo((prev) => ({ ...prev, eventDetails: data }));
  };

  // #########################################################

  const [Tickets, setTickets] = useState();

  // const Tickets = [
  //   {
  //     id: '1',
  //     event_id: '45e78767-2e25-4188-bd9e-dd3dbd935dac',
  //     ticket_name: 't1',
  //     start_dt: '2022-10-11T12:55',
  //     end_dt: '2022-11-11T03:55',
  //     price: 100,
  //     amount: 1,
  //     status: 'passed',
  //     detail: [
  //       {
  //         title: 'Movie Night',
  //         category: 'movie',
  //         address: '123 Sea-seme Street',
  //         postcode: 1111,
  //         seat_number: '6-6',
  //         section_number: 'Section B',
  //       },
  //     ],
  //   },
  //   {
  //     id: '2',
  //     event_id: '966d5fb2-5fd0-46d1-941b-4ad2e4d72385',
  //     ticket_name: 't2',
  //     start_dt: '2022-10-11T12:55',
  //     end_dt: '2022-11-11T03:55',
  //     price: 100,
  //     amount: 1,
  //     status: 'pending',
  //     detail: [
  //       {
  //         title: 'Movie Night',
  //         category: 'movie',
  //         address: '123 Sea-seme Street',
  //         postcode: 2222,
  //         seat_number: '5-5',
  //         section_number: '',
  //       },
  //     ],
  //   },
  //   {
  //     id: '3',
  //     event_id: '2',
  //     ticket_name: 't3',
  //     start_dt: '2022-10-11T12:55',
  //     end_dt: '2022-11-11T03:55',
  //     price: 200,
  //     amount: 2,
  //     status: 'pending',
  //     detail: [
  //       {
  //         title: 'Movie Night',
  //         category: 'movie',
  //         address: '123 Sea-seme Street',
  //         postcode: 1000,
  //         seat_number: '2-1',
  //         section_number: 'Section 1',
  //       },
  //     ],
  //   },
  //   {
  //     id: '4',
  //     event_id: '3',
  //     ticket_name: 't4',
  //     start_dt: '2022-10-11T12:55',
  //     end_dt: '2022-11-11T03:55',
  //     price: 200,
  //     amount: 2,
  //     status: 'canceled',
  //     detail: [
  //       {
  //         title: 'Movie Night',
  //         category: 'movie',
  //         address: '123 Sea-seme Street',
  //         postcode: 1000,
  //         seat_number: '2-1',
  //         section_number: 'Section 1',
  //       },
  //     ],
  //   },
  //   {
  //     id: '5',
  //     event_id: '45e78767-2e25-4188-bd9e-dd3dbd935dac',
  //     ticket_name: 't5',
  //     start_dt: '2022-10-11T12:55',
  //     end_dt: '2022-11-11T03:55',
  //     price: 100,
  //     amount: 1,
  //     status: 'passed',
  //     detail: [
  //       {
  //         title: 'Movie Night',
  //         category: 'movie',
  //         address: '123 Sea-seme Street',
  //         postcode: 1111,
  //         seat_number: '6-6',
  //         section_number: 'Section B',
  //       },
  //     ],
  //   },
  //   {
  //     id: '6',
  //     event_id: 'cb7f08b0-51a1-44dd-aecf-c8001b0d8a4c',
  //     ticket_name: 't6',
  //     start_dt: '2022-10-11T12:55',
  //     end_dt: '2022-11-11T03:55',
  //     price: 75,
  //     amount: 1,
  //     status: 'canceled',
  //     detail: [
  //       {
  //         title: 'Event with tickets',
  //         category: 'Art',
  //         address: '123 Sea-seme Street',
  //         postcode: 1111,
  //         seat_number: '6-6',
  //         section_number: 'Section B',
  //       },
  //     ],
  //   },
  // ];

  const combineInfo = (seatInfo, ticketInfo, eventInfo) => {
    const { _id, status, seat, event_id, ...otherSeatInfo } = seatInfo;
    const { ticket_name, price, ...otherTicketInfo } = ticketInfo;
    const { title, category, address, postcode, start_dt, end_dt, ...otherEventInfo } = eventInfo;
    return {
      id: _id,
      event_id,
      ticket_name,
      start_dt,
      end_dt,
      price,
      amount: 1,
      status,
      title,
      category,
      address,
      postcode,
      seat_number: seat,
    };
  };

  useEffect(() => {
    const getAllData = async () => {
      const seats = await getMyTickets();
      const tickets = await getTicketDetail(seats.map(({ base_id }) => base_id));
      const events = await getEvents(seats.map(({ event_id }) => event_id));
      return [seats, tickets, events];
    };
    getAllData().then(([seats, tickets, events]) =>
      setTickets(seats.map((seatInfo, idx) => combineInfo(seatInfo, tickets[idx], events[idx])))
    );
  }, []);

  return <Card>{Tickets && <TicketTable ticketOrders={Tickets} />}</Card>;
};

export default TicketOrders;
