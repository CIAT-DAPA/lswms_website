import React, { useRef, useEffect } from "react";
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

function Forage() {
  const wmsLayerRef = useRef();

  useEffect(() => {
    if (wmsLayerRef.current) {
      const leafletLayer = wmsLayerRef.current.leafletElement;
      leafletLayer.bringToFront();
    }
  }, []);
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
          <LayersControl.Overlay name="Show watershred" checked>
            <WMSTileLayer
              ref={wmsLayerRef}
              url={Configuration.get_url_geoserver()}
              layers={`waterpoints_et:Watershed_boundaries`}
              format="image/png"
              transparent={true}
              zIndex={10}
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
