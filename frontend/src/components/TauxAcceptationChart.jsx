import { Doughnut } from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TauxAcceptationChart = ({ taux }) => {
  const data = {
    labels: ['Acceptées', 'Refusées'],
    datasets: [
      {
        data: [taux, 100 - taux],
        backgroundColor: ['#10B981', '#EF4444'],
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Taux d’acceptation des demandes',
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default TauxAcceptationChart;
