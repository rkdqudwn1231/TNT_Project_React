// LineChart.jsx
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./ChartStyle.module.css";
import { color } from "chart.js/helpers";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default function UsageChart() {

    const data = {
        labels: ["00~03","03~06", "06~09","09~12", "12~15","15~18", "18~21","21~24"],
        datasets: [
            {
                label: "매출",
                data: [120, 190, 140, 220, 260],
                borderWidth: 2,
                tension: 0.4, // 곡선
                pointRadius: 8,
                pointBackgroundColor: 'rgba(255, 52, 52, 1)', // 포인트 내부 색
                  borderColor: 'rgba(255, 52, 52, 1)',
                pointColor:'green'
            },
        ],
    };

    const options = {
        responsive: true, // 부모 컨테이너 크기에 따라 차트 크기 자동 조절
        maintainAspectRatio: false, // true면 가로/세로 비율 유지, false면 자유롭게 높이/폭 조절

        plugins: {
            legend: { position: "top", color: '#000' }, // 범례 글씨 검정},

            title: {
                display: true,
                text: '접속시간대',
                color: '#2a2a2aff', // 제목 글씨 검정색
                font: { size: 18, color: "black" },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Line data={data} options={options} className={styles.border} />;
}