import React, { useState } from "react";
import "./Forage.css";
import {
  LayersControl,
  MapContainer,
  TileLayer,
  WMSTileLayer,
  ZoomControl,
} from "react-leaflet";
import {
  Modal, Spinner
} from "react-bootstrap";
import Configuration from "../../conf/Configuration";
import TimelineController from "../../components/timelineController/TimelineController";
import ClickWatershed from "../../components/clickWatershed/ClickWatershed";
import BiomassLegend from "../../components/biomassLegend/BiomassLegend";
import { useTranslation } from "react-i18next";

function Forage() {
  const [loading, setLoading] = useState(true); // Moved useState inside the component
  const [t] = useTranslation("global");
  return (
    <>
      <MapContainer
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
        />
        <ClickWatershed />
        <BiomassLegend layer="waterpoints_et:biomass" />
      </MapContainer>
      
    </>
  );
}
export default Forage;
