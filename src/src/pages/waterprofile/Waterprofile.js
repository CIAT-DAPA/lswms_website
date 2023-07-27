import React from "react";
import { useLocation } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import { Col, Container, Row } from "react-bootstrap";
import "./Waterprofile.css";
import { MapContainer, TileLayer } from "react-leaflet";
import WatershedContent from "../../components/watershedContent/WatershedContent";
import WaterpointContent from "../../components/waterpointContent/WaterpointContent";

function Waterprofile() {
  const location = useLocation();
  const idWater = location.state?.idWater;

  return (
    <div>
      {idWater ? (
        <>
          <div className="profile-bg">
            <Container className="container-profile">
              <Row className="text-white ">
                <Col className="col-12 text-center">
                  <h5 className="fw-medium">Oromia, Borona, Bake, Haro Bake</h5>
                  <h1 className="fw-normal my-4">Haro Bake</h1>
                  <p className="fw-normal">
                    Area: 34 ha <br /> Population: 120 <br /> 34.2523, 24.1231
                  </p>
                </Col>
              </Row>
            </Container>
          </div>
          <Container className="mt-3">
            <Row>
              <Col className="col-8">
                <h5 className="fw-medium">Map</h5>
                <MapContainer
                  center={[9.149175, 40.498867]}
                  zoom={5}
                  style={{
                    height: "400px",
                    width: "100%",
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>
                <WatershedContent/>
                <WaterpointContent/>
              </Col>
              <Col className="col-4">
                <h1>Aside</h1>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <div
          style={{ height: "100vh" }}
          className="d-flex justify-content-around flex-column align-items-center flex-lg-row"
        >
          <img src={img404} />
          <div>
            <h1>No water ID was provided.</h1>
            <p>Try to get the profile from the waterpoints display.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Waterprofile;
