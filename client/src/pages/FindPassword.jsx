import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import ReactInputVerificationCode from 'react-input-verification-code';
import { Input } from '@mui/material';
import { Link } from 'react-router-dom';

const Container = styled.div`
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Wrapper = styled.div`
  display: flex;
  width: 300px;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background-color: #dae9ff;
  border: 1px solid #ccc;
  border-radius: 10px;

  padding: 30px 15px;
`;

const StyledButton = styled.button`
  margin-top: 35px;
  color: white;
  background: #3c3f6d;
  border-radius: 24px;
  border: none;
  outline: none;
  width: 212px;
  height: 48px;
`;

const ReturnButton = styled.button`
  margin-top: 20px;
  position: absolute;
  top: 0;
  left: 15px;
  color: white;
  background: rgba(60, 63, 109, 0.8);
  border-radius: 5px;
  border: none;
  outline: none;
  width: 120px;
  height: 48px;
  text-decoration: none;
`;

const StyledResend = styled.div`
  margin-top: 20px;
  text-decoration: underline;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  /* :focus {
    color: red;
  } */
`;

const StyledSeconds = styled.div`
  margin-top: 20px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.002em;
  /* color: rgba(255, 255, 255, 0.4); */
  color: rgba(32, 31, 84, 0.4);
`;

const StyledError = styled.div`
  margin-top: 13px;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.004em;
  color: #ef6c65;
`;

export default function App() {
  const [value, setValue] = useState('');
  const [error, setError] = useState({ error: false, message: null });

  const [seconds, setSeconds] = useState(null);

  const handleResend = (e) => {
    setSeconds(60);

    let mySeconds = 60;

    // TODO Clear previos interval

    const intervalId = setInterval(() => {
      mySeconds = mySeconds - 1;
      setSeconds(mySeconds);

      if (mySeconds === 0) {
        clearInterval(intervalId);
        setSeconds(null);
      }
    }, 1000);
  };

  return (
    <Container>
      <Link to="/signin">
        <ReturnButton>Return</ReturnButton>
      </Link>
      <Wrapper>
        <Input />

        {error.error && <StyledError>{error.message}</StyledError>}

        {seconds && <StyledSeconds>{`Verification code has been re-sent (${seconds}s)`}</StyledSeconds>}

        <StyledButton
          onClick={() => {
            setValue('');
            setError({ error: true, message: 'Incorrect code. Please try again' });
          }}
        >
          Send
        </StyledButton>
        <StyledResend onClick={handleResend}>Click to resent the verification code</StyledResend>
      </Wrapper>
    </Container>
  );
}
