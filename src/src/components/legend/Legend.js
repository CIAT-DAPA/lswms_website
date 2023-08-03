import React from "react";
import "./Legend.css";
import greenImg from "../../assets/img/greenMarker.png";
import yellowImg from "../../assets/img/yellowMarker.png";
import brownImg from "../../assets/img/brownMarker.png";
import redImg from "../../assets/img/redMarker.png";
import grayImg from "../../assets/img/grayMarker.png";

function Legend() {
  return (
    <div className="legend bg-white px-4 py-3 rounded-4">
      <p className="fw-medium mb-3">Legend</p>
      <div className="d-flex align-items-center mb-1">
        <img src={greenImg} alt="" className="me-1" />
        <p className="m-0">Good</p>
      </div>
      <div className="d-flex align-items-center mb-1">
        <img src={yellowImg} alt="" className="me-1" />
        <p className="m-0">Watch</p>
      </div>
      <div className="d-flex align-items-center mb-1">
        <img src={brownImg} alt="" className="me-1" />
        <p className="m-0">Alert</p>
      </div>
      <div className="d-flex align-items-center mb-1">
        <img src={redImg} alt="" className="me-1" />
        <p className="m-0">Near-dry</p>
      </div>
      <div className="d-flex align-items-center mb-1">
        <img src={grayImg} alt="" className="me-1" />
        <p className="m-0">Seasonally-dry</p>
      </div>
    </div>
  );
}

export default Legend;
