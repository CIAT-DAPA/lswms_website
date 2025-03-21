import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import "./Menu.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/img/logo.png";
import { useAuth } from "../../hooks/useAuth";
import { IconLogin, IconLogout, IconUser } from "@tabler/icons-react";

function Menu() {
  const [t, i18n] = useTranslation("global");
  const [language, setLanguage] = useState(
    window.localStorage.getItem("language") || "en"
  );
  const { userInfo, login, logout } = useAuth();
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
      expand="xl"
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
          {t("menu.name")}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          className="justify-content-end  "
          id="responsive-navbar-nav"
        >
          <Nav className="justify-content-end align-items-lg-center">
            <Link className="nav-link text-black" to="/monitoring">
              {t("menu.monitoring")}
            </Link>
            <Link className="nav-link text-black" to="/forage">
              {t("menu.forage")}
            </Link>
            <Link className="nav-link text-black" to="/advisories">
              {t("menu.advisories")}
            </Link>
            <Link className="nav-link text-black" to="/rain">
              {t("monitoring.forecast")}
            </Link>
            <Link className="nav-link text-black" to="/aboutus">
              {t("menu.about-us")}
            </Link>

            <Dropdown
              as={ButtonGroup}
              className="d-block mb-2 ms-0 me-4 mt-1 mt-lg-0 mb-lg-0 ms-lg-2"
            >
              <Button
                variant="outline-secondary "
                size="sm"
                className="text-uppercase disabled "
              >
                {window.localStorage.getItem("language") || "es"}
              </Button>
              <Dropdown.Toggle
                variant="outline-secondary"
                split
                size="sm"
                id="dropdown-split-basic"
              />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleLanguageChange("en")}>
                  EN
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleLanguageChange("am")}>
                  AM
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleLanguageChange("or")}>
                  OR
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {userInfo ? (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="div"
                    className="nav-link py-0 dropdown-toggle-profile"
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="bg-black border border-5 rounded-circle d-flex flex-column justify-content-center align-items-center"
                      style={{ height: "45px", width: "45px" }}
                    >
                      <span className="fw-bold text-white">
                        {userInfo.name
                          .split(" ")
                          .slice(0, 2)
                          .map((word) => word.charAt(0))
                          .join("")}
                      </span>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/userprofile">
                      <IconUser className="me-2" />
                      {t("menu.profile")}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={logout}>
                      <Button variant="outline-danger" className="">
                        <IconLogout className="me-2" />
                        {t("menu.log-out")}
                      </Button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <Button onClick={login} variant="outline-primary">
                <IconLogin className="me-2" />
                {t("menu.log-in")}
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Menu;
