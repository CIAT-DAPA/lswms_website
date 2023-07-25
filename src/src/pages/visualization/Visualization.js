import React from "react";
import { Col, Row } from "react-bootstrap";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
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
            <h6>Waterpoint ET101 Overview</h6>
            <Row>
              <Col>Name:</Col>
              <Col>ET101</Col>
            </Row>
            <Row>
              <Col>Name:</Col>
              <Col>ET101</Col>
            </Row>
            <Row>
              <Col>Name:</Col>
              <Col>ET101</Col>
            </Row>
            <Row>
              <Col>Name:</Col>
              <Col>ET101</Col>
            </Row>
            <Row>
              <Col>
                <a
                  className="btn btn-primary text-white rounded-5 fw-medium"
                  href=""
                >
                  Profile
                </a>
              </Col>
              <Col>
                <a
                  className="btn btn-primary text-white rounded-5 fw-medium"
                  href=""
                >
                  Data
                </a>
              </Col>
            </Row>
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
}

export default Visualization;
