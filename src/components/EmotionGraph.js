import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EmotionGraph = () => {
  const data = [
    { name: '1회기', 행복: 4000, 슬픔: 2400, 분노: 2400 },
    { name: '2회기', 행복: 3000, 슬픔: 1398, 분노: 2210 },
    { name: '3회기', 행복: 2000, 슬픔: 9800, 분노: 2290 },
    { name: '4회기', 행복: 2780, 슬픔: 3908, 분노: 2000 },
    { name: '5회기', 행복: 1890, 슬픔: 4800, 분노: 2181 },
  ];

  return (
    <div className="emotion-graph">
      <h3>감정 그래프</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="행복" stroke="#8884d8" />
          <Line type="monotone" dataKey="슬픔" stroke="#82ca9d" />
          <Line type="monotone" dataKey="분노" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionGraph;