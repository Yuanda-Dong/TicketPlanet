import React, { useState, useEffect } from 'react';
import Piechart from '../Charts/PieChart';
import EventTable from './EventTable';
import AgeChart from '../Charts/AgeChart';
import LocationChart from '../Charts/LocationChart';

import styled from 'styled-components';
import { Paper as PaperMui } from '@mui/material';

const ReportContainer = styled.div``;

const Charts = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Paper = styled(PaperMui)`
  && {
    margin: 3rem 0;
    width: 400px;
    height: 300px;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  }
`;

const H2 = styled.h2`
  margin: 1rem;
`;

const Reports = () => {
  return (
    <ReportContainer>
      <Charts>
        <Paper>
          <H2>Gender Distribution</H2>
          <Piechart />
        </Paper>
        <Paper>
          <H2>Age Distribution</H2>
          <AgeChart />
        </Paper>
        <Paper>
          <H2>Location Distribution</H2>
          <LocationChart />
        </Paper>
      </Charts>

      <EventTable />
    </ReportContainer>
  );
};

export default Reports;
