import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import profileIcon from "../../assets/svg/profile.svg";
import dataIcon from "../../assets/svg/data.svg";
import { Link } from "react-router-dom";
import "./Visualization.css";

function Visualization() {
  const position = [5.7836361, 36.5623082];
  const customIcon = new L.Icon({
    iconUrl: require(`../../assets/img/greenMarker.png`),
    iconSize: [32, 32],
  });
  return (
    <>
      <MapContainer
        center={[9.149175, 40.498867]}
        zoom={5}
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div>
              <h6 className="fw-medium">Waterpoint ET101 Overview</h6>
            </div>
            <table className="fs-6">
              <tbody>
                <tr>
                  <td>Name:</td>
                  <td>
                    <div className="td-name text-center fw-medium ">ET101</div>
                  </td>
                </tr>
                <tr>
                  <td>Depth (%):</td>
                  <td>65</td>
                </tr>
                <tr>
                  <td>Median Depth (%):</td>
                  <td>79.4</td>
                </tr>
                <tr>
                  <td>Area (ha):</td>
                  <td>7.5</td>
                </tr>
              </tbody>
            </table>
            <div className="d-flex justify-content-between mt-3">
              <Link
                type="button"
                className="btn btn-primary text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-3 py-2"
                to="/waterprofile"
                state={{ idWater: "occupation" }}
              >
                <img src={profileIcon} alt="" className="me-3" />
                Profile
              </Link>

              <Link
                type="button"
                className="btn btn-primary text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-3 py-2"
                to="/historicaldata"
              >
                <img src={dataIcon} alt="" className="me-3" />
                Data
              </Link>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
}

export default Visualization;
