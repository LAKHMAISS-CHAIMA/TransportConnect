import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ActivityChart = ({ data, title, color }) => {
  const chartData = {
    labels: data.map(d => `${d._id.month}/${d._id.year}`),
    datasets: [
      {
        label: title,
        data: data.map(d => d.total),
        borderColor: color,
        backgroundColor: `${color}80`,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default ActivityChart;
