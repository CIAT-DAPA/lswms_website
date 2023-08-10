import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

function ForecastItem({ year, month, week, probabilities, name }) {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: ["Lower", "Normal", "Upper"],
    datasets: [
      {
        label: "Precipitation probabilities",
        data: [
          probabilities[0].lower * 100,
          probabilities[0].normal * 100,
          probabilities[0].upper * 100,
        ],
        backgroundColor: [
          "rgba(249, 108, 105, 0.2)",
          "rgba(96, 228, 99, 0.2)",
          "rgba(94, 177, 216, 0.2)",
        ],
        borderColor: [
          "rgba(249, 108, 105, 1)",
          "rgba(96, 228, 99, 1)",
          "rgba(94, 177, 216, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    if (week) {
      return date.toLocaleString("en-US", { month: "long" });
    } else {
      const previousMonthDate = new Date(date);
      previousMonthDate.setMonth(date.getMonth() - 1);

      const nextMonthDate = new Date(date);
      nextMonthDate.setMonth(date.getMonth() + 1);

      return [
        previousMonthDate.toLocaleString("en-US", { month: "long" }),
        date.toLocaleString("en-US", { month: "long" }),
        nextMonthDate.toLocaleString("en-US", { month: "long" }),
      ].join(" - ");
    }
  };

  let maxKey = null;
  let maxValue = 0;

  for (const key in probabilities[0]) {
    if (probabilities[0].hasOwnProperty(key)) {
      const value = probabilities[0][key];
      if (value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    }
  }

  return (
    <>
      <h6 className="text-center">{year}</h6>
      <h5 className="text-center">{getMonthName(month)}</h5>
      <h6 className="text-center">Precipitation probabilities (%)</h6>
      {week && <h5 className="text-center">Week {week}</h5>}
      <Doughnut data={data} />
      <p className="text-center">
        {week ? `For the week ${week} in the month` : `For the month`}
        <span className="fw-medium"> {getMonthName(month)} </span>
        In the waterpoint
        <span className="fw-medium"> {name} </span>
        the climate forecast suggests that precipitation is most likely{" "}
        <span className="fw-medium">
          {" "}
          {maxKey === "lower"
            ? "lower than normal"
            : maxKey === "normal"
            ? "normal"
            : maxKey === "upper"
            ? "above than normal"
            : ""}
        </span>
        .
      </p>
    </>
  );
}

export default ForecastItem;
