import React from "react";
import { useMap, useMapEvents } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import Configuration from "../../conf/Configuration";

function ClickWoreda({ onWoredaClick }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const url = getFeatureInfoUrl(
        map,
        Configuration.get_adm_level_url_geoserver(),
        "administrative:et_adm3_wp",
        e.latlng,
        {
          info_format: "application/json",
          propertyName: "ADM3_EN,ADM3_PCODE",
        }
      );

      axios.get(url).then((response) => {
        const feature = response.data.features[0];

        if (feature) {
          const woredaName = feature.properties.ADM3_EN;
          const woredaCode = feature.properties.ADM3_PCODE;
          onWoredaClick(woredaName, woredaCode);
        } else {
          console.warn("No features found at the clicked location.");
        }
      }).catch((error) => {
        console.error("Error fetching Woreda data:", error);
      });
    },
  });

  return null;
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
    info_format: "application/json",
  };

  params = L.extend(defaultParams, params || {});
  params[params.version === "1.3.0" ? "i" : "x"] = point.x;
  params[params.version === "1.3.0" ? "j" : "y"] = point.y;

  return url + L.Util.getParamString(params, url, true);
}

export default ClickWoreda;
