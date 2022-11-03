import React, { useState } from 'react';
import { Button, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import './SearchBar.css';

const Search = () => {
  const navigate = useNavigate();
  // const [value, setValue] = useState({ from: null, to: null });
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  return (
    <div className="search_container">
      <div className="search_box">
        <input className="search" placeholder="Search by events, name, location and more" type="text" />
      </div>
      <Divider orientation="vertical" variant="middle" flexItem />
      <div className="search_box">
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="search"
            value={value.from}
            onChange={(newValue) => {
              setValue({ ...value, from: newValue });
            }}
            renderInput={(params) => <TextField className="search_date" {...params} />}
          />
        </LocalizationProvider>
        <span style={{ color: 'black' }}>To</span>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="search"
            value={value.to}
            onChange={(newValue) => {
              setValue({ ...value, to: newValue });
            }}
            renderInput={(params) => <TextField className="search_date" {...params} />}
          />
        </LocalizationProvider> */}
        <span
          className="search_date_text"
          onClick={() => {
            setOpenDate((prev) => !prev);
          }}
        >
          {`${format(date[0].startDate, 'dd/MM/yyyy')} to ${format(date[0].endDate, 'dd/MM/yyyy')}`}
        </span>
        {openDate && (
          <DateRange
            className="date_picker"
            editableDateInputs={true}
            onChange={(item) => setDate([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={date}
          />
        )}

        <Button
          startIcon={<SearchIcon />}
          variant="contained"
          className="search_button"
          onClick={() => navigate('/search')}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default Search;
