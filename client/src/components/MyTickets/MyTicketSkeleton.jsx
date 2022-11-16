import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

const variants = ['h1', 'h3', 'body1', 'caption'];

export default function MyTicketSkeleton() {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rectangular" height={100} />
      <Skeleton variant="rectangular" height={80} />
      <Skeleton variant="rectangular" height={80} />
      <Skeleton variant="rectangular" height={80} />
      <Skeleton variant="rectangular" height={80} />
      <Skeleton variant="rectangular" height={80} />
    </Stack>
  );
}
