import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Col, Row, Table } from "react-bootstrap";
import download from "../../assets/svg/download.svg"
function Visualization() {
  return (
    <>
        <Col className="position-absolute rounded-5 col-5 p-3 bg-body text-center" style={{ zIndex: "1000", top: "90px", right: "10px" }}>
          <table className="w-100" >
            <thead>
              <tr>
                <th>Name</th>
                <th>Depth (%)</th>
                <th>Median depth (%)</th>
                <th>Area (ha)</th>
                <th><img src={download} alt="download all"/></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
            </tbody>
          </table>
        </Col>
      <MapContainer
        center={[9.145, 40.489]}
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
      </MapContainer>
    </>
  );
}

export default Visualization;
