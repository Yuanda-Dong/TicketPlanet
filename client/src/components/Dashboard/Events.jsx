import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import EventList from '../EventList/EventList';
import usePagination from './usePagination';
import Pagination from '@mui/material/Pagination';
const Events = () => {
  const events = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const events2 = [10, 11, 12, 13, 14, 15];
  const [page, setPage] = React.useState(1);
  const PER_PAGE = 7;
  const count = Math.ceil(events?.length / PER_PAGE);
  const handleData = usePagination(events, PER_PAGE);

  const handleData2 = usePagination(events2, PER_PAGE);
  const count2 = Math.ceil(events2?.length / PER_PAGE);

  const handlePageChange = (e, p) => {
    setPage(p);
    handleData.jump(p);
    // window.scrollTo({ top: 0 });
  };
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <h1>Events</h1>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Draft Events" value="1" />
            <Tab label="Published Events" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div>
            <div style={{ minHeight: '60vh' }}>
              {handleData.currentData().map((e) => (
                <EventList key={e} id={e} />
              ))}
            </div>
            <Pagination count={count} page={page} onChange={handlePageChange} shape="rounded" />
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div>
            <div style={{ minHeight: '60vh' }}>
              {handleData2.currentData().map((e) => (
                <EventList key={e} id={e} published={true} />
              ))}
            </div>
            <Pagination count={count2} page={page} onChange={handlePageChange} shape="rounded" />
          </div>
        </TabPanel>
      </TabContext>
    </>
  );
};

export default Events;
