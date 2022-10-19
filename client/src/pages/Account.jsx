import {Box, Container, Grid, Typography} from '@mui/material';
import React from 'react';
// import styled from 'styled-components';
import NavBar from '../components/Navbar/NavBar';
import {AccountProfile} from '../components/Account/Account_profile';
import ResetPassword from "../components/Account/ResetPassword";
import {PersonalInformation} from "../components/Account/Account_profile_detail";

// const Container = styled.div`
//   min-height: 100vh;
// `;
// const Wrapper = styled.div`
//   display: flex;
//
//   flex-direction: column;
//   margin: 20px 30px;
// `;
// const Header = styled.h1``;
// const Subheader = styled.h3`
//   font-size: 16px;
//   font-weight: bold;
//   /* width: 100%; */
//   /* background-color: red;
//   border-bottom: 1px solid rgba(255, 255, 255, 0.5); */
// `;
// const Content = styled.div``;
// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 5px;
// `;

const Account = () => {
	return (
		<>
			<NavBar/>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
					backgroundImage:'url(https://www.pexels.com/zh-cn/photo/220182/)',
					backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
          backgroundSize: 'cover',
          backgroundPosition: 'contain',
				}}
			>
				<Container maxWidth="lg">
					<Typography
						sx={{mb: 3}}
						variant="h4"
					>
						Account
					</Typography>
					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							lg={4}
							md={6}
							xs={12}
						>
							<AccountProfile/>
						</Grid>
						<Grid
							item
							lg={8}
							md={6}
							xs={12}
						>
							<PersonalInformation/>
						</Grid>
						<Grid
							item
							lg={4}
							md={6}
							xs={12}
						/>
						<Grid
							item
							lg={8}
							md={6}
							xs={12}
						>
							<ResetPassword/>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</>
	)
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
