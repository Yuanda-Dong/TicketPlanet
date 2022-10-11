import { TextField } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import ResetPassword from '../components/ResetPassword';
import NavBar from '../components/Navbar/NavBar';

const Container = styled.div`
  min-height: 100vh;
`;
const Wrapper = styled.div`
  display: flex;

  flex-direction: column;
  margin: 20px 30px;
`;
const Header = styled.h1``;
const Subheader = styled.h3`
  font-size: 16px;
  font-weight: bold;
  /* width: 100%; */
  /* background-color: red;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5); */
`;
const Content = styled.div``;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Account = () => {
  return (
    <Container>
      <NavBar />
      <Wrapper>
        <Header>Account Settings</Header>
        <Content>
          <Subheader>Profile Image</Subheader>
        </Content>
        <Content>
          <Subheader>Personal Information</Subheader>
        </Content>
        <Content>
          <Subheader>Password Reset</Subheader>
          <ResetPassword />
        </Content>
      </Wrapper>
    </Container>
  );
};

export default Account;
