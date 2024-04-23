import React, { useState, useEffect } from "react";
import { Marker, Tooltip, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "./WpLabel.css";

function WpLabel({ waterpoints }) {
  
  const [zoom, setZoom] = useState(6);
  const map = useMapEvents({
    zoomend: () => {
      const zoomLevel = map.getZoom();
      setZoom(zoomLevel);
    },
  });

  const invisibleIcon = new L.DivIcon({
    className: "invisible-icon",
    iconSize: [20, 20],
  });

  return (
    <>
  {zoom > 1 && waterpoints && waterpoints.length > 0 &&
    waterpoints.map((wp, i) => (
      <Marker key={i} position={[wp.lat, wp.lon]} icon={invisibleIcon}>
        <Tooltip permanent>{wp.name}</Tooltip>
      </Marker>
    ))
  }
</>

  );
}

export default WpLabel;
