import React, { useState } from 'react';
import NavBar from '../../components/Navbar/NavBar';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './PostPage.css';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { axiosInstance } from '../../config';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const PostPage = () => {
  const navigate = useNavigate();
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
    },
  };
  const storage = getStorage();
  const [event, setEvent] = useState({
    title: '',
    host_name: '',
    category: '',
    address: '',
    postcode: '',
    start_dt: null,
    end_dt: null,
    image_url: '',
    gallery: [],
    details: '',
  });

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

  const [progress, setProgress] = React.useState({ thumbnail: 100, gallery: 100 });

  const handleGallery = (e, idx) => {
    const newGallery = event.gallery;
    newGallery[idx] = e.target.value;
    setEvent((prev) => ({ ...prev, gallery: newGallery }));
  };

  const handleEventChange = (e) => {
    // console.log(e.target.name);
    e.preventDefault();
    setEvent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

          type === 'thumbnail'
            ? setEvent((prev) => ({ ...prev, image_url: downloadURL }))
            : setEvent((prev) => ({ ...prev, gallery: [...event.gallery, downloadURL] }));
        });
      }
    );
  };

  const removeGallery = (idx) => {
    const newGallery = event.gallery;
    console.log(newGallery);
    const removed = newGallery.splice(idx, 1);
    setEvent((prev) => ({ ...prev, gallery: newGallery }));
    console.log(removed);
    deleteFile(removed);
  };

  // editor state
  const [state, setEditorState] = useState({
    editorState: EditorState.createEmpty(),
  });

  const onChange = (editorState) => {
    setEditorState({
      editorState,
    });
    setEvent((prev) => ({ ...prev, details: editorState.getCurrentContent().getPlainText('\u0001') }));

  };
  const goHome = () => {
    navigate('/dashboard/events');
  }

  const goNext = async () => {
    if (event.title ==''){
      alert("Event must have title");
      return;
    }
    if (event.host_name ==''){
      alert("Event must have host");
      return;
    }
    if (event.category == ''){
      alert("Event must have category");
      return;
    }
    if (event.address == ''){
      alert("Event must have address");
      return;
    }
    const regex = /^\d{4}$/
    let result = regex.test(event.postcode);
    if (result == false){
      alert("Event must have a valid postcode");
      return;
    }
    if (event.start_dt == null){
      alert("Event must have a start datetime");
      return;
    }
    if (event.end_dt == null){
      alert("Event must have an end datetime");
      return;
    }
    if(event.end_dt < event.start_dt){
      alert("Event must not end before it starts");
    }
    try{
      let res = await axiosInstance.post('/event',event,config);
      let id = res.data._id;
      navigate(`/tickets/${id}`);
      
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="PostPage">
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ mb: 0 }}>
        <Paper elevation={3} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center" sx={{ mb: 2 }}>
            Create New Event
          </Typography>
          <Grid container spacing={3} rowSpacing={2}>
            <Grid item xs={12}>
              <h3> Event Information</h3>
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={event.title}
                fullWidth
                required
                id="outlined-basic"
                label="Event Title"
                variant="outlined"
                name="title"
                onChange={handleEventChange}
                sx={{ mb: 1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={event.host_name}
                name="host_name"
                fullWidth
                required
                id="outlined-basic"
                label="Host Name"
                variant="outlined"
                onChange={handleEventChange}
                sx={{ mb: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={event.category}
                  label="Category"
                  name="category"
                  onChange={handleEventChange}
                  required
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
              <TextField
                value={event.address}
                name="address"
                fullWidth
                id="outlined-basic"
                label="Address"
                variant="outlined"
                onChange={handleEventChange}
                sx={{ mb: 1 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={event.postcode}
                name="postcode"
                fullWidth
                id="outlined-basic"
                label="Post Code"
                variant="outlined"
                onChange={handleEventChange}
                sx={{ mb: 1 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  required
                  label="Start"
                  className="search"
                  value={event.start_dt}
                  name="start_dt"
                  onChange={(newVal) => {
                    setEvent((prev) => ({ ...prev, start_dt: newVal }));
                  }}
                  renderInput={(params) => <TextField fullWidth className="search_date" {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  required
                  label="End"
                  className="search"
                  value={event.end_dt}
                  name="end_dt"
                  onChange={(newVal) => {
                    setEvent((prev) => ({ ...prev, end_dt: newVal }));
                  }}
                  renderInput={(params) => <TextField fullWidth className="search_date" {...params} />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <h3> Event Description</h3>
            </Grid>
            <Grid item xs={12}>
              <Editor
                editorState={state.editorState}
                editorStyle={{
                  backgroundColor: 'white',
                  border: '2px solid rgb(50, 62, 88)',
                  height: '200px',
                }}
                onEditorStateChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <h3> Image Upload</h3>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="Media upload"
                label="Thumbnail Image link"
                variant="outlined"
                value={event.image_url}
                name="image_url"
                fullWidth
                onChange={handleEventChange}
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
                {event.gallery.map((e, idx) => (
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
                        onClick={(event) => removeGallery(event, idx)}
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginTop: '50px' }}>
            <Button sx={{ mt: '20px' }} variant="outlined" onClick={goHome}>
              Cancel
            </Button>

            <Button sx={{ mt: '20px' }} variant="contained" onClick={goNext}>
              Save & Next
            </Button>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default PostPage;
