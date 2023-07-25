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
                href=""
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
        <div className="divider">
          <div class="scroll-down-link scroll-down-arrow"></div>
        </div>
      </div>

      <Row className="g-0">
        <Feature
          title="Interactive Map"
          description="Explore our interactive map and view the location of each waterpoint in Ethiopia. Get detailed data on existing infrastructure."
          image={feature1}
          color="blue"
        ></Feature>
        <Feature
          title="Waterpoint overview"
          description="Discover the past and future of water. Access historical waterpoint, temperature and rainfall data, along with forecasts for smarter and more efficient management."
          image={feature2}
          color="white"
        ></Feature>
        <Feature
          title="Dashboard waterpoint"
          description="Our Dashboard provides real-time information on waterpoints and resources for effective decisions. Decide with confidence!"
          image={feature3}
          color="blue"
        ></Feature>
        <Feature
          title="Routes"
          description="Find your way to the water! With our routing module, getting to the waterpoint has never been easier."
          image={feature4}
          color="white"
        ></Feature>
      </Row>
    </div>
  );
}

export default Home;
