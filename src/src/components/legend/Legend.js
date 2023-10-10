import React from "react";
import "./Legend.css";
import greenImg from "../../assets/img/greenMarker.png";
import yellowImg from "../../assets/img/yellowMarker.png";
import brownImg from "../../assets/img/brownMarker.png";
import redImg from "../../assets/img/redMarker.png";
import grayImg from "../../assets/img/grayMarker.png";
import { useTranslation } from "react-i18next";

function Legend({ setFilter, filter }) {
  const [t, i18n] = useTranslation("global");
  return (
    <div className="legend bg-white px-4 py-3 rounded-4">
      <p className="fw-medium mb-3">{t("monitoring.legend")}</p>
      <div
        className={`d-flex align-items-center mb-1 ${
          filter.green ? "" : "text-decoration-line-through opacity-75"
        }`}
        onClick={() => setFilter({ ...filter, green: !filter.green })}
      >
        <img src={greenImg} alt="" className="me-1" />
        <p className="m-0">{t("monitoring.good")}</p>
      </div>
      <div
        className={`d-flex align-items-center mb-1 ${
          filter.yellow ? "" : "text-decoration-line-through opacity-75"
        }`}
        onClick={() => setFilter({ ...filter, yellow: !filter.yellow })}
      >
        <img src={yellowImg} alt="" className="me-1" />
        <p className="m-0">{t("monitoring.watch")}</p>
      </div>
      <div
        className={`d-flex align-items-center mb-1 ${
          filter.brown ? "" : "text-decoration-line-through opacity-75"
        }`}
        onClick={() => setFilter({ ...filter, brown: !filter.brown })}
      >
        <img src={brownImg} alt="" className="me-1" />
        <p className="m-0">{t("monitoring.alert")}</p>
      </div>
      <div
        className={`d-flex align-items-center mb-1 ${
          filter.red ? "" : "text-decoration-line-through opacity-75"
        }`}
        onClick={() => setFilter({ ...filter, red: !filter.red })}
      >
        <img src={redImg} alt="" className="me-1" />
        <p className="m-0">{t("monitoring.near")}</p>
      </div>
      <div
        className={`d-flex align-items-center mb-1 ${
          filter.gray ? "" : "text-decoration-line-through opacity-75"
        }`}
        onClick={() => setFilter({ ...filter, gray: !filter.gray })}
      >
        <img src={grayImg} alt="" className="me-1" />
        <p className="m-0">{t("monitoring.seasonally")}</p>
      </div>
    </div>
  );
}

export default Legend;
