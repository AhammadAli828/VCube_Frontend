import React, { useContext } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { AuthContext } from './api/AuthContext';
import { UserGoogleContext } from './api/Google';
import { useStudentAuth } from './api/StudentAuthContext';

const ExpiredPage = () => {
  const { removeStudentLoginData, studentAuthChk } = useStudentAuth();
  const { userAuthChk } = useContext(AuthContext);
  const { userGoogleLogout } = useContext(UserGoogleContext);
  
  const handleLoginRedirect = () => {
    removeStudentLoginData();
    studentAuthChk();
    userGoogleLogout();
    userAuthChk();
  };

  return (
    <Box className='w-screen h-screen flex flex-col items-center justify-start bg-[#f8f8f8]'>
      <img src='/images/V-Cube-Logo.png' alt='' width='100px' className='mb-20' />
      <img src='/images/login-expired.gif' alt='' width='30%' />
      <Typography sx={{fontSize : '20px', textAlign : 'center'}} color='grey'>
        Either your login session has timed out, or something went wrong.<br/>
        Please try logging in again.
      </Typography>
      <Button
        variant='contained'
        sx={{margin : '30px 0', background : '#94a3b8'}}
        onClick={handleLoginRedirect}
      >
        Login Page
      </Button>
    </Box>
  );
}

export default ExpiredPage;
