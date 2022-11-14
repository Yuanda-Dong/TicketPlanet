import React, { useState, useEffect } from 'react';
import Piechart from '../Charts/PieChart';
import EventTable from './EventTable';
import AgeChart from '../Charts/AgeChart';
import LocationChart from '../Charts/LocationChart';
import Widget from '../Charts/Widget';
import { axiosInstance } from '../../config.js';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { Paper as PaperMui } from '@mui/material';

const ReportContainer = styled.div``;

const Charts = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Paper = styled(PaperMui)`
  && {
    margin: 3rem 0;
    width: 400px;
    height: 300px;
    /* box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
     */
    -webkit-box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.47);
    box-shadow: 2px 4px 10px 1px rgba(201, 201, 201, 0.47);
    border-radius: 10px;
  }
`;

const H2 = styled.h2`
  margin: 1rem;
  font-size: 20px;
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

const Reports = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [chartData, setChartData] = useState({
    gender: genderData,
    age: ageData,
    post: [],
  });

  const [ready, setReady] = useState(false);

  const [currentEvent, setCurrentEvent] = useState(null);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    const setData = (data) => {
      if (data) {
        setChartData((prev) => {
          prev.gender.forEach((entry) => (entry.count = data.gender[entry.value]));
          prev.age.forEach((entry) => (entry.count = data.age[entry.name]));
          const temp = [];
          for (const [key, val] of Object.entries(data.post)) {
            temp.push({ name: key, count: val });
          }
          prev.post = temp;
          return prev;
        });
      }
    };

    const fetchReport = async (currentEvent) => {
      if (currentEvent) {
        try {
          setReady(false);
          let res = await axiosInstance.get(`/event/report/${currentEvent}`);
          await setData(res.data);
          setReady(true);
        } catch (e) {
          console.error(e);
        }
      } else if (currentUser) {
        console.log('user');
        try {
          setReady(false);
          let res = await axiosInstance.get(`/user/report/${currentUser._id}`);
          await setData(res.data);
          await setFollowers(Object.values(res.data.gender).reduce((a, b) => a + b));
          setReady(true);
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchReport(currentEvent);
  }, [currentUser, currentEvent]);

  return (
    <ReportContainer>
      <Widget setCurrentEvent={setCurrentEvent} counts={followers} />
      <Charts>
        <Paper>
          <H2>Gender Distribution</H2>
          {ready && <Piechart data={chartData.gender} />}
        </Paper>
        <Paper>
          <H2>Age Distribution</H2>
          {ready && <AgeChart data={chartData.age} />}
        </Paper>
        <Paper>
          <H2>Location Distribution</H2>
          {ready && <LocationChart data={chartData.post} />}
        </Paper>
      </Charts>

      <EventTable setCurrentEvent={setCurrentEvent} />
    </ReportContainer>
  );
};

export default Reports;
