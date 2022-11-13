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
    // return [...new Set(res)];
    // setAllInfo((prev) => ({ ...prev, eventDetails: data }));
  };

  // #########################################################

  const [Tickets, setTickets] = useState();

  // const combineInfo = (seatInfo, ticketInfo, eventInfo) => {
  //   const { _id, status, seat, event_id, ...otherSeatInfo } = seatInfo;
  //   const { ticket_name, price, ...otherTicketInfo } = ticketInfo;
  //   const { title, category, address, postcode, start_dt, end_dt, ...otherEventInfo } = eventInfo;
  //   return {
  //     id: _id,
  //     event_id,
  //     ticket_name,
  //     start_dt,
  //     end_dt,
  //     price,
  //     amount: 1,
  //     status,
  //     title,
  //     category,
  //     address,
  //     postcode,
  //     seat_number: seat,
  //   };
  // };

  const combineInfo = (eventInfo, tickets, seats) => {
    const matching_seats = seats.filter((seat) => seat.event_id === eventInfo._id);
    const { _id, title, category, address, postcode, start_dt, end_dt, ...otherEventInfo } = eventInfo;

    let details = matching_seats.map((seatInfo) => {
      const { _id, status, seat, ...otherSeatInfo } = seatInfo;
      const ticketInfo = tickets.find((ticket) => ticket._id === seatInfo.base_id);
      const { ticket_name, price, ...otherTicketInfo } = ticketInfo;
      return {
        id: _id,
        ticket_name,
        price,
        status,
        seat_number: seat,
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
      // console.log(seats, events);
      // setTickets(seats.map((seatInfo, idx) => combineInfo(seatInfo, tickets[idx], events[idx])));
      setTickets(events.map((event, idx) => combineInfo(event, tickets, seats)));
    });
  }, []);

  console.log(Tickets);

  return <Card> {Tickets && <TicketTable ticketOrders={Tickets} />}</Card>;
};

export default TicketOrders;
