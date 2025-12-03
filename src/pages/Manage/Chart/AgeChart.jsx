import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  scales,
  Title
} from "chart.js";

import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styles from "./ChartStyle.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title, ChartDataLabels);

export default function AgeChart() {
  const data = {

    labels: ["10대", "20대", "30대", "40대", "50대 이상"],
    datasets: [
      {
        label: "명",
        data: [65, 90, 75],
        backgroundColor: [
          'rgba(255, 186, 201, 1)',
          'rgba(255, 214, 173, 1)',
          'rgba(255, 239, 202, 1)',
          'rgba(221, 255, 255, 1)',
          'rgba(191, 230, 255, 1)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
      },
    ],

  };
  const options = {
    responsive: true, // 부모 컨테이너 크기에 따라 차트 크기 자동 조절
    maintainAspectRatio: false, // true면 가로/세로 비율 유지, false면 자유롭게 높이/폭 조절
    plugins: {

      title: {
        display: true,
        text: '연령대',
        color: '#2a2a2aff', // 제목 글씨 검정색
        font: { size: 18,color:"black" },
      },

      datalabels: {
        anchor: 'end',     // 라벨 위치
        // align: 'mid',      // 막대 위쪽에 표시
        color: 'rgba(56, 56, 56, 1)',
        font: { size: 12 },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} className={styles.border}/>;
}
