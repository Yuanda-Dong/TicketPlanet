import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, FormControlLabel } from '@mui/material';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import styled from 'styled-components';
// import { ThemeProvider } from 'styled-components';
import { axiosInstance } from '../../config.js';

const Header = styled.div`
  margin: 50px 0px;
`;

const Notice = styled.div`
  margin-left: 30px;
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
  background-color: ${(props) => (props.selected ? props.theme.color : '#b3b3b3')};
  margin: 5px;
  :hover {
    background-color: ${(props) => props.selected || '#a09e9e'};
  }
  pointer-events: ${(props) => props.disabled && 'none'};
  cursor: pointer;
`;

const Dimension = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SeatMapContainer = styled.div`
  margin: 20px auto;
  max-height: 1200px;
  overflow: scroll;
`;

const SeatMap = ({ tickets }) => {
  const [currentType, setCurrentType] = useState('');
  const [dimension, setDimension] = useState({ width: 3, height: 3 });
  // props

  const colors = ['#702626', '#28502a', '#263470', '#9d823f', '#7c3282'];

  const ticketType = tickets.map((t, idx) => ({ ...t, color: colors[idx] }));

  function getDefaultMap() {
    const defaultMap = Array.from(Array(dimension.height || 1)).map((row) => {
      return Array.from(Array(dimension.width || 1)).map((cell) => ({
        type_id: '',
        active: false,
      }));
    });
    return defaultMap;
  }
  function defaultCount() {
    let state = {};
    for (let ticket of tickets) {
      state[ticket._id] = ticket.availability;
    }
    return state;
  }

  const [mapGrid, setMapGrid] = useState(getDefaultMap());
  const [seatCount, setSeatCount] = useState(defaultCount());

  const handleSelect = (e) => {
    const coord = [parseInt(e.target.dataset.row), parseInt(e.target.dataset.col)];
    if (quickSelect.mode) {
      if (!quickSelect.topLeft) {
        setQuickSelect((prev) => ({
          ...prev,
          topLeft: coord,
        }));
        const temp = [...mapGrid];
        handleSelectUpdate(temp, coord[0], coord[1]);
        setMapGrid(temp);
      } else if (!quickSelect.bottomRight) {
        setQuickSelect((prev) => ({
          ...prev,
          bottomRight: coord,
        }));
        const temp = [...mapGrid];
        handleSelectUpdate(temp, coord[0], coord[1]);
        setMapGrid(temp);
      }
    } else {
      const temp = [...mapGrid];
      handleSelectUpdate(temp, coord[0], coord[1]);
      setMapGrid(temp);
    }
  };

  const handleSelectUpdate = (temp, row, col) => {
    const clicked = temp[row][col];
    if (!clicked.active && seatCount[currentType] > 0) {
      clicked.active = true;
      clicked.type_id = currentType;
      temp[row][col] = clicked;
      seatCount[currentType] -= 1;
    } else if (clicked.active) {
      clicked.active = false;
      clicked.type_id = null;
      temp[row][col] = clicked;
      seatCount[currentType] += 1;
    }
  };

  const changeDimension = (e) => {
    setDimension((prev) => ({ ...prev, [e.target.name]: Math.max(1, parseInt(e.target.value)) }));
  };

  const [quickSelect, setQuickSelect] = useState({ mode: false, topLeft: null, bottomRight: null });

  useEffect(() => {
    setMapGrid(getDefaultMap());
    setSeatCount(defaultCount());
  }, [dimension]);

  const handleKetdown = (keydownE) => {
    if (keydownE.code === 'Enter') {
      const temp = [...mapGrid];
      for (let row = quickSelect.topLeft[0]; row <= quickSelect.bottomRight[0]; row++) {
        for (let col = quickSelect.topLeft[1]; col <= quickSelect.bottomRight[1]; col++) {
          if (
            !(row === quickSelect.topLeft[0] && col === quickSelect.topLeft[1]) &&
            !(row === quickSelect.bottomRight[0] && col === quickSelect.bottomRight[1])
          ) {
            handleSelectUpdate(temp, row, col);
          }
        }
      }
      setMapGrid(temp);
      setQuickSelect((prev) => ({ ...prev, topLeft: null, bottomRight: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(mapGrid);
    try {
      const res = await axiosInstance.post(`/event/seats/${tickets[0].event_id}`, { seats: mapGrid });
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (quickSelect.topLeft && quickSelect.bottomRight) {
      window.addEventListener('keydown', handleKetdown);
    }
    return () => {
      window.removeEventListener('keydown', handleKetdown);
    };
  }, [quickSelect]);

  return (
    <div style={{ marginLeft: '20px' }}>
      {/* <Header>
        <h2>Generate your own seat map</h2>
        <Notice>
          <p>
            <b>Don't need a seat map for your event?</b>
          </p>
          <p>Skip this step and navigate to the bottom to finish the event ticket creation</p>
        </Notice>
      </Header> */}
      <h3>1. Start with a customised seat map dimension</h3>
      <Dimension>
        <TextField
          label="Width"
          variant="outlined"
          type="number"
          name="width"
          value={dimension.width}
          onChange={changeDimension}
        />
        <span>X</span>
        <TextField
          label="Height"
          variant="outlined"
          type="number"
          name="height"
          value={dimension.height}
          onChange={changeDimension}
        />
      </Dimension>

      <h3>2. Choose a ticket type with which the seats are associated </h3>
      <ToggleButtonGroup
        value={currentType}
        exclusive
        onChange={(e, newVal) => {
          setCurrentType(newVal);
        }}
      >
        {ticketType.map((type, idx) => (
          <ToggleButton key={idx} value={type._id}>
            {type.ticket_name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <h3>3. Creat your own seat maps </h3>
      <FormControlLabel
        control={
          <Checkbox
            checked={quickSelect.mode}
            onChange={(e) => {
              setQuickSelect((prev) => ({ mode: e.target.checked, topLeft: null, bottomRight: null }));
            }}
          />
        }
        label="Check the box to enter the Quick Selection Mode"
      />
      <p>Instructions on Quick Selection:</p>
      <ol>
        <li>
          Select a first seat to be the <b>top-left</b> seat of your desired rectangular map
        </li>
        <li>
          Select a second seat to be the <b>bottom-right</b> seat of your desired rectangular map
        </li>
        <li>
          Hit <b>Enter</b> to generate the rectangular seat map
        </li>
        <li>
          Uncheck the box to return to <b>Single Selection mode</b>, and fine-tune your seat map in this mode
        </li>
      </ol>
      <SeatMapContainer>
        {mapGrid.map((row, rowId) => (
          <Row key={rowId}>
            {row.map((seat, colId) => (
              <Seat
                key={colId}
                disabled={currentType === ''}
                data-row={rowId}
                data-col={colId}
                onClick={handleSelect}
                selected={seat.active}
                type={seat.type_id}
                theme={ticketType.find((e) => e._id === seat.type_id)}
              >
                {`${rowId + 1}-${colId + 1}`}
              </Seat>
            ))}
          </Row>
        ))}
      </SeatMapContainer>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '50px 0px' }}>
        <Button variant="contained" onClick={handleSubmit}>
          Upload My Seat Map
        </Button>
      </div>
    </div>
  );
};

export default SeatMap;
