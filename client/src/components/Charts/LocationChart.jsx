import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '2000',
    counts: 2400,
    amt: 2400,
  },
  {
    name: '2007',
    counts: 1398,
    amt: 2210,
  },
  {
    name: '2123',
    counts: 9800,
    amt: 2290,
  },
  {
    name: '2058',
    counts: 3908,
    amt: 2000,
  },
  {
    name: '2012',
    counts: 4800,
    amt: 2181,
  },
  {
    name: '2768',
    counts: 3008,
    amt: 2000,
  },
  {
    name: '2511',
    counts: 2800,
    amt: 2181,
  },
];

const LocationChart = () => {
  return (
    <ResponsiveContainer width="100%" height="70%">
      <BarChart
        layout="vertical"
        width={400}
        height={300}
        data={data.sort((a, b) => b.counts - a.counts)}
        margin={{
          right: 30,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" hide />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Bar dataKey="counts" fill="#6faeb5" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LocationChart;
