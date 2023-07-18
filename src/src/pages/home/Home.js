import React from "react";
import "./Home.css";
import { Col, Container, Row } from "react-bootstrap";
import feature1 from "../../assets/img/feature1.png";
import feature2 from "../../assets/img/feature2.png";
import feature3 from "../../assets/img/feature3.png";
import feature4 from "../../assets/img/feature4.png";
import Feature from "../../components/feature/Feature";
function Home() {
  return (
    <div>
      <div className="header-bg">
        <Container className="container-header">
          <Row className="justify-content-between flex-column flex-md-row">
            <Col className="col-12 col-md-7 col-lg-5 d-flex flex-column gap-2 mb-5 mb-md-0">
              <h1 className="fw-medium" style={{ lineHeight: "125%" }}>
                Making informed decisions
              </h1>
              <p className="fw-normal" style={{ lineHeight: "138%" }}>
                Empowering vital decisions to make the right water management
                choices for you.
              </p>
              <a
                className="btn btn-primary text-white rounded-5 py-2 px-4 fw-medium"
                style={{ width: "fit-content" }}
              >
                Check waterpoints
              </a>
            </Col>
            <Col className="col-12 col-md-5 col-lg-5 d-flex flex-column gap-2">
              <h5 className="fw-medium">
                We also change the lives of pastoralists.
              </h5>
              <p className="fw-normal" style={{ lineHeight: "138%" }}>
                Empowering pastoralist communities with access to information,
                find out how we are changing their reality.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
 
        <Row className="g-0">
          <Feature
            title="Interactive Map"
            description="Explore our interactive map and view the location of each waterpoint in Ethiopia. Get detailed data on existing infrastructure."
            image={feature1}
            color="blue"
          ></Feature>
          <Feature
            title="Updated Statistics and Data"
            description="Access up-to-date statistics and key data on water access in pastoralist communities. Get detailed information on the current status of water points, water supply and priority needs."
            image={feature2}
            color="white"
          ></Feature>
          <Feature
            title="Resources for Decision-Making"
            description="Access a wide range of relevant resources, reports and studies to support informed waterpoint decision-making. Find technical information and comparative analysis"
            image={feature3}
            color="blue"
          ></Feature>
          <Feature
            title="Historical data"
            description="Discover various historical data such as rainfall, evapotranspiration and water levels."
            image={feature4}
            color="white"
          ></Feature>
        </Row>
    </div>
  );
}

export default Home;
