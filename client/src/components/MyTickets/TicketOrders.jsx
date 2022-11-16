import { Card } from '@mui/material';
import TicketTable from './TicketTable';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../config.js';
import { useSelector } from 'react-redux';
import MyTicketSkeleton from './MyTicketSkeleton';

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
    // return [...new Set(res)];
    // setAllInfo((prev) => ({ ...prev, eventDetails: data }));
  };

  // #########################################################

  const [Tickets, setTickets] = useState();

  const combineInfo = (eventInfo, tickets, seats) => {
    const matching_seats = seats.filter((seat) => seat.event_id === eventInfo._id);
    const { _id, title, category, address, postcode, start_dt, end_dt, ...otherEventInfo } = eventInfo;

    let details = matching_seats.map((seatInfo) => {
      const { _id, status, seat, payment_intent, ...otherSeatInfo } = seatInfo;
      const ticketInfo = tickets.find((ticket) => ticket._id === seatInfo.base_id);
      const { ticket_name, price, ...otherTicketInfo } = ticketInfo;
      return {
        id: _id,
        ticket_name,
        price,
        status,
        seat_number: seat,
        payment_intent: payment_intent,
      };
    });

    return {
      event_id: _id,
      title,
      category,
      start_dt,
      end_dt,
      address,
      postcode,
      amount: details.length,
      details,
    };
  };

  useEffect(() => {
    const getAllData = async () => {
      const seats = await getMyTickets();
      const ticketIds = seats.map(({ base_id }) => base_id);
      const tickets = await getTicketDetail([...new Set(ticketIds)]);
      const eventIds = seats.map(({ event_id }) => event_id);
      const events = await getEvents([...new Set(eventIds)]);
      return [seats, tickets, events];
    };
    getAllData().then(([seats, tickets, events]) => {
      setTickets(events.map((event) => combineInfo(event, tickets, seats)));
    });
  }, []);

  return <Card> {Tickets ? <TicketTable ticketOrders={Tickets} /> : <MyTicketSkeleton />}</Card>;
};

export default TicketOrders;
