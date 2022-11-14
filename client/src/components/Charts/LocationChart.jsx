import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   {
//     name: '2000',
//     counts: 2400,
//   },
//   {
//     name: '2007',
//     counts: 1398,
//   },
//   {
//     name: '2123',
//     counts: 9800,
//   },
//   {
//     name: '2058',
//     counts: 3908,
//   },
//   {
//     name: '2012',
//     counts: 4800,
//   },
//   {
//     name: '2768',
//     counts: 3008,
//   },
//   {
//     name: '2511',
//     counts: 2800,
//   },
// ];

const LocationChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="70%">
      <BarChart
        layout="vertical"
        width={400}
        height={300}
        data={data.sort((a, b) => b.count - a.count)}
        margin={{
          right: 30,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" hide />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Bar dataKey="count" fill="#6faeb5" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LocationChart;
