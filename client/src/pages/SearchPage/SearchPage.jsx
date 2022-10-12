import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import EventCard from '../../components/EventCard/EventCard';
import NavBar from '../../components/Navbar/NavBar';
import './SearchPage.css';
const SearchPage = () => {
  return (
    <>
      <div>
        <NavBar search={1} />
        <Sidebar />
        <div className="events">
          <EventCard id={1} />
          <EventCard id={2} />
          <EventCard id={3} />
          <EventCard id={4} />
          <EventCard id={5} />
          <EventCard id={6} />
        </div>
      </div>
    </>
  );
};

export default SearchPage;
