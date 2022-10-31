import React, { useState } from "react";
import { Button, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState({ fuzzy: "", start_dt: null, end_dt: null });
  return (
    <div className="header">
      <h1 className="title">Fabulous Event Booking Platform!</h1>
      <div className="search_container">
        <div className="search_box">
          <TextField
            className="search"
            value={value.fuzzy}
            placeholder="Search by events, name, location and more"
            type="text"
            onChange={(newValue) => {
              setValue({ ...value, fuzzy: newValue.target.value });
            }}
          />
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div className="search_box">
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
          </LocalizationProvider>
          <Button
            startIcon={<SearchIcon />}
            variant="contained"
            className="search_button"
            onClick={() => navigate("/search",{state:value})}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
