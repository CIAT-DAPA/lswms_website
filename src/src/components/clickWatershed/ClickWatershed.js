import React, { useState } from "react";
import "./ClickWatershed.css";
import { useMap, useMapEvents, Popup } from "react-leaflet";
import L from "leaflet";
import Configuration from "../../conf/Configuration";

function ClickWatershed() {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const [name, setName] = useState(null);

  useMapEvents({
    click: (e) => {
      const url = getFeatureInfoUrl(
        map,
        Configuration.get_url_geoserver(),
        "waterpoints_et:Watershed_boundaries",
        e.latlng,
        {
          info_format: "application/json",
          propertyName: "Name",
        }
      );

      fetch(url)
        .then((response) => response.text())
        .then((response) => {
          response = JSON.parse(response);
          setName(response?.features[0]?.properties?.Name);
          setPosition(e.latlng);
        });
    },
  });

  return position === null || name === undefined ? null : (
    <Popup
      position={position}
      onClose={() => setPosition(null)}
      className="forage-popup"
    >
      <div className="me-4">{name}</div>
    </Popup>
  );
}

function getFeatureInfoUrl(map, url, layers, latlng, params) {
  const point = map.latLngToContainerPoint(latlng, map.getZoom());
  const size = map.getSize();
  const bounds = map.getBounds();
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  const defaultParams = {
    request: "GetFeatureInfo",
    service: "WMS",
    srs: "EPSG:4326",
    styles: "",
    version: "1.1.1",
    format: "image/jpeg",
    bbox: [sw.lng, sw.lat, ne.lng, ne.lat].join(","),
    height: size.y,
    width: size.x,
    layers: layers,
    query_layers: layers,
    info_format: "text/html",
  };

  params = L.extend(defaultParams, params || {});
  params[params.version === "1.3.0" ? "i" : "x"] = point.x;
  params[params.version === "1.3.0" ? "j" : "y"] = point.y;

  return url + L.Util.getParamString(params, url, true);
}

export default ClickWatershed;
