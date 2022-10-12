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
        <EventCard id = {0}/>
        <EventCard id = {0}/>
        <EventCard id = {0}/>
        <EventCard id = {0}/>
        <EventCard id = {0}/>
        <EventCard id = {0}/>
        </div>
        
      </div>

    </>
  );
};

export default SearchPage;
