import React from 'react';
import Button from '@mui/material/Button';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import NavBar from '../../components/Navbar/NavBar';
import Gallery from '../../components/Gallery/Gallery';
import Comments from '../../components/Comment/Comments';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { axiosInstance } from "../../config";
import { convertFromRaw } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import './EventDetail.css';
import moment from 'moment';
const EventDetail = (props) => {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [eventInfo,setEventInfo] = React.useState({});
  const [price,setPrice] = React.useState('');
  React.useEffect(() => {
    async function fetchData() {
      let res = await axiosInstance.get("/event/"+ params.id);
      setEventInfo(res.data);
      res = await axiosInstance.get("/ticket/e/"+params.id);
      setPrice(Math.min(...(res.data.map(e=>e.price))));
    }
    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="event-detail">
        <div className="img-container">
          <img src={eventInfo.image_url } alt="Thumbnail image"/>
        </div>
        <div className="info">
          <div className="event-info">
            <h1>{eventInfo.title}</h1>
            <div>
              <h3>Host: {eventInfo.host_name}</h3>
              <Button variant="outlined" className="follow">
                follow
              </Button>
            </div>

            <h3>
              Category: {eventInfo.category}
            </h3>
          </div>
          <div className="ticket-info">
            <div className="ticket-box">
              <span>Tickets starting at</span>
              <span>{price!='Infinity'?'$ ' +price:''}</span>
              <Button variant="contained" className="buy">
                Buy tickets
              </Button>
            </div>
          </div>
        </div>
        <div className="highlight-container">
          <h2>Event Information</h2>
          <div className="highlight">
            <div className="item">
              <AccessTimeOutlinedIcon fontSize="large" />
              <div className="item-content">
                <span>Date and time</span>
                <div>{moment(eventInfo.start_dt).format('MM/DD/YYYY h:mm a')} -</div>
                <div>{moment(eventInfo.end_dt).format('MM/DD/YYYY h:mm a')} </div>
              </div>
            </div>
            <div className="item">
              <LocationOnOutlinedIcon fontSize="large" />
              <div className="item-content">
                <span>Location</span>
                <span>{eventInfo.address}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="highlight-container">
          <h2>Description</h2>
          <p dangerouslySetInnerHTML={{__html: eventInfo.details?stateToHTML(convertFromRaw(JSON.parse(eventInfo.details))):""}}>
          </p>
        </div>
        <div className="gallery" >
        <h2>Gallery</h2>  
        {eventInfo.gallery?<Gallery galleryImages={eventInfo.gallery}></Gallery>:''}
        </div>
      </div>
      <div className="comments-section">
        <Comments eventId="0" />
      </div>
    </>
  );
};

export default EventDetail;
