import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import Configuration from "../../conf/Configuration";
import { centroid } from "@turf/turf";
import L from "leaflet";

// Componente para actualizar la vista del mapa
const MapUpdater = ({ center, timestamp }) => {
  const map = useMap();
  const wmsLayerRef = useRef(null);

  useEffect(() => {
    if (wmsLayerRef.current) {
      map.removeLayer(wmsLayerRef.current);
    }

    const formattedTime = new Date(timestamp).toISOString();

    const wmsLayer = L.tileLayer.wms(Configuration.get_url_geoserver(), {
      layers: "waterpoints_et:biomass",
      format: "image/png",
      transparent: true,
      crs: L.CRS.EPSG4326,
      version: "1.1.1",
      time: formattedTime,
      zIndex: 1,
    });

    wmsLayer.addTo(map);
    wmsLayerRef.current = wmsLayer;

    return () => {
      if (wmsLayerRef.current) {
        map.removeLayer(wmsLayerRef.current);
      }
    };
  }, [timestamp, map]);

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

function WoredaMap({ woreda }) {
  const [center, setCenter] = useState([9.149175, 40.498867]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCentroid = async () => {
      try {
        const wfsUrl = `${Configuration.get_adm_level_url_geoserver()}/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=administrative:et_adm3_wp&cql_filter=ADM3_EN='${
          woreda.name
        }'&outputFormat=application/json`;

        const response = await fetch(wfsUrl);
        const data = await response.json();

        if (data.features?.length > 0) {
          const geometry = data.features[0].geometry;
          const featureCentroid = centroid(geometry).geometry.coordinates;
          setCenter([featureCentroid[1], featureCentroid[0]]); // [lat, lng]
        }
      } catch (error) {
        console.error("Error fetching centroid:", error);
      } finally {
        setLoading(false);
      }
    };

    if (woreda?.name) {
      fetchCentroid();
    }
  }, [woreda]);

  if (loading) return <div>Cargando mapa...</div>;

  return (
    <MapContainer
      id="map-modal"
      center={center}
      zoom={6}
      style={{
        height: "200px",
        width: "100%",
      }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <WMSTileLayer
        url={`${Configuration.get_adm_level_url_geoserver()}`}
        layers={`administrative:et_adm3_wp`}
        format="image/png"
        cql_filter={`ADM3_EN='${woreda.name}'`}
        transparent={true}
        zIndex={2}
      />
      <ZoomControl position="topright" />
      <MapUpdater center={center} timestamp={woreda.timestamp} />
    </MapContainer>
  );
}

export default WoredaMap;
