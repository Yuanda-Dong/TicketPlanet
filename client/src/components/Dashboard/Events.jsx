import React from 'react';
import EventList from '../EventList/EventList';
import usePagination from './usePagination';
import Pagination from '@mui/material/Pagination';
import styled from 'styled-components';
const Events = () => {
  const events = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [page, setPage] = React.useState(1);
  const PER_PAGE = 7;
  const count = Math.ceil(events?.length / PER_PAGE);
  const handleData = usePagination(events, PER_PAGE);

  const handlePageChange = (e, p) => {
    setPage(p);
    handleData.jump(p);
    // window.scrollTo({ top: 0 });
  };

  return (
    <>
      <h1>Events</h1>
      <div style={{ height: '60vh' }}>
        {handleData.currentData().map((e) => (
          // <EventCard key={e} />
          <EventList key={e} />
        ))}
      </div>
      <Pagination count={count} page={page} onChange={handlePageChange} shape="rounded" />
    </>
  );
};

export default Events;
