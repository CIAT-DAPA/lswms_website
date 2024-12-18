import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "./ForageLineChart.css";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ForageLineChart = ({ data, title }) => {
  const [t] = useTranslation("global");
  const chartRef = useRef(null);
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: t("forage.biomass-mean"),
        data: data.map((item) => item.mean),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Biomass (t/ha)",
        },
      },
    },
  };

  const exportChartAsJPEG = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const dataURL = canvas.toDataURL("image/jpeg");
      saveAs(dataURL, `${title}.jpeg`);
    }
  };

  const exportDataAsCSV = () => {
    const csvData = data.map((item) => `${item.date},${item.mean}`).join("\n");
    const blob = new Blob([`Date,Biomass (t/ha)\n${csvData}`], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, `${title}.csv`);
  };

  return (
    <>
      <div ref={chartRef}>
        <Line data={chartData} options={options} />
      </div>
      <div className="export-buttons">
        <button className="export-button" onClick={exportChartAsJPEG}>
          {t("forage.export-jpeg")}
        </button>
        <button className="export-button" onClick={exportDataAsCSV}>
          {t("forage.export-csv")}
        </button>
      </div>
    </>
  );
};

export default ForageLineChart;
