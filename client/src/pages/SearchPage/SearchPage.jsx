import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import EventCard from '../../components/EventCard/EventCard';
import NavBar from '../../components/Navbar/NavBar';
import './SearchPage.css'
const SearchPage = () => {
  return (
    <>
      <div>
        <NavBar search={1}/>
        <Sidebar />
        <div className='events'>
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        </div>
        
      </div>

    </>
  );
};

export default SearchPage;
