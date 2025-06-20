import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ActiviteUtilisateursChart = ({ dataActivite }) => {
  const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

  const labels = dataActivite.map(item => mois[item._id - 1]);
  const dataValues = dataActivite.map(item => item.total);

  const data = {
    labels,
    datasets: [
      {
        label: 'Utilisateurs actifs',
        data: dataValues,
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Activité mensuelle des utilisateurs',
        font: { size: 18 }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default ActiviteUtilisateursChart;
