import React, {useEffect, useState} from 'react';
import EventCard from '../../components/EventCard/EventCard';
import './SearchPage.css';
import {useLocation} from 'react-router-dom';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import NavBar from '../../components/Navbar/NavBar';
import {useSelector} from 'react-redux';
import {Divider} from '@mui/material';
import Search from '../../components/SearchBar/SearchBar';
import {axiosInstance} from '../../config';

const SearchPage = () => {
  const {currentUser} = useSelector((state) => state.user);
  const [checkBox, setCheckBox] = useState([false, false, false]);

  const [events, setEvents] = useState([]);

  const {state} = useLocation();
  const [value, setValue] = useState({
    distance: 20,
    price: 20,
    category: ['Movies'],
    user_postcode: currentUser ? currentUser.postcode : null,
    fuzzy: state?.fuzzy,
    start_dt: state?.start_dt,
    end_dt: state?.end_dt,
  });

  const cat = (label) => {
    let copy = value.category;
    if (copy.includes(label)) {
      copy = copy.filter((item) => item !== label);
    } else {
      copy.push(label);
    }
    setValue({ ...value, category: copy });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchData() {
      let res = await axiosInstance.post('/event/search', state);
      window.history.replaceState({}, document.title)
      setEvents(res.data);
    }
    fetchData();
  }, []);

  async function search() {
    let newObject = { ...value };
    if (checkBox[0] == false) {
      const { distance, ...newObject0 } = newObject;
      newObject = { ...newObject0 };
    }
    if (checkBox[1] == false) {
      const { category, ...newObject0 } = newObject;
      newObject = { ...newObject0 };
    }
    if (checkBox[2] == false) {
      const { price, ...newObject0 } = newObject;
      newObject = { ...newObject0 };
    }
    // console.log(newObject);
    let res = await axiosInstance.post('/event/search', newObject);
    setEvents(res.data);
  }

  /// SIDEBAR STUFF
  const marks1 = [
    {
      value: 20,
      label: '<20km',
    },
    {
      value: 50,
      label: '<50km',
    },
    {
      value: 100,
      label: '>100km',
    },
  ];
  const marks2 = [
    {
      value: 20,
      label: '<$20',
    },
    {
      value: 50,
      label: '<$50',
    },
    {
      value: 100,
      label: '>$100',
    },
  ];
  /// SIDEBAR

  return (
    <>
      <div>
        <NavBar />
        <div className="search_main">
          <div className="sidebar">
            <h2>Filters</h2>
            <Divider variant="middle" />
            <h4>
              Distance{' '}
              <Checkbox
                checked={checkBox[0]}
                onChange={(event) => {
                  setCheckBox([event.target.checked, checkBox[1], checkBox[2]]);
                }}
              />{' '}
            </h4>
            <Box sx={{ width: 180 }}>
              <Slider
                defaultValue={20}
                step={10}
                valueLabelDisplay="auto"
                marks={marks1}
                onChange={(event) => {
                  setValue({ ...value, distance: event.target.value });
                }}
              />
            </Box>
            <Divider variant="middle" />
            <h4>
              Categories{' '}
              <Checkbox
                checked={checkBox[1]}
                onChange={(event) => {
                  setCheckBox([checkBox[0], event.target.checked, checkBox[2]]);
                }}
              />
            </h4>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked/>} label="Movies" onChange={(_) => cat('Movies')}/>
              <FormControlLabel control={<Checkbox/>} label="Concert" onChange={(_) => cat('Concert')}/>
              <FormControlLabel control={<Checkbox/>} label="Arts" onChange={(_) => cat('Arts')}/>
              <FormControlLabel control={<Checkbox/>} label="Conference" onChange={(_) => cat('Conference')}/>
              <FormControlLabel control={<Checkbox/>} label="Food & Drink" onChange={(_) => cat('Food & Drink')}/>
              <FormControlLabel control={<Checkbox/>} label="Festivals" onChange={(_) => cat('Festivals')}/>
              <FormControlLabel control={<Checkbox/>} label="Markets" onChange={(_) => cat('Markets')}/>
              <FormControlLabel control={<Checkbox/>} label="Sports" onChange={(_) => cat('Sports')}/>
              <FormControlLabel control={<Checkbox/>} label="Classes & Workshops"
                                onChange={(_) => cat('Classes & Workshops')}/>
              <FormControlLabel control={<Checkbox/>} label="Other" onChange={(_) => cat('Other')}/>
            </FormGroup>
            <Divider variant="middle"/>
            <h4>
              Price{' '}
              <Checkbox
                checked={checkBox[2]}
                onChange={(event) => {
                  setCheckBox([checkBox[0], checkBox[1], event.target.checked]);
                }}
              />
            </h4>
            <Box sx={{ width: 180 }}>
              <Slider
                defaultValue={20}
                step={10}
                valueLabelDisplay="auto"
                marks={marks2}
                onChange={(event) => {
                  setValue({ ...value, price: event.target.value });
                }}
              />
            </Box>
          </div>
          <div className="right_main">
            <Search value={value} setValue={setValue} handleSubmit={search} />
            <div className="Events">
              {events.map((e) => (
                <EventCard eventInfo={e} key={e._id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
