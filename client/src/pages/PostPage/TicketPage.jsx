import React, { useState } from 'react';
import NavBar from '../../components/Navbar/NavBar';
import TextField from '@mui/material/TextField';
import './PostPage.css';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { axiosInstance } from '../../config';
import Modal from '@mui/material/Modal';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Divider from '@mui/material/Divider';

const TicketPage = () => {
  const { token } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const params = useParams();
  const eventID = params.id;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [ticket, setTicket] = useState({ t: { price: '', quantity: '', name: '' }, tickets: [] });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const removeTicket = (event, idx) => {
    const newTickets = [...ticket.tickets];
    newTickets.splice(idx, 1);
    setTicket({ ...ticket, tickets: newTickets });
  };

  const setName = (event) => {
    const newT = { ...ticket.t };
    newT.name = event.target.value;
    setTicket({ ...ticket, t: newT });
  };
  const setPrice = (event) => {
    const newT = { ...ticket.t };
    newT.price = event.target.value;
    setTicket({ ...ticket, t: newT });
  };
  const setQuantity = (event) => {
    const newT = { ...ticket.t };
    newT.quantity = event.target.value;
    setTicket({ ...ticket, t: newT });
  };
  const cancel = () => {
    const newT = { price: '', quantity: '', name: '' };
    setTicket({ ...ticket, t: newT });
    setOpen(false);
  };
  const add = () => {
    const newTickets = ticket.tickets;

    if (ticket.t.name === '') {
      alert('Ticket must have a name');
      return;
    }
    if (ticket.t.price === '') {
      alert('Ticket must have a price');
      return;
    }

    if (!(!isNaN(ticket.t.price) && Number(ticket.t.price) > 0)) {
      alert('Ticket must have a valid price');
      return;
    }
    if (ticket.t.quantity === '') {
      alert('Ticket must have a quantity');
      return;
    }
    const num = Number(ticket.t.quantity);
    if (!(Number.isInteger(num) && num > 0)) {
      alert('Ticket must have a valid quantity');
      return;
    }

    newTickets.push(ticket.t);
    setTicket({ ...ticket, tickets: newTickets });

    cancel();
    setOpen(false);
  };

  const goHome = () => {
    navigate('/dashboard/events');
  };
  const goNext = () => {
    navigate('/tickets/seat_map', { state: { tickets: createdTickets } });
  };

  const [confirm, setConfirm] = useState(false);

  const [createdTickets, setCreatedTickets] = useState([]);
  const fin = async () => {
    for (let i = 0; i < ticket.tickets.length; i++) {
      try {
        const tik = ticket.tickets[i];
        let res = await axiosInstance.post(
          `/ticket/e/${eventID}`,
          { ticket_name: tik.name, price: tik.price, availability: tik.quantity },
          config
        );
        setCreatedTickets((prev) => [...prev, res.data]);
      } catch (err) {
        console.log(err);
      }
    }
    setConfirm(true);
  };

  return (
    <div className="PostPage">
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ mb: 0, minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          {/* TICKETs */}
          <Grid item xs={12}>
            <h3> Tickets</h3>
          </Grid>
          <Grid item xs={12}>
            <div>
              {ticket.tickets.map((e, idx) => (
                <Card key={idx} sx={{ minWidth: 250 }}>
                  <CardContent>
                    <Grid container spacing={1} direction="row" justifyContent="space-between" alignItems="flex-end">
                      <Grid item xs={9}>
                        <Typography gutterBottom variant="h5" component="div">
                          {e.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: ${e.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available quantity: {e.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Button
                          variant="outlined"
                          component="label"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={(event) => removeTicket(event, idx)}
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Button fullWidth variant="outlined" onClick={handleOpen}>
                Add Tickets
              </Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        Add Tickets
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="standard-basic"
                        label="Name: "
                        variant="standard"
                        value={ticket.t.name}
                        margin="normal"
                        onChange={setName}
                      />
                      <TextField
                        fullWidth
                        id="standard-basic"
                        label="Price: "
                        variant="standard"
                        value={ticket.t.price}
                        margin="normal"
                        onChange={setPrice}
                      />
                      <TextField
                        fullWidth
                        id="standard-basic"
                        label="Quantity: "
                        variant="standard"
                        value={ticket.t.quantity}
                        margin="normal"
                        onChange={setQuantity}
                      />
                    </Grid>
                    <Grid item xs={10} mt={1}>
                      <Button variant="contained" color="error" onClick={cancel}>
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={2} mt={1}>
                      <Button variant="contained" onClick={add}>
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Modal>
            </div>
          </Grid>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', margin: '50px 0px' }}>
            <Button sx={{ mt: '20px' }} variant="outlined" onClick={goHome}>
              Cancel
            </Button>

            <Button sx={{ mt: '20px' }} variant="contained" onClick={fin}>
              Save & Next
            </Button>
          </div>
          <Divider />

          {confirm && (
            <>
              <Typography align="center" sx={{ mt: '20px' }} id="modal-modal-title" variant="h6" component="h2">
                Do you need to create your own seat plan?
              </Typography>

              <Typography align="center" sx={{ mt: '20px' }} id="modal-modal-title">
                If so, click the "Create Seat Plan" button below, otherwise, submit and publish your event using
                "Publish" button.
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', margin: '50px 0px' }}>
                <Button sx={{ mt: '20px' }} variant="outlined" onClick={goNext}>
                  Create Seat Plan
                </Button>

                <Button sx={{ mt: '20px' }} variant="contained">
                  Publish
                </Button>
              </div>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default TicketPage;
