import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import "./Menu.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/img/logo.png";

function Menu() {
  const [t, i18n] = useTranslation("global");
  const [language, setLanguage] = useState(
    window.localStorage.getItem("language") || "en"
  );
  useEffect(() => {
    window.localStorage.setItem("language", language);
    i18n.changeLanguage(language);
  }, [language, i18n]);
  const handleLanguageChange = (language) => {
    setLanguage(language);
  };

  const [opacity, setOpacity] = useState(1);

  const changeNavbarOpacity = () => {
    if (window.scrollY >= 80) {
      setOpacity(0.3);
    } else {
      setOpacity(1);
    }
  };

  window.addEventListener("scroll", changeNavbarOpacity);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      style={{
        opacity: `${opacity}`,
      }}
      className="position-fixed w-100 menu p-0"
    >
      <Container className="py-1">
        <Navbar.Brand href="/" className="d-flex align-items-center gap-3">
          <img
            alt=""
            src={logo}
            width="35"
            height="35"
            className="d-inline-block align-top"
          />{" "}
          Waterpoint Monitoring System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          className="justify-content-end"
          id="responsive-navbar-nav"
        >
          <Nav className="justify-content-end">
            <Link className="nav-link text-black" to="/monitoring">
              {t("menu.monitoring")}
            </Link>
            <Link className="nav-link text-black" to="/aboutus">
              {t("menu.about-us")}
            </Link>
            {/* <Link className="nav-link text-black" to="/userprofile">
              User Profile
            </Link> */}
            <Dropdown as={ButtonGroup} className="d-block">
              <Button
                variant="outline-secondary"
                className="text-uppercase disabled"
              >
                {window.localStorage.getItem("language") || "es"}
              </Button>
              <Dropdown.Toggle
                variant="outline-secondary"
                split
                id="dropdown-split-basic"
              />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleLanguageChange("en")}>
                  EN
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleLanguageChange("am")}>
                  AM
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Menu;
