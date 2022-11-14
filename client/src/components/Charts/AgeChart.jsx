import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   {
//     name: '<=14',
//     age: 2400,
//   },
//   {
//     name: '15-25',
//     age: 1398,
//   },
//   {
//     name: '26-35',
//     age: 9800,
//   },
//   {
//     name: '36-50',
//     age: 3908,
//   },
//   {
//     name: '>50',
//     age: 4800,
//   },
// ];

const AgeChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="70%">
      <BarChart
        width={400}
        height={300}
        data={data}
        margin={{
          right: 30,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis hide />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="age" fill="#838ac3" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AgeChart;
