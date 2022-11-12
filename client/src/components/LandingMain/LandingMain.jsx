import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import EventCard from '../EventCard/EventCard';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../config';
import './LandingMain.css';

export default function LandingMain() {
  const [value, setValue] = React.useState('1');
  const { currentUser } = useSelector((state) => state.user);
  const [recValue, setRecValue] = React.useState('1');
  const handleChange2 = (event, newValue) => {
    setRecValue(newValue);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [events, setEvents] = useState([]);
  const [recEvents, setRecEvents] = useState([]);
  const loadRec = async (num) => {
    let res = await axiosInstance.get(`/user/${currentUser._id}/rec${num}`);
    setRecEvents(res.data);
  };
  useEffect(() => {
    async function fetchData() {
      let res = await axiosInstance.get('/event/upcoming?pageSize=12&pageNum=0');
      setEvents(res.data);
    }
    fetchData();
  }, []);

  return (
    <Box className="landing_main_container">
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList className="list" onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Upcoming Events" value="1" />
            {currentUser && <Tab label="For You Based on " value="2" onClick={() => loadRec(1)} />}
          </TabList>
        </Box>
        <TabPanel value="1" className="upcoming_event">
          <div className="events-container">
            {events.map((e) => (
              <EventCard key={e._id} eventInfo={e} />
            ))}
          </div>

          <Link
            style={{ textDecoration: 'none' }}
            className="link"
            to={'/search'}
            state={{ fuzzy: '', start_dt: null, end_dt: null }}
          >
            <Button variant="contained" className="loadmore">
              Load More
            </Button>
          </Link>
        </TabPanel>
        <TabPanel value="2">
          <TabContext value={recValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  orientation="vertical"
                  className="list"
                  onChange={handleChange2}
                  aria-label="lab API tabs example"
                  sx={{ width: '200px' }}
                >
                  <Tab label="Past event types" value="1" onClick={() => loadRec(1)} />
                  <Tab label="Past booked hosts" value="2" onClick={() => loadRec(2)} />
                  <Tab label="Event description" value="3" onClick={() => loadRec(3)} />
                  <Tab label="Demographic info" value="4" onClick={() => loadRec(4)} />
                </TabList>
              </Box>
              <TabPanel value="1">
                <div className="events-container">
                  {recEvents.map((e) => (
                    <EventCard key={e._id} eventInfo={e} />
                  ))}
                </div>
              </TabPanel>
              <TabPanel value="2">
                <div className="events-container">
                  {recEvents.map((e) => (
                    <EventCard key={e._id} eventInfo={e} />
                  ))}
                </div>
              </TabPanel>
              <TabPanel value="3">
                <div className="events-container">
                  {recEvents.map((e) => (
                    <EventCard key={e._id} eventInfo={e} />
                  ))}
                </div>
              </TabPanel>
              <TabPanel value="4">
                <div className="events-container">
                  {recEvents.map((e) => (
                    <EventCard key={e._id} eventInfo={e} />
                  ))}
                </div>
              </TabPanel>
            </Box>
          </TabContext>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
