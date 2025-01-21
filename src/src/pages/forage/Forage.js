import React, { useEffect, useRef, useState } from "react";
import "./Forage.css";
import {
  LayersControl,
  MapContainer,
  TileLayer,
  WMSTileLayer,
  ZoomControl,
} from "react-leaflet";
import Configuration from "../../conf/Configuration";
import TimelineController from "../../components/timelineController/TimelineController";
import ClickWatershed from "../../components/clickWatershed/ClickWatershed";
import BiomassLegend from "../../components/biomassLegend/BiomassLegend";
import ClickWoreda from "../../components/clickWoreda/ClickWoreda";
import ForageModal from "../../components/forageModal/ForageModal";
import axios from "axios";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { IconDownload } from "@tabler/icons-react";
import html2canvas from "html2canvas";

function Forage() {
  const [t] = useTranslation("global");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [woredaInfo, setWoredaInfo] = useState({});
  const [biomassData, setBiomassData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [selectedTimestamp, setSelectedTimestamp] = useState(null);

  const handleTimelineChange = (newTimestamp) => {
    setSelectedTimestamp(newTimestamp);
  };

  const downloadMapAsJpg = async () => {
    try {
      const html = document.querySelector("#map");
      const canvas = await html2canvas(html, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        ignoreElements: (element) => {
          return element.classList?.contains("exclude");
        },
      });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "map_pasture.jpg";
      link.click();
    } catch (error) {
      console.error("Error al descargar el mapa como JPG:", error);
    }
  };

  const handleWoredaClick = async (woredaName, extId) => {
    if (!selectedTimestamp) {
      console.warn("No timestamp selected");
      return;
    }

    setLoading(true);

    try {
      const meanResponse = await axios.get(
        `${Configuration.get_url_api_base()}/biomass_mean`,
        { params: { extId, timestamp: selectedTimestamp } }
      );

      const biomassResponse = await axios.get(
        `${Configuration.get_url_api_base()}/biomass_trend`,
        { params: { extId } }
      );

      const forecastResponse = await axios.get(
        `${Configuration.get_url_api_base()}/biomass_forecast`,
        { params: { extId } }
      );

      setWoredaInfo({
        name: woredaName,
        meanBiomass: meanResponse.data.meanBiomass,
        timestamp: selectedTimestamp,
      });

      setBiomassData(biomassResponse.data);
      setForecastData(forecastResponse.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <MapContainer
        id="map"
        center={[9.149175, 40.498867]}
        zoom={6}
        style={{
          height: "100vh",
          width: "100%",
        }}
        className="map-monitoring"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayersControl position="topright">
          <LayersControl.Overlay name={t("forage.show-woredas")} checked>
            <WMSTileLayer
              url={Configuration.get_adm_level_url_geoserver()}
              layers={`administrative:et_adm3_wp`}
              format="image/png"
              transparent={true}
            />
          </LayersControl.Overlay>

          <LayersControl.Overlay name={t("forage.show")} checked>
            <WMSTileLayer
              url={Configuration.get_url_geoserver()}
              layers={`waterpoints_et:Watershed_boundaries`}
              format="image/png"
              transparent={true}
            />
          </LayersControl.Overlay>
        </LayersControl>
        <ZoomControl position="topright" />
        <TimelineController
          dimensionName="time"
          layer="waterpoints_et:biomass"
          onTimeChange={handleTimelineChange}
        />
        <ClickWoreda onWoredaClick={handleWoredaClick} />
        <ClickWatershed />
        <BiomassLegend layer="waterpoints_et:biomass" />
        <Button
          id="btn-download-map"
          className="btn-light rounded-4 exclude"
          onClick={() => downloadMapAsJpg()}
        >
          <IconDownload size={20} />
        </Button>
      </MapContainer>

      <Modal
        show={loading}
        backdrop="static"
        keyboard={false}
        centered
        size="sm"
      >
        <Modal.Body className="d-flex align-items-center">
          <Spinner animation="border" role="status" className="me-2" />
          {t("forage.loading-woreda")}
        </Modal.Body>
      </Modal>

      <ForageModal
        showModal={showModal}
        handleClose={handleCloseModal}
        woredaInfo={woredaInfo}
        biomassData={biomassData}
        forecastData={forecastData}
      />
    </>
  );
}
export default Forage;
