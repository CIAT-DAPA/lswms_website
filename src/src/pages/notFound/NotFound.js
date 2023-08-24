import React from "react";
import img404 from "../../assets/img/404.png";

function NotFound() {
  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex justify-content-around flex-column align-items-center flex-lg-row"
    >
      <img src={img404} alt="" />
      <div>
        <h1>Oops! Looks like you've ventured into uncharted territory.</h1>
        <p>
          The page you are looking for could not be found on our digital map.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
