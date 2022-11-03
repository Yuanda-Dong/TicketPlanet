import React, { useState, useEffect, useRef } from 'react';
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

function useOutsideAlerter(ref, setOpenDate) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenDate(false);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

const Search = ({ value, setValue, handleSubmit }) => {
  const wrapperRef = useRef(null);
  const [openDate, setOpenDate] = useState(false);
  useOutsideAlerter(wrapperRef, setOpenDate);

  const [date, setDate] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  ]);

  useEffect(() => {
    setValue({ ...value, start_dt: date[0].startDate, end_dt: date[0].endDate });
  }, [date]);

  return (
    <div className="search_bar_container">
      <div className="search_box">
        <input
          className="search"
          value={value.fuzzy}
          placeholder="Search by events, name, location and more"
          type="text"
          onChange={(e) => setValue({ ...value, fuzzy: e.target.value })}
        />
      </div>
      <Divider orientation="vertical" variant="middle" flexItem />
      <div className="search_box">
        <span
          className="search_date_text"
          onClick={() => {
            setOpenDate(true);
          }}
        >
          {`${date[0].startDate ? format(date[0].startDate, 'dd/MM/yyyy') : 'Start'} to ${
            date[0].startDate ? format(date[0].endDate, 'dd/MM/yyyy') : 'End'
          }`}
        </span>
        {openDate && (
          <div ref={wrapperRef} className="date_picker">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDate([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={date}
            />
          </div>
        )}

        <Button startIcon={<SearchIcon />} variant="contained" className="search_button" onClick={handleSubmit}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default Search;
