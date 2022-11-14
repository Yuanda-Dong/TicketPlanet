import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';

// const data = [
//   { name: 'Female', count: 1, fill: '#82ca9d' },
//   { name: 'Male', count: 3, fill: '#8884d8' },
//   { name: 'Other', count: 2, fill: '#e887ab' },
// ];
const renderColorfulLegendText = (value, entry) => {
  return <span style={{ color: '#596579', fontWeight: 500, padding: '10px' }}>{value}</span>;
};

const Piechart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="70%">
      <PieChart width={400} height={300}>
        <Legend
          height={36}
          iconType="circle"
          layout="vertical"
          verticalAlign="middle"
          align="right"
          iconSize={10}
          padding={5}
          formatter={renderColorfulLegendText}
        />
        <Pie data={data} cx="50%" cy="50%" nameKey="name" dataKey="count" outerRadius={80} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Piechart;
