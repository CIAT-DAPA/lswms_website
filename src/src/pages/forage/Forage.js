import React, { useRef, useEffect } from "react";
import "./Forage.css";
import {
  LayersControl,
  MapContainer,
  TileLayer,
  WMSTileLayer,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet-timedimension";
import Configuration from "../../conf/Configuration";

function Forage() {
  const mapRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const map = mapRef.current;
      const wmsLayer = L.tileLayer.wms(
        "https://geo.aclimate.org/geoserver/agroclimate_indices_ao/wms",
        {
          layers: "agroclimate_indices_ao:coffee_number_dry_days",
          format: "image/png",
          transparent: true,
        }
      );
      // Add WMS layer to the layer group
      wmsLayer.addTo(map);
    }, 500); // 500ms delay
  }, []);

  return (
    <>
      <MapContainer
        center={[9.149175, 40.498867]}
        zoom={4}
        style={{
          height: "100vh",
          width: "100%",
        }}
        className="map-monitoring"
        zoomControl={false}
        ref={mapRef}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayersControl position="topright">
          <LayersControl.Overlay name="Show watershred" checked>
            <WMSTileLayer
              url={Configuration.get_url_geoserver()}
              layers={`waterpoints_et:Watershed_boundaries`}
              format="image/png"
              transparent={true}
              zIndex={1000}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
}

export default Forage;
