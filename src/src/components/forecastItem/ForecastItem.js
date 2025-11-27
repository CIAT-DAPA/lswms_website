import React from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

function ForecastItem({ year, month, week, probabilities, name }) {
  const [t] = useTranslation("global");


  let pBase = probabilities || {};

  if (Array.isArray(pBase)) {
    pBase = pBase[0] || {};
  }

  const {
    lower = 0,
    normal = 0,
    upper = 0,
  } = pBase;

  const roundedProbabilities = {
    lower: Math.round(lower * 100),
    normal: Math.round(normal * 100),
    upper: Math.round(upper * 100),
  };

  const data = {
    series: [
      {
        name: t("data.precipitation"),
        data: [
          roundedProbabilities.lower,
          roundedProbabilities.normal,
          roundedProbabilities.upper,
        ],
      },
    ],
    options: {
      chart: {
        height: 200,
        type: "bar",
        offsetY: 16,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: false,
          barHeight: "75%",
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      colors: ["#e3bab2", "#b3e4b3", "#97cdd8"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          t("data.lower-label"),
          t("data.normal"),
          t("data.upper-label"),
        ],
      },
      yaxis: {
        max: 100,
        title: {
          text: t("data.precipitation") + " (%)",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "%";
          },
        },
      },
    },
  };

  const getMonthName = (monthNumber) => {
    const months = [
      t("data.month1"),
      t("data.month2"),
      t("data.month3"),
      t("data.month4"),
      t("data.month5"),
      t("data.month6"),
      t("data.month7"),
      t("data.month8"),
      t("data.month9"),
      t("data.month10"),
      t("data.month11"),
      t("data.month12"),
    ];

    if (week) {
      return months[monthNumber - 1];
    } else {
      const previousMonth = months[(monthNumber + 10) % 12];
      const currentMonth = months[monthNumber - 1];
      const nextMonth = months[monthNumber % 12];
      return `${previousMonth} - ${currentMonth} - ${nextMonth}`;
    }
  };

  let maxKey = null;
  let maxValue = 0;

  for (const key in roundedProbabilities) {
    if (Object.prototype.hasOwnProperty.call(roundedProbabilities, key)) {
      const value = roundedProbabilities[key];
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
      <h6 className="text-center">{t("data.precipitation")} (%)</h6>
      {week && (
        <h5 className="text-center">
          {t("data.week")} {week}
        </h5>
      )}
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="bar"
        height={350}
      />
      <p className="text-center">
        {week
          ? t("data.forecast-sub-1a") + ` ${week} ` + t("data.forecast-sub-1b")
          : t("data.forecast-seasonal-1")}
        <span className="fw-medium"> {getMonthName(month)} </span>
        {t("data.forecast-2")}
        <span className="fw-medium"> {name} </span>
        {t("data.forecast-3")}{" "}
        <span className="fw-medium">
          {maxKey === "lower"
            ? t("data.lower")
            : maxKey === "normal"
            ? t("data.normal")
            : maxKey === "upper"
            ? t("data.upper")
            : ""}
        </span>
        .
      </p>
    </>
  );
}

export default ForecastItem;