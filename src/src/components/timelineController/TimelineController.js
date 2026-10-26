import React, { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-timedimension";
import Configuration from "../../conf/Configuration";
import axios from "axios";
import { Modal, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function TimelineController({ dimensionName, layer, onTimeChange }) {
  const [t] = useTranslation("global");

  const map = useMap();
  const timeDimensionControlRef = useRef(null);
  const [loaded, setLoaded] = useState(true);
  const wmsLayerRef = useRef(null);

  L.Control.TimeDimensionCustom = L.Control.TimeDimension.extend({
    _getDisplayDateFormat: function (date) {
      return (
        date.getUTCFullYear() +
        "-" +
        ("0" + (date.getUTCMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getUTCDate()).slice(-2)
      );
    },
  });

  async function getDatesFromGeoserver() {
    const url = `${Configuration.get_url_geoserver()}?service=WMS&version=1.3.0&request=GetCapabilities`;
    const response = await axios.get(url);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");
    const layers = xmlDoc.getElementsByTagName("Layer");
    let dates;

    for (let i = 0; i < layers.length; i++) {
      const layerName = layers[i].getElementsByTagName("Name")[0].textContent;
      if (layerName === "biomass") {
        const dimension =
          layers[i].getElementsByTagName("Dimension")[0].textContent;
        const timeInterval = dimension.split(",");
        dates = timeInterval.map((date) => date.split("T")[0]);
        break;
      }
    }
    return dates;
  }

  

  useEffect(() => {
    getDatesFromGeoserver().then((dates) => {
      const wmsLayer = L.tileLayer.wms(Configuration.get_url_geoserver(), {
        layers: layer,
        format: "image/png",
        transparent: true,
        crs: L.CRS.EPSG4326,
      });

      const timeDimension = new L.TimeDimension({
        times: dates,
      });
      map.timeDimension = timeDimension;

      if (!wmsLayerRef.current) {
        const tdWmsLayer = L.timeDimension.layer.wms(wmsLayer, {
          timeDimensionName: dimensionName,
        });
        tdWmsLayer.addTo(map);
        wmsLayerRef.current = tdWmsLayer;
        tdWmsLayer.on("timeload", function () {
          setLoaded(false);
        });

        if (!timeDimensionControlRef.current) {
          const timeDimensionControl = new L.Control.TimeDimensionCustom({
            timeDimension: timeDimension,
            position: "bottomleft",
            autoPlay: false,
            speedSlider: false,
            playerOptions: {
              buffer: 1,
              minBufferReady: -1,
            },
          });
          map.addControl(timeDimensionControl);
          timeDimensionControlRef.current = timeDimensionControl;

          const initialFormattedTime = new Date(timeDimension.getCurrentTime())
            .toISOString()
            .split("T")[0];
          onTimeChange(initialFormattedTime);

          map.timeDimension.on("timeload", function (event) {
            const currentTime = timeDimension.getCurrentTime();
            const formattedTime = new Date(currentTime)
              .toISOString()
              .split("T")[0];
            onTimeChange(formattedTime);
          });
        }
      }

      let targetLayer;
      map.eachLayer((layer) => {
        if (layer.options.layers === "waterpoints_et:Watershed_boundaries") {
          targetLayer = layer;
          targetLayer.setZIndex(1000);
        }
        if (layer.options.layers === "administrative:et_adm3_wp") {
          targetLayer = layer;
          targetLayer.setZIndex(1000);
        }
      });
    });
  }, [map, layer, dimensionName, onTimeChange]);

  return (
    <>
      <Modal
        show={loaded}
        backdrop="static"
        keyboard={false}
        centered
        size="sm"
      >
        <Modal.Body className="d-flex align-items-center">
          <Spinner animation="border" role="status" className="me-2" />
          {t("forage.loading")}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TimelineController;
