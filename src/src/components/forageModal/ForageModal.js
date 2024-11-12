import React, { useState, useEffect } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import ForageLineChart from "../forageLineChart/ForageLineChart";
import './ForageModal.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const getStatusInfo = (meanBiomass) => {
  if (meanBiomass > 4) return { color: "#267300", label: "Extremely High" };
  if (meanBiomass > 3) return { color: "#70A800", label: "Very High" };
  if (meanBiomass > 2) return { color: "#98E600", label: "High" };
  if (meanBiomass > 1) return { color: "#E9FFBE", label: "Medium" };
  if (meanBiomass > 0.5) return { color: "#FFD37F", label: "Low" };
  if (meanBiomass > 0) return { color: "#A87000", label: "Very Low" };
  return { color: "#FFFFFF", label: "No Data" };
};

const ForageModal = ({ showModal, handleClose, woredaInfo, biomassData, forecastData }) => {
  const { color, label } = getStatusInfo(woredaInfo.meanBiomass);
  const [dateRange, setDateRange] = useState([0, 0]);
  useEffect(() => {
    if (biomassData.length > 0) {
      setDateRange([0, biomassData.length - 1]); 
    }
  }, [biomassData]);

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
        <Modal.Title>Woreda Details: {woredaInfo.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="woreda-info">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="woreda-info" className="tab-header">Woreda Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="biomass-trend" className="tab-header">Biomass Trend</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="biomass-forecast" className="tab-header">Biomass Forecast</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
            <Tab.Pane eventKey="woreda-info">
            <div className="margin-top">
            <p><strong>Woreda:</strong> {woredaInfo.name}</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ margin: 0, paddingRight: "10px", fontWeight: "bold" }}>
                Biomass (t/ha): {woredaInfo.meanBiomass}
              </p>
              <button 
                style={{
                  backgroundColor: color, 
                  color: "#fff",
                  border: "none", 
                  padding: "5px 15px", 
                  borderRadius: "5px",
                  fontWeight: "bold",
                  height: "100%"  
                }}
              >
                {label}
              </button>
            </div>
            <p></p>
            <p><strong>Date:</strong> {woredaInfo.timestamp}</p>
            </div>
          </Tab.Pane>
            <Tab.Pane eventKey="biomass-trend">
            <div className="margin-top">
                <h6>Select Date Range</h6>
                <Slider 
                  range 
                  min={0} 
                  max={biomassData.length - 1} 
                  value={dateRange} 
                  onChange={setDateRange} 
                 
                />
                <ForageLineChart data={filteredBiomassData} title={`Biomass Trend for ${woredaInfo.name}`}   />
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="biomass-forecast">
            <div className="margin-top">
              <ForageLineChart data={forecastData} title={`Biomass Forecast for ${woredaInfo.name}`}  />
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default ForageModal;
