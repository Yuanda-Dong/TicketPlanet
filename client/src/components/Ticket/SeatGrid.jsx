import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../config';
import styled from 'styled-components';

const SeatSelection = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 3rem;
  /* border: 1px solid darkblue;
  padding: 10px 20px; */
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-self: flex-end;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Row = styled.div`
  display: flex;
  width: min-content;
  /* overflow: scroll; */
  overflow: visible;
  height: min-content;
`;
const Seat = styled.div`
  width: 55px;
  height: 55px;
  line-height: 55px;
  text-align: center;
  visibility: ${(props) => props.active || 'hidden'};
  background-color: ${(props) => (props.selected ? '#76ff03' : props.available ? props.theme.color : 'darkgray')};
  border-radius: 15px;
  margin: 5px;
  /* :hover {
    background-color: ${(props) => props.selected || '#a09e9e'};
  } */
  pointer-events: ${(props) => props.available || 'none'};
  cursor: pointer;
`;

const SeatMapContainer = styled.div`
  margin: 20px auto;
  max-height: 1200px;
  overflow: scroll;
`;

const SeatGrid = ({ eventId, tickets, quantities, selected, setSelected }) => {
  //   const seats = [
  //     [
  //       { type_id: '123', availability: 10, active: false },
  //       { type_id: '123', availability: 10, active: true },
  //       { type_id: '123', availability: 10, active: true },
  //       { type_id: '123', availability: 10, active: false },
  //     ],
  //     [
  //       { type_id: '321', availability: 10, active: true },
  //       { type_id: '321', availability: 10, active: true },
  //       { type_id: '321', availability: 10, active: true },
  //       { type_id: '321', availability: 10, active: true },
  //     ],
  //   ];
  //   const tickets = [
  //     { _id: '123', ticket_name: 'Delux', availability: 5 },
  //     { _id: '321', ticket_name: 'Premium', availability: 20 },
  //   ];

  const [seats, setSeats] = useState([]);
  const [seatCount, setSeatCount] = useState(quantities);

  useEffect(() => {
    async function fetch() {
      let res = await axiosInstance.get('event/seats/' + eventId);
      setSeats(res.data.seats);
    }
    fetch();
  }, []);

  //   #################################################################

  const colors = ['#702626', '#28502a', '#263470', '#9d823f', '#7c3282'];
  const ticketType = tickets.map((t, idx) => ({ ...t, color: colors[idx] }));

  useEffect(() => {
    setSelected([]);
    setSeatCount(quantities);
  }, [quantities]);

  const handleSelect = (e) => {
    const coord = [parseInt(e.target.dataset.row), parseInt(e.target.dataset.col)];
    const selectedType = e.target.dataset.type;
    if (seatCount.id === selectedType) {
      if (selected.some((i) => i.toString() === coord.toString())) {
        setSelected((prev) => prev.filter((i) => i.toString() !== coord.toString()));
        let count = seatCount.quantity;
        setSeatCount((prev) => ({ ...prev, quantity: count + 1 }));
      } else if (seatCount.quantity > 0) {
        setSelected([...selected, coord]);
        let count = seatCount.quantity;
        setSeatCount((prev) => ({ ...prev, quantity: count - 1 }));
      }
    }
  };

  return (
    seats.length > 0 && (
      <SeatSelection>
        <h2>Select Your Seats</h2>
        <Legend>
          {ticketType.map((type, idx) => (
            <LegendItem key={idx}>
              {`${type.ticket_name}`} <Seat active={true} theme={type} available={true} />
            </LegendItem>
          ))}

          <LegendItem>
            Taken
            <Seat active={true} available={false} />
          </LegendItem>
        </Legend>
        <SeatMapContainer>
          {seats.map((row, rowId) => (
            <Row key={rowId}>
              {row.map((seat, colId) => (
                <Seat
                  key={colId}
                  data-row={rowId}
                  data-col={colId}
                  onClick={handleSelect}
                  active={seat.active}
                  data-type={seat.type_id}
                  selected={selected.some((i) => i.toString() === [rowId, colId].toString())}
                  theme={ticketType.find((e) => e._id === seat.type_id)}
                  available={true}
                />
              ))}
            </Row>
          ))}
        </SeatMapContainer>
      </SeatSelection>
    )
  );
};

export default SeatGrid;
