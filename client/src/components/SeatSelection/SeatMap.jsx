import React, { useState, useEffect } from 'react';
import { ButtonGroup, Button } from '@mui/material';
import styled from 'styled-components';
// import { ThemeProvider } from 'styled-components';

const Row = styled.div`
  display: flex;
`;
const Seat = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${(props) => (props.selected ? props.theme.color : '#c0acac')};
  margin: 5px;
  :hover {
    background-color: ${(props) => (props.selected ? props.theme.hover : '#a78f8f')};
  }
  pointer-events: ${(props) => props.disabled && 'none'};
`;

const SeatMap = () => {
  // props
  const dim = [5, 10];
  const ticketType = [
    {
      name: 'Ticket 1',
      color: '#702626',
      hover: '#5c3838',
    },
    {
      name: 'Ticket 2',
      color: '#26702b',
      hover: '#385c44',
    },
    {
      name: 'Ticket 3',
      color: '#263470',
      hover: '#383f5c',
    },
  ];

  let rowId = -1;
  const [mapGrid, setMapGrid] = useState(
    Array.from(Array(dim[0])).map((row) => {
      rowId += 1;
      let colId = -1;
      return Array.from(Array(dim[1])).map((cell) => ({ rowId, colId: ++colId, type: '', selected: false }));
    })
  );

  const [currentType, setCurrentType] = useState('');

  const handleSelect = (e) => {
    // console.log(e.target.getAttribute('data-row'));
    // console.log(currentType);
    // console.log(ticketType.find((e) => e.name == currentType));

    const temp = [...mapGrid];
    const clicked = temp[e.target.dataset.row][e.target.dataset.col];
    clicked.selected = !clicked.selected;
    clicked.type = currentType;
    temp[e.target.dataset.row][e.target.dataset.col] = clicked;
    setMapGrid(temp);
  };

  useEffect(() => {
    console.log(mapGrid);
  }, [mapGrid]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <ButtonGroup>
        {ticketType.map((type, idx) => (
          <Button
            key={idx}
            value={type.name}
            onClick={(e) => {
              setCurrentType(e.target.value);
            }}
          >
            {type.name}
          </Button>
        ))}
      </ButtonGroup>

      {mapGrid.map((row, idx) => (
        <Row key={idx}>
          {row.map((seat, idx) => (
            <Seat
              key={idx}
              disabled={currentType === ''}
              data-row={seat.rowId}
              data-col={seat.colId}
              onClick={handleSelect}
              selected={seat.selected}
              type={seat.type}
              theme={ticketType.find((e) => e.name === seat.type)}
            />
          ))}
        </Row>
      ))}
    </div>
  );
};

export default SeatMap;
