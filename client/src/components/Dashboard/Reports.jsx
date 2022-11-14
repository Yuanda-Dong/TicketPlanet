import React, { useState, useEffect } from 'react';
import Piechart from '../Charts/PieChart';
import EventTable from './EventTable';
import AgeChart from '../Charts/AgeChart';
import LocationChart from '../Charts/LocationChart';
import { axiosInstance } from '../../config.js';
import { useSelector } from 'react-redux';

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

const genderData = [
  { value: 'female', name: 'Female', count: 0, fill: '#82ca9d' },
  { value: 'male', name: 'Male', count: 0, fill: '#8884d8' },
  { value: 'nonbinary', name: 'Other', count: 0, fill: '#e887ab' },
];

const ageData = [
  {
    name: '<=14',
    count: 0,
  },
  {
    name: '15-25',
    count: 0,
  },
  {
    name: '26-35',
    count: 0,
  },
  {
    name: '36-50',
    count: 0,
  },
  {
    name: '>50',
    count: 0,
  },
];

const locationData = [];

const Reports = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [chartData, setChartData] = useState({
    gender: genderData,
    age: ageData,
    post: locationData,
  });

  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    const setData = (data) => {
      if (data) {
        setChartData((prev) => {
          prev.gender.forEach((entry) => (entry.count = data.gender[entry.value]));
          prev.age.forEach((entry) => (entry.count = data.age[entry.name]));
          for (const [key, val] of Object.entries(data.post)) {
            prev.post.push({ name: key, counts: val });
          }
          return prev;
        });
      }
    };

    const fetchReport = async (currentEvent) => {
      if (currentEvent) {
        try {
          let res = axiosInstance.get(`/event/report/${currentEvent}`);
          setData(res.data);
        } catch (e) {
          console.error(e);
        }
      }
      else if (currentUser) {
        try {
          let res = axiosInstance.get(`/user/report/${currentUser._id}`);
          setData(res.data);
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchReport();
  }, [currentUser, currentEvent]);

  console.log(chartData);

  return (
    <ReportContainer>
      <Charts>
        <Paper>
          <H2>Gender Distribution</H2>
          <Piechart data={chartData.gender} />
        </Paper>
        <Paper>
          <H2>Age Distribution</H2>
          <AgeChart data={chartData.age} />
        </Paper>
        <Paper>
          <H2>Location Distribution</H2>
          <LocationChart data={chartData.post} />
        </Paper>
      </Charts>

      <EventTable setCurrentEvent={setCurrentEvent} />
    </ReportContainer>
  );
};

export default Reports;
