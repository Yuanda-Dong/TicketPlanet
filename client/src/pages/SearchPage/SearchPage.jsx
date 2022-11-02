import React, {useEffect, useState} from "react";
import EventCard from "../../components/EventCard/EventCard";
import "./SearchPage.css";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import {useSelector} from 'react-redux';
import {Button, Divider} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import UserMenu from '../../components/Navbar/UserMenu';
import {axiosInstance} from '../../config';

const SearchPage = () => {
  const {currentUser} = useSelector((state) => state.user);
  const [checkBox, setCheckBox] = useState([false, false, false]);

  const [value, setValue] = useState({
    distance: 20,
    price: 20,
    category: ["Movies"],
    user_postcode: currentUser ? currentUser.postcode : null
  });

  const [events, setEvents] = useState([]);

  // const { keyword, from,to } = useLocation();
  const { state } = useLocation();

  const cat = (label) => {
    let copy = value.category;
    if (copy.includes(label)){
      copy = copy.filter(item => item !== label);
    }else{
      copy.push(label);
    }
    setValue({...value,category:copy})
  }

  useEffect(() => {
  async function fetchData() {
    if (state) {
      setValue({...state, ...value});
    }
    let res = await axiosInstance.post('/event/search', state);
    setEvents(res.data);
  }
  fetchData();
  }, []);

  async function search() {
    let newObject = {...value};
    if (checkBox[0] == false){
      const { distance, ...newObject0 } = newObject;
      newObject = {...newObject0};
    }
    if (checkBox[1] == false){
      const { category, ...newObject0 } = newObject;
      newObject = {...newObject0};
    }
    if (checkBox[2] == false){
      const { price, ...newObject0 } = newObject;
      newObject = {...newObject0};
    }
    // console.log(newObject);
    let res = await axiosInstance.post('/event/search', newObject);
    setEvents(res.data);
  }


  /// SIDEBAR STUFF
  const marks1 = [
    {
      value: 20,
      label: "<20km",
    },
    {
      value: 50,
      label: "<50km",
    },
    {
      value: 100,
      label: ">100km",
    },
  ];
  const marks2 = [
    {
      value: 20,
      label: "<$20",
    },
    {
      value: 50,
      label: "<$50",
    },
    {
      value: 100,
      label: ">$100",
    },
  ];
  /// SIDEBAR

  /// NAVBAR STUFF
  const navigate = useNavigate();
  const pages = ['Products', 'Pricing', 'Blog'];
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  /// NAVBAR

  return (
    <>
      <div>
        <div className="app_bar">
          <div className="wrapper">
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                // onClick={dashboard ? onDrawerToggle : handleOpenNavMenu}
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Link className="link" to="/">
              <Typography className="logo">LOGO</Typography>
            </Link>

            <div className="search_container">
              <div className="search_box">
                <input
                  className="search"
                  placeholder="Search by events, name, location and more"
                  type="text"
                  value = {value.fuzzy}
                  onChange={(newValue) => {
                    setValue({ ...value, fuzzy: newValue.target.value });
                  }}
                />
              </div>
              <Divider orientation="vertical" variant="middle" flexItem />
              <div className="search_box">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="search"
                    value={value.start_dt}
                    onChange={(newValue) => {
                      setValue({ ...value, start_dt: newValue });
                    }}
                    renderInput={(params) => (
                      <TextField className="search_date" {...params} />
                    )}
                  />
                </LocalizationProvider>
                <span style={{ color: "black" }}>To</span>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="search"
                    value={value.end_dt}
                    onChange={(newValue) => {
                      setValue({ ...value, end_dt: newValue });
                    }}
                    renderInput={(params) => (
                      <TextField className="search_date" {...params} />
                    )}
                  />
                </LocalizationProvider>

                <Button
                  startIcon={<SearchIcon />}
                  variant="contained"
                  className="search_button"
                  onClick={search}
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="button_group">
              <Link className="link" to={currentUser ? "/post" : "/signup"}>
                <Button variant="outlined" className="create-event">
                  Create Event
                </Button>
              </Link>

              {currentUser ? (
                <UserMenu />
              ) : (
                <>
                  <Link className="link" to={"/signin"}>
                    <Button variant="outlined" className="login">
                      Log in
                    </Button>
                  </Link>
                  <Link className="link" to={"/signup"}>
                    <Button variant="contained" className="signup">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="sidebar">
          <h2>Filters</h2>
          <Divider variant="middle" />
          <h4>
            Distance <Checkbox checked={checkBox[0]} onChange= {(event)=>{setCheckBox([event.target.checked,checkBox[1],checkBox[2]])}}/>{" "}
          </h4>
          <Box sx={{ width: 180 }}>
            <Slider
              defaultValue={20}
              step={10}
              valueLabelDisplay="auto"
              marks={marks1}
              onChange={(event)=>{setValue({...value,distance:event.target.value})}}
            />
          </Box>
          <Divider variant="middle" />
          <h4>
            Categories <Checkbox checked={checkBox[1]} onChange= {(event)=>{setCheckBox([checkBox[0],event.target.checked,checkBox[2]])}}/>
          </h4>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Movies"
              onChange={(_)=> cat("Movies")}
            />
            <FormControlLabel control={<Checkbox />} label="Concert" onChange={(_)=> cat("Concert")}/>
            <FormControlLabel control={<Checkbox />} label="Arts" onChange={(_)=> cat("Arts")}/>
            <FormControlLabel control={<Checkbox />} label="Conference" onChange={(_)=> cat("Conference")}/>
            <FormControlLabel control={<Checkbox />} label="Other" onChange={(_)=> cat("Other")}/>
          </FormGroup>
          <Divider variant="middle" />
          <h4>
            Price <Checkbox checked={checkBox[2]} onChange= {(event)=>{setCheckBox([checkBox[0],checkBox[1],event.target.checked])}}/>
          </h4>
          <Box sx={{width: 180}}>
            <Slider
              defaultValue={20}
              step={10}
              valueLabelDisplay="auto"
              marks={marks2}
              onChange={(event) => {
                setValue({...value, price: event.target.value})
              }}
            />
          </Box>
        </div>
        <div className="Events">
          {
            events.map((e) => (<EventCard eventInfo={e} key={e._id}/>))
          }
        </div> 
      </div>
    </>
  );
};

export default SearchPage;
