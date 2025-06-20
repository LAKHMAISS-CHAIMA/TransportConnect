import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatsChart = ({ stats }) => {
  const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

  const labels = stats.annoncesParMois.map(item => mois[item._id - 1]);
  const dataValues = stats.annoncesParMois.map(item => item.total);

  const data = {
    labels,
    datasets: [
      {
        label: 'Trajets publiés par mois',
        data: dataValues,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        tension: 0.3, 
        pointBorderWidth: 3,
        pointRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Courbe des trajets publiés',
        font: { size: 18 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0 
        }
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default StatsChart;
