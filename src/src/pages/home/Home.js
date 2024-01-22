import React from "react";
import "./Home.css";
import { Col, Container, Row } from "react-bootstrap";
import feature1 from "../../assets/img/feature1.png";
import feature2 from "../../assets/img/feature2.png";
import feature3 from "../../assets/img/feature3.png";
import feature4 from "../../assets/img/feature4.png";
import feature5 from "../../assets/img/feature5.png";
import Feature from "../../components/feature/Feature";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Home() {
  const [t] = useTranslation("global");
  return (
    <div>
      <div className="header-bg">
        <Container className="container-header">
          <Row className="justify-content-between flex-column flex-md-row">
            <Col className="col-12 col-md-7 col-lg-5 d-flex flex-column gap-2 mb-5 mb-md-0">
              <h1 className="fw-medium" style={{ lineHeight: "125%" }}>
                {t("home.title")}
              </h1>
              <p className="fw-normal" style={{ lineHeight: "138%" }}>
                {t("home.title-description")}
              </p>
              <Link
                type="button"
                className="btn btn-primary text-white rounded-5 py-2 px-4 fw-medium"
                style={{ width: "fit-content" }}
                to="/monitoring"
              >
                {t("home.button")}
              </Link>
            </Col>
            <Col className="col-12 col-md-5 col-lg-5 d-flex flex-column gap-2">
              <h5 className="fw-medium">{t("home.title2")}</h5>
              <p className="fw-normal" style={{ lineHeight: "138%" }}>
                {t("home.title2-description")}
              </p>
            </Col>
          </Row>
        </Container>
        <div className="divider">
          <div className="scroll-down-link scroll-down-arrow"></div>
        </div>
      </div>

      <Row className="g-0">
        <Feature
          title={t("home.feature1")}
          description={t("home.feature1-description")}
          image={feature1}
          color="blue"
        ></Feature>
        <Feature
          title={t("home.feature2")}
          description={t("home.feature2-description")}
          image={feature2}
          color="white"
        ></Feature>
        <Feature
          title={t("home.feature3")}
          description={t("home.feature3-description")}
          image={feature3}
          color="blue"
        ></Feature>
        <Feature
          title={t("home.feature4")}
          description={t("home.feature4-description")}
          image={feature4}
          color="white"
        ></Feature>
        <Feature
          title="Forage Module"
          description="The forage module is a tool that allows users to monitor forage production and see how it changes over time."
          image={feature5}
          color="blue"
        ></Feature>
      </Row>
    </div>
  );
}

export default Home;
