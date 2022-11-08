import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import EventList from '../EventList/EventList';
import usePagination from './usePagination';
import Pagination from '@mui/material/Pagination';
import { axiosInstance } from '../../config';
// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EventListDraft from '../EventList/EventListDraft';

const Events = () => {
  const { currentUser } = useSelector((state) => state.user);
  // const navigate = useNavigate();
  const [re, rerender] = useState(false);
  const [events1, setEvents1] = useState([]);

  const [events2, setEvents2] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchData() {
      let res = await axiosInstance.get('/event/unpublished');
      setEvents2(res.data.filter((e) => e.host_id === currentUser._id));
      res = await axiosInstance.get('/event/published');
      setEvents1(res.data.filter((e) => e.host_id === currentUser._id));
    }
    fetchData();
  }, [currentUser._id, re]);

  // const events2 = [10, 11, 12, 13, 14, 15,16,17];
  const [pages, setPage] = useState([1, 1]);
  const PER_PAGE = 7;

  const handleData1 = usePagination(events1, PER_PAGE);
  const count1 = Math.ceil(events1?.length / PER_PAGE);

  const handleData2 = usePagination(events2, PER_PAGE);
  const count2 = Math.ceil(events2?.length / PER_PAGE);

  const handlePageChange1 = (e, p) => {
    setPage([p, pages[1]]);
    handleData2.jump(p);
    // window.scrollTo({ top: 0 });
  };

  const handlePageChange2 = (e, p) => {
    setPage([pages[0], p]);
    handleData1.jump(p);
    // window.scrollTo({ top: 0 });
  };
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const yourCallback = () => {
  //   axiosInstance.get("/event").then((res) => console.log(res));
  // };

  // useEffect(yourCallback, []);

  return (
    <>
      <h1>Events</h1>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Published Events" value="1" />
            <Tab label="Draft Events" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div>
            <div style={{ minHeight: '60vh' }}>
              {handleData1.currentData().map((e) => (
                <EventList key={e._id} eventInfo={e} />
              ))}
            </div>
            <Pagination count={count1} page={pages[0]} onChange={handlePageChange1} shape="rounded" />
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div>
            <div style={{ minHeight: '60vh' }}>
              {handleData2.currentData().map((e) => (
                <EventListDraft key={e._id} eventInfo={e} re={re} rerender={rerender} />
              ))}
            </div>
            <Pagination count={count2} page={pages[1]} onChange={handlePageChange2} shape="rounded" />
          </div>
        </TabPanel>
      </TabContext>
    </>
  );
};

export default Events;
