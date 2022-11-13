import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Tab,
  Typography,
} from '@mui/material';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import React from 'react';
// import styled from 'styled-components';
import NavBar from '../components/Navbar/NavBar';
import ResetPassword from '../components/Account/ResetPassword';
import {PersonalInformation} from '../components/Account/Account_profile_detail';
import '../components/Account/Account.css';
import {Lock, Portrait} from '@mui/icons-material';

const Account = () => {
  const {currentUser} = useSelector((state) => state.user);
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <NavBar />
      <Box className="accountBg" component="main">
        <Container maxWidth="lg">
          <TabContext value={value}>
            <h1>User Profile</h1>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} xs={12}>
                <Card className="portrait">
                  <CardContent>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Avatar
                        sx={{
                          height: 64,
                          mb: 2,
                          width: 64,
                        }}
                      >{`${currentUser.first_name[0]}.${currentUser.last_name[0]}`}</Avatar>
                      {/*<Typography color="textPrimary" gutterBottom variant="h4">*/}
                      {/*  {`${currentUser.first_name} ${currentUser.last_name}`}*/}
                      {/*</Typography>*/}
                      <h2>{`${currentUser.first_name} ${currentUser.last_name}`}</h2>
                      <Typography color="textSecondary" variant="h6">
                        {currentUser.email}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardContent>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <TabList
                        orientation="vertical"
                        onChange={handleChange}
                        variant="fullWidth"
                        aria-label="lab API tabs example"
                      >
                        <Tab sx={{color: '#4f4cee'}} icon={<Portrait/>} iconPosition={'start'} label="Account Details"
                             value="1"/>
                        <Tab sx={{color: '#4f4cee'}} icon={<Lock/>} iconPosition={'start'} label="Reset Password"
                             value="2"/>
                      </TabList>
                    </Box>
                  </CardContent>
                  {/*<Divider/>*/}
                  <Link className="link" to={'/my-tickets'}>
                    <CardActions>
                      <Button
                        color="secondary"
                        fullWidth
                        variant="text"
                      ><h4>My Tickets</h4>
                      </Button>
                    </CardActions>
                  </Link>
                </Card>
              </Grid>
              <Grid item lg={8} md={6} xs={12}>
                <TabPanel value="1">
                  <PersonalInformation/>
                </TabPanel>
                <TabPanel value="2">
                  <ResetPassword/>
                </TabPanel>
              </Grid>
            </Grid>
          </TabContext>
        </Container>
      </Box>
    </>
  );
};

// const Account = () => {
//   return (
//     <Container>
//       <NavBar />
//       <Wrapper>
//         <Header>Account Settings</Header>
//         <Content>
//           <Subheader>Personal Information</Subheader>
//         </Content>
//         <Content>
//           <Subheader>Password Reset</Subheader>
//           <ResetPassword />
//         </Content>
//       </Wrapper>
//     </Container>
//   );
// };

export default Account;
