// PieChartComponent.js
import React from "react";
import { Pie } from "react-chartjs-2";

const PieChartComponent = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.candidateName), // Assumes you have 'organizationName' in your data
    datasets: [
      {
        data: data.map((d) => d.voteCount), // Again, assuming 'voteCount' holds the number of voters
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#C9CBCF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#C9CBCF",
        ],
      },
    ],
  };

  const options = {
    // ... other options
    plugins: {
      legend: {
        position: "right", // Position the legend on the right side
      },
    },
    maintainAspectRatio: false, // Add this to maintain the aspect ratio
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChartComponent;
