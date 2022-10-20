import React, { useState } from 'react';
import { Button, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState({ from: null, to: null });
  return (
    <div className="header">
      <h1 className="title">Fabulous Event Booking Platform!</h1>
      <div className="search_container">
        <div className="search_box">
          <input className="search" placeholder="Search by events, name, location and more" type="text" />
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div className="search_box">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="search"
              value={value.from}
              onChange={(newValue) => {
                setValue({ ...value, from: newValue });
              }}
              renderInput={(params) => <TextField className="search_date" {...params} />}
            />
          </LocalizationProvider>
          <span>To</span>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="search"
              value={value.to}
              onChange={(newValue) => {
                setValue({ ...value, to: newValue });
              }}
              renderInput={(params) => <TextField className="search_date" {...params} />}
            />
          </LocalizationProvider>
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
    </div>
  );
};

export default Header;
