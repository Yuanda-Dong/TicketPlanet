import React from 'react';
import Navbar from '../../components/Navbar/NavBar';
import Header from '../../components/Header/Header';
import LandingMain from '../../components/LandingMain/LandingMain';

const Landing = () => {
  console.log(process.env.REACT_APP_API_MODE);
  return (
    <>
      <Navbar />
      <Header />
      <LandingMain />
    </>
  );
};

export default Landing;
