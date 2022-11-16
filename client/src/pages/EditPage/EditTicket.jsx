import React from 'react';
import NavBar from '../../components/Navbar/NavBar';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
import { axiosInstance } from '../../config';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const NormalButton = styled(Button)`
  && {
    background-color: #4f4cee;
  }
`;

const OutlinedButton = styled(Button)`
  && {
    color: #4f4cee;
    border-color: #4f4cee;
  }
`;

const EditTicket = () => {
  const params = useParams();
  const eventId = params.id;
  const [ticket, setTicket] = React.useState({ t: { price: '', availability: '', ticket_name: '' }, tickets: [] });
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
    newT.ticket_name = event.target.value;
    setTicket({ ...ticket, t: newT });
  };
  const setPrice = (event) => {
    const newT = { ...ticket.t };
    newT.price = event.target.value;
    setTicket({ ...ticket, t: newT });
  };
  const setQuantity = (event) => {
    const newT = { ...ticket.t };
    newT.availability = event.target.value;
    setTicket({ ...ticket, t: newT });
  };
  const cancel = () => {
    const newT = { price: '', availability: '', ticket_name: '' };
    setTicket({ ...ticket, t: newT });
    setOpen(false);
  };

  const add = () => {
    const newTickets = ticket.tickets;

    if (ticket.t.ticket_name === '') {
      alert('Ticket must have a name');
      return;
    }
    if (ticket.t.price === '') {
      alert('Ticket must have a price');
      return;
    }

    if (!(!isNaN(ticket.t.price) && Number(ticket.t.price) >= 0)) {
      alert('Ticket must have a valid price');
      return;
    }
    if (ticket.t.availability === '') {
      alert('Ticket must have a quantity');
      return;
    }
    const num = Number(ticket.t.availability);
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

  React.useEffect(() => {
    async function fetchData() {
      let res = await axiosInstance.get('/ticket/e/' + eventId);
      setTicket((prev) => ({ ...prev, tickets: res.data }));
    }
    fetchData();
  }, []);

  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const goNext = (updatedTickets) => {
    // console.log(updatedTickets);
    navigate(`/edit/seat_map/${eventId}`, { state: { tickets: updatedTickets } });
  };

  const handleTicketUpdate = async () => {
    let res = await axiosInstance.get('/ticket/e/' + eventId);
    await Promise.all(res.data.map((t) => axiosInstance.delete('/ticket/' + t._id, config)));
    // for (const t in res.data) {
    //   await axiosInstance.delete('/ticket/' + res.data[t]._id, config);
    // }
    let update_res = await Promise.all(
      ticket.tickets.map((t) =>
        axiosInstance.post(
          '/ticket/e/' + eventId,
          {
            ticket_name: t.ticket_name,
            price: t.price,
            availability: t.availability,
          },
          config
        )
      )
    );
    goNext(update_res.map(({ data }) => data));
  };

  return (
    <div className="PostPage">
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ mb: 0, minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Grid item xs={12}>
            <h3> Tickets</h3>
            <div>
              {ticket.tickets.map((e, idx) => (
                <Card key={idx} sx={{ minWidth: 250 }}>
                  <CardContent>
                    <Grid container spacing={1} direction="row" justifyContent="space-between" alignItems="flex-end">
                      <Grid item xs={9}>
                        <Typography gutterBottom variant="h5" component="div">
                          {e.ticket_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: ${e.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available quantity: {e.availability}
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
              <OutlinedButton fullWidth variant="outlined" onClick={handleOpen}>
                Add Tickets
              </OutlinedButton>
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
                        value={ticket.t.ticket_name}
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
                        value={ticket.t.availability}
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
                      <NormalButton variant="contained" onClick={add}>
                        Add
                      </NormalButton>
                    </Grid>
                  </Grid>
                </Box>
              </Modal>
            </div>
          </Grid>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', margin: '50px 0px' }}>
            <OutlinedButton sx={{ mt: '20px' }} variant="outlined" onClick={goHome}>
              Save & Exit
            </OutlinedButton>
            <NormalButton sx={{ mt: '20px' }} variant="contained" onClick={handleTicketUpdate}>
              Save & Next
            </NormalButton>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default EditTicket;
