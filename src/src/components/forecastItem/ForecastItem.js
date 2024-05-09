
import React from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

function ForecastItem({ year, month, week, probabilities, name }) {
  const [t] = useTranslation("global");

  const roundedProbabilities = {
    lower: Math.round(probabilities[0].lower * 100),
    normal: Math.round(probabilities[0].normal * 100),
    upper: Math.round(probabilities[0].upper * 100),
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
        type: 'bar',
        offsetY: 16,
        toolbar: {
            show: false,
        },
    },
    plotOptions: {
        bar: {
            distributed: true, // this line is mandatory
            horizontal: false,
            barHeight: '75%',
            columnWidth: '55%',
          endingShape: 'rounded',
        },
    },
    colors: [ "#e3bab2","#b3e4b3", "#97cdd8"],

      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [t("data.lower-label"), t("data.normal"), t("data.upper-label")],
      },
      yaxis: {
        max: 100,
        title: {
          text: t("data.precipitation") + ' (%)',
           
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "%";
          }
        }
      }
    },
  };
console.log(data)
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

  for (const key in roundedProbabilities) {
    if (roundedProbabilities.hasOwnProperty(key)) {
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
      {week && <h5 className="text-center">{t("data.week")} {week}</h5>}
      <ReactApexChart options={data.options} series={data.series} type="bar" height={350} />
      <p className="text-center">
        {week
          ? t("data.forecast-sub-1a") + ` ${week} ` + t("data.forecast-sub-1b")
          : t("data.forecast-seasonal-1")}
        <span className="fw-medium"> {getMonthName(month)} </span>
        {t("data.forecast-2")}
        <span className="fw-medium"> {name} </span>
        {t("data.forecast-3")}{" "}
        <span className="fw-medium">
          {" "}
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