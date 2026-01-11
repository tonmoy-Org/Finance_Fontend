import React from 'react';
import { Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

export const SuperAdminDashboard = () => {

  return (
    <Box>
      <Helmet>
        <title>Dashboard | Finance Dashboard</title>
        <meta name="description" content="Technical dashboard" />
      </Helmet>
      <Typography gutterBottom  sx={{ mb: 4, fontSize: 14 }}>
        Welcome to Finance Dashboard. This is a web application that allows you to look up customer information.
      </Typography>
    </Box>
  );
};
