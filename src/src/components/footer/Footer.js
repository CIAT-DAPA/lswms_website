import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import partner1 from "../../assets/img/partner1.png";
import partner2 from "../../assets/img/partner2.png";
import partner3 from "../../assets/img/partner3.png";
import partner4 from "../../assets/img/partner4.png";
import partner5 from "../../assets/img/partner5.png";
import "./Footer.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Footer() {
  const [t] = useTranslation("global");
  return (
    <footer>
      <Container>
        <Row className="justify-content-between align-items-center py-3">
          <Col className="col-lg-4">
            <p className="">{t("footer.rights")}</p>
            {t("footer.email")}:
            <br />
            <ul>
              <li>
                <a
                  href="mailto: S.alemayehu@cgiar.org"
                  className="text-decoration-none text-white"
                >
                  S.alemayehu@cgiar.org{" "}
                </a>
              </li>
              <li>
                <a
                  href="mailto: liyenew@gmail.com"
                  className="text-decoration-none text-white"
                >
                  Liyenew@gmail.com{" "}
                </a>
              </li>
            </ul>
            <Link className="nav-link" to="/privacy">
              Privacy Information
            </Link>
          </Col>

          <Col className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-3 d-lg-block col-lg-auto mt-lg-0">
            <p>{t("footer.partners")}:</p>
            <img
              src={partner1}
              alt="partner EIAR"
              className="me-3 mb-2 mb-md-0"
            />
            <img
              src={partner5}
              alt="partner CGIAR"
              className="mx-3 my-2 my-md-0"
            />
            <img
              src={partner2}
              alt="partner Alliance"
              className="mx-3 my-2 my-md-0"
            />
            <img
              src={partner4}
              alt="partner Minister"
              className="mx-3 my-2 my-md-0"
            />
            <img
              src={partner3}
              alt="partner Bill & Melinda Gates"
              className="mx-3 my-2 my-md-0"
            />
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
