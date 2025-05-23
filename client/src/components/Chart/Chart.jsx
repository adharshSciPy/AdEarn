// components/RadarChart.jsx
import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register chart components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: '2025',
      data: [65, 59, 90, 81, 56, 55, 40],
      backgroundColor: 'rgba(110, 57, 255, 0.3)',
      borderColor: '#693BB8',
      pointBackgroundColor: '#693BB8',
    },
    {
      label: '2024',
      data: [28, 48, 40, 19, 96, 27, 100],
      backgroundColor: 'rgba(30, 56, 131, 0.3)',
      borderColor: '#1E3883',
      pointBackgroundColor: '#1E3883',
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      pointLabels: {
        color: 'white',
        font: {
          size: 14,
        },
      },
      ticks: {
        display: false,
      },
      grid: {
        color: '#333',
      },
      angleLines: {
        color: '#444',
      },
    },
  },
  plugins: {
    legend: {
      // labels: {
      //   color: 'white',
      // },
      display: false
    },
  },
};

export default function RadarChart() {
  return <Radar data={data} options={options} />;
}
