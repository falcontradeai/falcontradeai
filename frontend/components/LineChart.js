import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function LineChart({ labels, datasets, className = "", showLegend = true }) {
  const createOptions = () => {
    const dark = document.documentElement.classList.contains('dark');
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
          labels: {
            color: dark ? '#f3f4f6' : '#374151',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: dark ? '#f3f4f6' : '#374151',
          },
          grid: {
            color: dark ? '#374151' : '#e5e7eb',
          },
        },
        y: {
          ticks: {
            color: dark ? '#f3f4f6' : '#374151',
          },
          grid: {
            color: dark ? '#374151' : '#e5e7eb',
          },
        },
      },
    };
  };

  const [options, setOptions] = useState(createOptions);

  useEffect(() => {
    const update = () => setOptions(createOptions());
    window.addEventListener('themeChange', update);
    return () => window.removeEventListener('themeChange', update);
  }, [showLegend]);

  return (
    <div className={className}>
      <Line data={{ labels, datasets }} options={options} />
    </div>
  );
}

