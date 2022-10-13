import React from "react";
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import './Sidebar.css';
const marks1 = [
    {
      value: 20,
      label: '<20km',
    },
    {
      value: 50,
      label: '<50km',
    },
    {
      value: 100,
      label: '>100km',
    },
  ];

  const marks2 = [
    {
      value: 20,
      label: '<$20',
    },
    {
      value: 50,
      label: '<$50',
    },
    {
      value: 100,
      label: '>$100',
    },
  ];

const Sidebar = () => {
    return (
      <div className="sidebar">
          <h2>Filters</h2>
        <Divider variant="middle" />
          <h4>Distance </h4>
        <Box sx={{ width: 180 }}>
        <Slider
            defaultValue={20}
            step={10}
            valueLabelDisplay="auto"
            marks={marks1}
        />
        </Box>
        <Divider variant="middle" />
          <h4>Categories</h4>
        <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Movies" />
        <FormControlLabel control={<Checkbox />} label="Concert" />
        <FormControlLabel control={<Checkbox />} label="Arts" />
        <FormControlLabel control={<Checkbox />} label="Conference" />
        <FormControlLabel control={<Checkbox />} label="Other" />
        </FormGroup>
        <Divider variant="middle" />
          <h4>Price </h4>
        <Box sx={{ width: 180 }}>
        <Slider
            defaultValue={20}
            step={10}
            valueLabelDisplay="auto"
            marks={marks2}
        />
        </Box>
      </div>
      
    );
  };

export default Sidebar;
  