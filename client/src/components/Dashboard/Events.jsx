import React from 'react';
import EventCard from '../EventCard/EventCard';
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

  const Container = styled.div`
    /* display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 15px; */
    display: flex;
    flex-wrap: wrap;
  `;

  return (
    <>
      <h1>Events</h1>
      <Container>
        {handleData.currentData().map((e) => (
          <EventCard key={e} host={true} />
        ))}
      </Container>
      <Pagination count={count} page={page} onChange={handlePageChange} shape="rounded" />
    </>
  );
};

export default Events;
