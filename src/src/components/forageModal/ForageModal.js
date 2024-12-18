import React, { useState, useEffect } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import ForageLineChart from "../forageLineChart/ForageLineChart";
import "./ForageModal.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useTranslation } from "react-i18next";

const ForageModal = ({
  showModal,
  handleClose,
  woredaInfo,
  biomassData,
  forecastData,
}) => {
  const [t] = useTranslation("global");

  const [dateRange, setDateRange] = useState([0, 0]);
  useEffect(() => {
    if (biomassData.length > 0) {
      setDateRange([0, biomassData.length - 1]);
    }
  }, [biomassData]);

  const getStatusInfo = (meanBiomass) => {
    if (meanBiomass > 4)
      return { color: "#267300", label: t("forage.label-ext-high") };
    if (meanBiomass > 3)
      return { color: "#70A800", label: t("forage.label-very-high") };
    if (meanBiomass > 2)
      return { color: "#98E600", label: t("forage.label-high") };
    if (meanBiomass > 1)
      return { color: "#E9FFBE", label: t("forage.label-medium") };
    if (meanBiomass > 0.5)
      return { color: "#FFD37F", label: t("forage.label-low") };
    if (meanBiomass > 0)
      return { color: "#A87000", label: t("forage.label-very-low") };
    return { color: "#FFFFFF", label: t("forage.label-no-data") };
  };

  const { color, label } = getStatusInfo(woredaInfo.meanBiomass);

  const filteredBiomassData = biomassData.slice(dateRange[0], dateRange[1] + 1);

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {t("forage.woreda-detail")}: {woredaInfo.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="woreda-info">
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="woreda-info" className="tab-header">
                {t("forage.woreda-info")}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="biomass-trend" className="tab-header">
                {t("forage.biomass-trend")}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="biomass-forecast" className="tab-header">
                {t("forage.biomass-forecast")}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="woreda-info">
              <div className="margin-top">
                <p>
                  <strong>{t("forage.woreda")}:</strong> {woredaInfo.name}
                </p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p
                    style={{
                      margin: 0,
                      paddingRight: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("forage.biomass")} (t/ha): {woredaInfo.meanBiomass}
                  </p>
                  <button
                    style={{
                      backgroundColor: color,
                      color: "#fff",
                      border: "none",
                      padding: "5px 15px",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      height: "100%",
                    }}
                  >
                    {label}
                  </button>
                </div>
                <p></p>
                <p>
                  <strong>{t("monitoring.date")}:</strong>{" "}
                  {woredaInfo.timestamp}
                </p>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="biomass-trend">
              <div className="margin-top">
                <h6>{t("forage.select-date")}</h6>
                <Slider
                  range
                  min={0}
                  max={biomassData.length - 1}
                  value={dateRange}
                  onChange={setDateRange}
                />
                <ForageLineChart
                  data={filteredBiomassData}
                  title={`${t("forage.biomass-trend")} ${woredaInfo.name}`}
                />
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="biomass-forecast">
              <div className="margin-top">
                <ForageLineChart
                  data={forecastData}
                  title={`${t("forage.biomass-forecast")} ${woredaInfo.name}`}
                />
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default ForageModal;
