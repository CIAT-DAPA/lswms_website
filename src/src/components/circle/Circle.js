import React from "react";
import "./Circle.css";

function Circle({ percentage, img, color, gender }) {
  const circleClass =
    color.toLowerCase() === "agriculture context livestock"
      ? "cyan"
      : color.toLowerCase() === "agriculture context crops"
      ? "yellow"
      : color.toLowerCase() === "gender" && gender === "male"
      ? "blue"
      : color.toLowerCase() === "gender" && gender === "female"
      ? "pink"
      : "green";

  return (
    <div className="single-chart me-1">
      <svg viewBox="0 0 36 36" className={`circular-chart ${circleClass}`}>
        <path
          className="circle-bg"
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="circle"
          strokeDasharray={`${percentage}, 100`}
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <image x="8" y="8" width="20" height="20" href={img} />
      </svg>
    </div>
  );
}

export default Circle;
