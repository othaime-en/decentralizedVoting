// BarChartComponent.js
import React from "react";
import { Bar } from "react-chartjs-2";

const BarChartComponent = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.title || `ID ${d.instanceId}`), // Use title or ID if title is not available
    datasets: [
      {
        label: "Candidate Distribution per Instance",
        data: data.map((d) => d.candidateCount), // Assuming 'voteCount' holds the total number of voters
        backgroundColor: "rgba(29, 192, 113, 0.5)",
        borderColor: "rgba(29, 192, 113, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChartComponent;
