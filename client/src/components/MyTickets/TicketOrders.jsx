import { Card } from '@mui/material';
import TicketTable from './TicketTable';
import { useEffect, useState } from 'react';
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
    getAllData().then(([seats, tickets, events]) => {
      console.log(seats, tickets, events);
      setTickets(seats.map((seatInfo, idx) => combineInfo(seatInfo, tickets[idx], events[idx])));
    });
  }, []);

  return <Card>{Tickets && <TicketTable ticketOrders={Tickets} />}</Card>;
};

export default TicketOrders;
