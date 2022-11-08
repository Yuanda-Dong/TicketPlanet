import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '<=14',
    uv: 4000,
    age: 2400,
    amt: 2400,
  },
  {
    name: '15-25',
    uv: 3000,
    age: 1398,
    amt: 2210,
  },
  {
    name: '26-35',
    uv: 2000,
    age: 9800,
    amt: 2290,
  },
  {
    name: '36-50',
    uv: 2780,
    age: 3908,
    amt: 2000,
  },
  {
    name: '>50',
    uv: 1890,
    age: 4800,
    amt: 2181,
  },
];

const AgeChart = () => {
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
