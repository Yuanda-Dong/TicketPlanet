import React, { useState } from 'react';
import { Button, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';

import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  return (
    <div className="header">
      <h1 className="title">Fabulous Event Booking Platform!</h1>
      <div className="search_container">
        <div className="search_box">
          <TextField
            className="search"
            value={searchValue}
            placeholder="Search by events, name, location and more"
            type="text"
            onChange={(newValue) => {
              setSearchValue(newValue.target.value);
            }}
          />
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div className="search_box">
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

          {/* <div className="search_box">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="search"
              value={value.start_dt}
              onChange={(newValue) => {
                setValue({ ...value, start_dt: newValue });
              }}
              renderInput={(params) => (
                <TextField className="search_date" {...params} />
              )}
            />
          </LocalizationProvider>
          <span>To</span>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="search"
              value={value.end_dt}
              onChange={(newValue) => {
                setValue({ ...value, end_dt: newValue });
              }}
              renderInput={(params) => (
                <TextField className="search_date" {...params} />
              )}
            />
          </LocalizationProvider> */}
          <Button
            startIcon={<SearchIcon />}
            variant="contained"
            className="search_button"
            onClick={() =>
              navigate('/search', {
                state: { fuzzy: searchValue, start_dt: date[0].startDate, end_dt: date[0].endDate },
              })
            }
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
