import React from 'react';
import './Widget.css';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Widget = ({ setCurrentEvent }) => {
  return (
    <div className="widget">
      <div className="left">
        <span className="title">Followers</span>
        <span className="counter">120</span>
        <span
          onClick={() => {
            setCurrentEvent(null);
          }}
          className="link"
        >
          View Reports
        </span>
      </div>
      <div className="right">
        <div className="percentage">
          <KeyboardArrowUpIcon />
          23%
        </div>
      </div>
    </div>
  );
};

export default Widget;
