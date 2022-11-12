import React from 'react';
import Button from '@mui/material/Button';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import NavBar from '../../components/Navbar/NavBar';
import Gallery from '../../components/Gallery/Gallery';
import Comments from '../../components/Comment/Comments';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { axiosInstance } from '../../config';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import './EventDetail.css';
import moment from 'moment';
import { Container } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { thumbnail } from '../../assets/dummy_img';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const EventDetail = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.user);
  const [eventInfo, setEventInfo] = React.useState({});
  const [price, setPrice] = React.useState('');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  React.useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchData() {
      try {
        let res = await axiosInstance.get('/event/' + params.id);
        setEventInfo(res.data);
        res = await axiosInstance.get('/ticket/e/' + params.id);
        setPrice(Math.min(...res.data.map((e) => e.price)));
      } catch {
        navigate('/404NotFound');
      }
    }

    fetchData();
  }, [params.id]);

  const follow = async ()=> {
    try {
      console.log(eventInfo.host_id)
      let res = await axiosInstance.put(`/user/follow/${eventInfo.host_id}`,null, config);
      // console.log(eventInfo)
      handleClickOpen();
    } catch {
      alert("You can not follow yourself");
    }
  }

  return (
    <div className={'EventPage'}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Follow"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You have successfully followed the host, you will receive e-mails when the host publishes a new event. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} >Close</Button>
          {/* <Button onClick={handleClose} autoFocus>
            Agree
          </Button> */}
        </DialogActions>
      </Dialog>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ mb: 0 }}>
        <Paper elevation={3} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <div className="event-detail">
            <div className="img-container">
              <img src={eventInfo.image_url || thumbnail} alt="Event Thumbnail" />
            </div>
            <div className="info">
              <div className="event-info">
                <h1>{eventInfo.title}</h1>
                <div>
                  <h3>Host: {eventInfo.host_name}</h3>
                  {currentUser ? <Button variant="outlined" className="follow" onClick={follow}>
                    follow
                  </Button>:<></>}
                </div>
                <h3>Category: {eventInfo.category}</h3>
              </div>
              <div className="ticket-info">
                <div className="ticket-box">
                  <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Tickets starting at</span>
                  <span style={{ fontSize: '30px' }}>{price !== Infinity ? '$ ' + price : 'Not available'}</span>
                  <Link style={{ textDecoration: 'none' }} to={currentUser ? `/event/price/${params.id}` : '/signin'}>
                  {price !== Infinity ? <Button variant="contained" className="buy">
                      Buy tickets
                    </Button> : <></>}
                    
                  </Link>
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
                    <div>
                      <span>Location: </span>
                      <span>{eventInfo.address}</span>
                    </div>
                    <div>
                      <span>Postcode: </span>
                      <span>{eventInfo.postcode}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="highlight-container">
              <h2>Description</h2>
              <p
                dangerouslySetInnerHTML={{
                  __html: eventInfo.details ? stateToHTML(convertFromRaw(JSON.parse(eventInfo.details))) : '',
                }}
              ></p>
            </div>
            

            { eventInfo.gallery && eventInfo.gallery.length >0 ? <div className="gallery">
              <h2>Gallery</h2>
              <Gallery galleryImages={eventInfo.gallery}></Gallery>
            </div> : <></>}

            




          </div>
          {eventInfo.published ? (
            <div className="comments-section">
              <Comments eventId={params.id} />
            </div>
          ) : (
            <></>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default EventDetail;
