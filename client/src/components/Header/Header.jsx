import React, { useState } from 'react';

import Search from '../SearchBar/SearchBar';

import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState({ fuzzy: '', start_dt: null, end_dt: null });

  function jump_to_search() {
    navigate('/search', {
      state: searchValue,
    });
  }

  return (
    <div className="header">
      <h1 className="title">Exclusive events, priceless moments!</h1>
      <div className="header_search">
        <Search value={searchValue} setValue={setSearchValue} handleSubmit={jump_to_search} />
      </div>
    </div>
  );
};

export default Header;
