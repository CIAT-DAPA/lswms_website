import React, { useEffect, useRef, useState } from "react";
import { useMap, Popup, Marker } from "react-leaflet";
import "../../pages/rain/rain.css";
import L from "leaflet";
import "leaflet-timedimension";
import axios from "axios";
import { Modal, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
function TimelineControllerRain({ dimensionName, layer, onTimeChange,selectedOption, selectedScenario }) {
  const [t] = useTranslation("global");
  const map = useMap();
  const timeDimensionControlRef = useRef(null);
  const [loaded, setLoaded] = useState(true);
  const wmsLayerRef = useRef(null);
  const [currentDate, setCurrentDate] = useState("");
const [popupInfo, setPopupInfo] = useState(null);
// Estado para la fecha actual
  console.log("🚀 option en el hijo antes del useEffect:", selectedOption);
  console.log("🚀 escenario en el hijo antes del useEffect:", selectedScenario)  ;

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

  const xmlToJson = (xml) => {
    let obj = {};
    if (xml.nodeType === 1) {
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < xml.attributes.length; j++) {
          const attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) {
      return xml.nodeValue.trim();
    }

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        const nodeValue = xmlToJson(item);
        if (nodeValue) {
          if (typeof obj[nodeName] === "undefined") {
            obj[nodeName] = nodeValue;
          } else {
            if (!Array.isArray(obj[nodeName])) {
              obj[nodeName] = [obj[nodeName]];
            }
            obj[nodeName].push(nodeValue);
          }
        }
      }
    }
    return obj;
  };

  const fetchLayersData = async () => {
    try {
      const url =
        "https://geo.aclimate.org/geoserver/aclimate_et/wms?service=WMS&version=1.1.0&request=GetCapabilities&layers=aclimate_et";
      const response = await axios.get(url, { responseType: "text" });

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");

      const jsonData = xmlToJson(xmlDoc);
      const capas = jsonData?.WMT_MS_Capabilities[1]?.Capability?.Layer?.Layer;

      if (capas) {
        return capas.map((item) => {
          const fechas = item.Extent["#text"]
            .split(",")
            .map((fecha) => fecha.split("T")[0]);

          return {
            Name: item.Name["#text"],
            Fechas: fechas,
          };
        });
      } else {
        console.error("No se encontraron datos en Layer.Layer");
        return [];
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      return [];
    }
  };


  useEffect(() => {

    if (!map) {
      console.warn("❌ No se ha cargado el mapa aún.");
      return;
    }

    fetchLayersData()
      .then((dates) => {

        // Remover la capa anterior si existe
        if (wmsLayerRef.current) {
          map.removeLayer(wmsLayerRef.current);
          wmsLayerRef.current = null;
        }

        const selectedLayer = `aclimate_et:${layer.toLowerCase()}`;

        const wmsLayer = L.tileLayer.wms(
          "https://geo.aclimate.org/geoserver/aclimate_et/wms",
          {
            layers: selectedLayer,
            format: "image/png",
            transparent: true,
            crs: L.CRS.EPSG4326,
            zIndex: 2000,
          }
        );

        // Buscar las fechas correspondientes a la nueva capa
        const timeData = dates.find((item) => item.Name === layer.toLowerCase())?.Fechas;

        // Eliminar TimeDimension existente y sus eventos
        if (map.timeDimension) {
          map.timeDimension.off("timeload"); // Eliminar eventos previos
          delete map.timeDimension;
        }

        const timeDimension = new L.TimeDimension({ times: timeData });
        map.timeDimension = timeDimension;


        const tdWmsLayer = L.timeDimension.layer.wms(wmsLayer, {
          timeDimensionName: dimensionName,
          zIndex: 2000,
        });

        tdWmsLayer.addTo(map);
        wmsLayerRef.current = tdWmsLayer;
        tdWmsLayer.on("timeload", function () {
          setLoaded(false);
        });


        // Remover el control de tiempo anterior si existe
        if (timeDimensionControlRef.current) {
          map.removeControl(timeDimensionControlRef.current);
          timeDimensionControlRef.current = null;
        }

        const timeDimensionControl = new L.Control.TimeDimensionCustom({
          timeDimension: map.timeDimension,
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

        // Obtener y actualizar la fecha inicial
        const initialFormattedTime = new Date(map.timeDimension.getCurrentTime())
          .toISOString()
          .split("T")[0];

        onTimeChange(initialFormattedTime);

        // Evento para actualizar la fecha cuando cambia en el timeline
        map.timeDimension.on("timeload", function () {
          const currentTime = map.timeDimension.getCurrentTime();
          const formattedTime = new Date(currentTime).toISOString().split("T")[0];

          onTimeChange(formattedTime);
        });
      })
      .catch((error) => {
        console.error("❌ Error en fetchLayersData:", error);
      });
  }, [map, layer, dimensionName, selectedOption]);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        const bbox = `${lng - 0.1},${lat - 0.1},${lng + 0.1},${lat + 0.1}`;
        const url = `https://geo.aclimate.org/geoserver/aclimate_et/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fjpeg&TRANSPARENT=true&QUERY_LAYERS=aclimate_et:${selectedScenario}&STYLES&LAYERS=aclimate_et:${selectedScenario}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=50&Y=50&SRS=EPSG%3A4326&WIDTH=101&HEIGHT=101&BBOX=${bbox}&time=${map.timeDimension.getCurrentTime()}`;

        try {
            const response = await axios.get(url);
            const featureInfo = response.data;
            const rawValue = featureInfo.features?.[0]?.properties?.GRAY_INDEX;
            const value = rawValue === undefined || rawValue === -3.3999999521443642e38 ? "No data" : parseFloat(rawValue).toFixed(1);

            if (value !== "No data") {
              L.popup({
                  className: "custom-popup", 
              })
                  .setLatLng([lat, lng])
                  .setContent(`<b>Value: ${value} mm</b>`)
                  .openOn(map);
          }
        } catch (error) {
            console.error("Error fetching feature info:", error);
        }
    };

    map.on("click", handleMapClick);
    return () => {
        map.off("click", handleMapClick);
    };
}, [map, selectedScenario, selectedOption]);

  return (
    <>
      <div className="date-display">
        <p style={{ fontWeight: "bold", fontSize: "16px" }}>
          {t("forage.current_date")}: {currentDate || "Cargando..."}
        </p>
      </div>
      
      <Modal show={loaded} backdrop="static" keyboard={false} centered size="sm">
        <Modal.Body className="d-flex align-items-center">
          <Spinner animation="border" role="status" className="me-2" />
          {t("forage.loading")}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TimelineControllerRain;
