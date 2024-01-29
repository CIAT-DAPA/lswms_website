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
        <footer className="py-5">
          <div className="row">
            <div className="col-5 col-sm-6 col-md-2 mb-3">
              <h5>Sections</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2 item-footer">
                  <Link className="nav-link text-white" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item mb-2 item-footer">
                  <Link className="nav-link text-white" to="/monitoring">
                    {t("menu.monitoring")}
                  </Link>
                </li>
                <li className="nav-item mb-2 item-footer">
                  <Link className="nav-link text-white" to="/forage">
                    {t("menu.forage")}
                  </Link>
                </li>
                <li className="nav-item mb-2 item-footer">
                  <Link className="nav-link text-white" to="/aboutus">
                    {t("menu.about-us")}
                  </Link>
                </li>
                <li className="nav-item mb-2  item-footer">
                  <Link className="nav-link text-white" to="/privacy">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-5 col-sm-6 col-md-2 mb-3">
              <h5>{t("footer.email")}</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2 item-footer">
                  <a
                    href="mailto: S.alemayehu@cgiar.org"
                    className="nav-link text-white "
                  >
                    S.alemayehu@cgiar.org{" "}
                  </a>
                </li>
                <li className="nav-item mb-2 item-footer">
                  <a
                    href="mailto: liyenew@gmail.com"
                    className="nav-link text-white "
                  >
                    Liyenew@gmail.com{" "}
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-md-5 offset-md-2 mb-3">
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
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
            {/* <p>{t("footer.rights")}.</p> */}
          </div>
        </footer>
      </Container>
    </footer>
  );
}

export default Footer;
