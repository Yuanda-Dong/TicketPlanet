import React from 'react';
import NavBar from '../../components/Navbar/NavBar';
import TextField from '@mui/material/TextField';

const PostPage = () => {
    return (
      <>
        <NavBar/>
        <div>
        <TextField id="outlined-basic" label="Outlined" variant="Event name" />
        <TextField id="outlined-basic" label="Outlined" variant="Host name" />
        </div>
      </>
    );
  };
  
export default PostPage;