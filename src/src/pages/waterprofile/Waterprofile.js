import React from "react";
import { useLocation } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import downloadImg from "../../assets/svg/download.svg";
import emailImg from "../../assets/svg/email.svg";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./Waterprofile.css";
import { MapContainer, TileLayer } from "react-leaflet";
import WatershedContent from "../../components/watershedContent/WatershedContent";
import WaterpointContent from "../../components/waterpointContent/WaterpointContent";
import WaterpointItem from "../../components/waterpointItem/WaterpointItem";

function Waterprofile() {
  const location = useLocation();
  const idWater = location.state?.idWater;

  var tableContent = {
    district: "Haro",
    kebele: "Bake",
    region: "Borona",
    zone: "Oromia",
  };

  var listSeasonContent = {
    id: 1,
    content: {
      title: "Seasons",
      type: String,
      language: "En",
      values: {
        Bega: "December to February",
        Belg: "March to May",
        Kiremt: "June to August",
        Meher: "September to November",
      },
    },
    type_content: {
      name: "Watershred",
    },
  };

  var listSourcesContent = {
    id: 1,
    content: {
      title: "Water Sources",
      type: String,
      language: "En",
      values: {
        0: "Traditional Wells or Singing Wells (“Tullas”)",
        1: "Spring Fed Ponds",
        2: "Open Surface Ponds (“Harros”)",
        3: "Unprotected Perennial and Seasonal Springs",
        4: "Scoop Wells on Sandy Rivers",
        5: "Shallow Wells (“Addadis”)",
      },
    },
    type_content: {
      name: "Watershred",
    },
  };

  var lsContent = {
    id: 1,
    content: {
      title: "Livestock",
      type: String,
      language: "En",
      values: {
        Cow: "23",
        Donkey: "12",
        Sheep: "43",
      },
    },
    type_content: {
      name: "Agriculture context",
    },
  };

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
              <Col className="col-12 col-md-8">
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
                <WatershedContent />
                <WaterpointContent />
              </Col>
              <Col className="col-12 col-md-4">
                <WaterpointItem
                  item={tableContent}
                  type="table"
                  title="Watershed description"
                />
                <WaterpointItem item={listSeasonContent} type="list" />
                <WaterpointItem item={listSourcesContent} type="list" />

                <WaterpointItem
                  item={tableContent}
                  type="table"
                  title="Waterpoint description"
                />
                <WaterpointItem item={lsContent} align="y" type="icon" />
              </Col>
            </Row>
            <div className="mb-5 mt-4">
              <Button className="me-5 rounded-4 ">
                <img src={downloadImg} alt="" className="me-3" />
                Download profile
              </Button>
              {/* <Button disabled={true}>
                <img src={emailImg} className="me-3" />
                Send profile
              </Button> */}
            </div>
          </Container>
        </>
      ) : (
        <div
          style={{ height: "100vh" }}
          className="d-flex justify-content-around flex-column align-items-center flex-lg-row"
        >
          <img src={img404} alt=""/>
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
