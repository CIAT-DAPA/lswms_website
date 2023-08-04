import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

function ForecastItem(props) {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <h6 className="text-center">2023</h6>
      <h5 className="text-center">October - November - December</h5>
      <h6 className="text-center">Precipitation probabilities (%)</h6>
      <Doughnut data={data} />
      <p className="text-justify">
        For the quarter
        <span className="fw-medium"> October - November - December </span>
        In the municipality
        <span className="fw-medium"> Yopal </span>
        the climate forecast suggests that precipitation is most likely{" "}
        <span className="fw-medium"> above normal</span>.
      </p>
    </>
  );
}

export default ForecastItem;
