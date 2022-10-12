import React, { useState } from 'react';
import NavBar from '../../components/Navbar/NavBar';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './EditPage.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { EditorState,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const EditPage = () => {
  const storage = getStorage();

  const [value, setValue] = useState({ from: "10/21/2022 07:30 PM", to: "10/22/2022 12:00 AM" });
  const [cat, setcat] = React.useState('Arts');
  const [thumb, setThumb] = React.useState('https://firebasestorage.googleapis.com/v0/b/project-4177137297351481009.appspot.com/o/1665598559012f1e7b3e32143cd904a6528ce9f0d9ef80d01734e6b497e2a6aaf613b7b6dcdf6-rimg-w1200-h1200-gmir.webp?alt=media&token=c31f1bf2-b8f5-4835-b135-e585181eeeb9');
  const [gallery, setGallery] = React.useState([]);
  const [tickets, setTickets] = React.useState([{ price: 38.01, quantity: 100, name: "General Admission" }]);
  const [progress, setProgress] = React.useState({ thumbnail: 100, gallery: 100 });
  const [t, setT] = React.useState({ price: null, quantity: null, name: null });
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

  const handleChange = (event) => {
    setcat(event.target.value);
  };

  const handleMedia = (event) => {
    setThumb(event.target.value);
  };

  const handleGallery = (event, idx) => {
    const newGallery = [...gallery];
    newGallery[idx] = event.target.value;
    setGallery(newGallery);
  };

  const deleteFile = (filepath) => {
    // Create a reference to the file to delete
    const desertRef = ref(storage, filepath);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        console.log('file deleted from firebase');
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };
  const uploadFile = (file, type) => {
    const filename = new Date().getTime() + file.name;
    console.log(filename);
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        console.log('Upload is ' + progress + '% done');
        console.log(progress);
        setProgress((prev) => ({ ...prev, [type]: progress }));

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          type === 'thumbnail' ? setThumb(downloadURL) : setGallery((gallery) => [...gallery, downloadURL]);
        });
      }
    );
  };

  const handleClick = (event, idx) => {
    const newGallery = [...gallery];
    const removed = newGallery.splice(idx, 1);
    setGallery(newGallery);
    console.log(removed);
    deleteFile(removed);
  };

  const removeTicket = (event, idx) => {
    const newTickets = [...tickets];
    newTickets.splice(idx, 1);
    setTickets(newTickets);
  };

  // const addTickets = () => {

  // }

  const setName = (event) => {
    const newT = { ...t };
    newT.name = event.target.value;
    setT(newT);
  };
  const setPrice = (event) => {
    const newT = { ...t };
    newT.price = event.target.value;
    setT(newT);
  };
  const setQuantity = (event) => {
    const newT = { ...t };
    newT.quantity = event.target.value;
    setT(newT);
  };
  const cancel = () => {
    setT({ price: null, quantity: null, name: null });
    setOpen(false);
  };
  const add = () => {
    const newTickets = [...tickets];
    newTickets.push({ price: t.price, quantity: t.quantity, name: t.name });
    setTickets(newTickets);
    setT({ price: null, quantity: null, name: null });
    setOpen(false);
  };

  const [state, setEditorState] = useState({
    editorState: EditorState.createWithContent(ContentState.createFromText("🎃 Halloween Boat Party 🎃 \nTree Productions is bringing the iconic Halloween Boat Party once again. Are you ready ? \nGet dressed to enjoy the best boat party and take a part of the contest for the best costume. \nThis 4 hour creepy cruise takes place on-board the Darling Harbour, 3 nice dance floors and a fully licensed bar. Our spook-tacular party is the place to be this November, along with our DJs we're throwing in some treats."))
  });

  const onChange = (editorState) => {
    setEditorState({
      editorState,
    });
  };

  return (
    <div className="PostPage">
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ mb: 0 }}>
        <Paper elevation={3} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center" sx={{ mb: 2 }}>
            Edit Event
          </Typography>
          <Grid container spacing={3} rowSpacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth required id="outlined-basic" label="Event Title" variant="outlined" sx={{ mb: 1 }} defaultValue="Halloween Boat party"/>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth required id="outlined-basic" label="Host Name" variant="outlined" sx={{ mb: 1 }} defaultValue="Tree Productions"/>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={cat}
                  label="cat"
                  onChange={handleChange}
                >
                  <MenuItem value={'Movies'}>Movies</MenuItem>
                  <MenuItem value={'Concert'}>Concert</MenuItem>
                  <MenuItem value={'Arts'}>Arts</MenuItem>
                  <MenuItem value={'Conference'}>Conference</MenuItem>
                  <MenuItem value={'Other'}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth id="outlined-basic" label="Address" variant="outlined" sx={{ mb: 1 }} defaultValue="King Street Wharf 6 Wharf #6 - Darling Harbour Sydney, NSW"/>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth id="outlined-basic" label="Post Code" variant="outlined" sx={{ mb: 1 }} defaultValue="2000"/>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="start"
                  className="search"
                  value={value.from}
                  onChange={(newValue) => {
                    setValue({ ...value, from: newValue });
                  }}
                  renderInput={(params) => <TextField fullWidth className="search_date" {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="end"
                  className="search"
                  value={value.to}
                  onChange={(newValue) => {
                    setValue({ ...value, to: newValue });
                  }}
                  renderInput={(params) => <TextField fullWidth className="search_date" {...params} />}
                />
              </LocalizationProvider>
            </Grid>

            {/* <TextField label="Description" multiline rows={5} maxRows={Infinity} style={{ width: '40vw' }} /> */}
            <Grid item xs={12}>
              <Editor
                editorState={state.editorState}
                // toolbarClassName="toolbarClassName"
                // wrapperClassName="wrapperClassName"
                // editorClassName="editorClassName"
                editorStyle={{
                  backgroundColor: 'white',
                  border: '2px solid rgb(50, 62, 88',
                  height: '200px',
                }}
                onEditorStateChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="tik">
                {tickets.map((e, idx) => (
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
                        <Typography id="modal-modal-description">
                          <TextField
                            fullWidth
                            id="standard-basic"
                            label="Name: "
                            variant="standard"
                            value={t.name}
                            margin="normal"
                            onChange={setName}
                          />
                          <TextField
                            fullWidth
                            id="standard-basic"
                            label="Price: "
                            variant="standard"
                            value={t.price}
                            margin="normal"
                            onChange={setPrice}
                          />
                          <TextField
                            fullWidth
                            id="standard-basic"
                            label="Quantity: "
                            variant="standard"
                            value={t.quantity}
                            margin="normal"
                            onChange={setQuantity}
                          />
                        </Typography>
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

            <Grid item xs={12}>
              <TextField
                id="Media upload"
                label="Thumbnail Image link"
                variant="outlined"
                value={thumb}
                fullWidth
                onChange={handleMedia}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                aria-describedby="Media upload"
                variant="contained"
                component="label"
                startIcon={<SendIcon />}
              >
                Upload Thumbnail Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => uploadFile(e.target.files[0], 'thumbnail')}
                />
              </Button>
              {progress.thumbnail < 100 ? `Uploading thumbnail: ${progress.thumbnail}%` : null}
            </Grid>
            <Grid item xs={12}>
              <div className="gallery">
                {gallery.map((e, idx) => (
                  <Grid
                    key={idx}
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={9}>
                      <TextField
                        fullWidth
                        margin="normal"
                        key={idx}
                        id="Media upload"
                        label={`Gallery link ${idx + 1}`}
                        variant="outlined"
                        value={e}
                        onChange={(event) => handleGallery(event, idx)}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant="outlined"
                        component="label"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={(event) => handleClick(event, idx)}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                aria-describedby="Media upload"
                variant="contained"
                component="label"
                startIcon={<SendIcon />}
              >
                Add Gallery Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    uploadFile(e.target.files[0], 'gallery');
                  }}
                />
              </Button>
              {progress.gallery < 100 ? `Uploading gallery image: ${progress.gallery}%` : null}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default EditPage;
