import React from "react";
import "./Simplelegend.css";
import greenImg from "../../assets/img/greenMarker.png";
import yellowImg from "../../assets/img/yellowMarker.png";
import brownImg from "../../assets/img/brownMarker.png";
import redImg from "../../assets/img/redMarker.png";
import grayImg from "../../assets/img/grayMarker.png";
import { useTranslation } from "react-i18next";

function Simplelegend() {
  const [t] = useTranslation("global");
  return (
    <div className="legendd bg-white px-4 py-3 rounded-4">
      <p className="fw-medium mb-3">{t("monitoring.legend")}</p>
      <div className="d-flex align-items-center mb-1">
        <img src={greenImg} alt="" className="me-1" />
        <p className="m-0">{t("monitoring.good")}</p>
      </div>
      <div className="d-flex align-items-center mb-1">
        <img src={yellowImg} alt="" className="me-1" />
        <p className="m-0">{t("monitoring.watch")}</p>
      </div>
      <div className="d-flex align-items-center mb-1">
        <img src={brownImg} alt="" className="me-1" />
        <p className="m-0">{t("monitoring.alert")}</p>
      </div>
      <div className="d-flex align-items-center mb-1">
        <img src={redImg} alt="" className="me-1" />
        <p className="m-0">{t("monitoring.near")}</p>
      </div>
    </div>
  );
}

export default Simplelegend;
