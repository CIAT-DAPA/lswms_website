import React, { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-timedimension";
import axios from "axios";
import { Modal, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function TimelineControllerRain({ dimensionName, layer, onTimeChange,selectedOption }) {
  const [t] = useTranslation("global");
  const [localOption, setLocalOption] = useState(selectedOption);
  const map = useMap();
  const timeDimensionControlRef = useRef(null);
  const [loaded, setLoaded] = useState(true);
  const wmsLayerRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(""); // Estado para la fecha actual
  console.log("🚀 option en el hijo antes del useEffect:", selectedOption);

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
    console.log("🔄 useEffect ejecutado con cambios en:");
    console.log("   🔹 layer:", layer);
    console.log("   🔹 dimensionName:", dimensionName);
    console.log("   🔹 option:", selectedOption);

    if (!map) {
      console.warn("❌ No se ha cargado el mapa aún.");
      return;
    }

    fetchLayersData()
      .then((dates) => {
        console.log("📥 Datos recibidos en fetchLayersData:", dates);

        // Remover la capa anterior si existe
        if (wmsLayerRef.current) {
          console.log("🗑️ Eliminando capa WMS anterior...");
          map.removeLayer(wmsLayerRef.current);
          wmsLayerRef.current = null;
        }

        const selectedLayer = `aclimate_et:${layer.toLowerCase()}`;
        console.log("🗺️ Creando nueva capa WMS con:", selectedLayer);

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
        console.log("📆 Fechas obtenidas:", timeData);

        // Eliminar TimeDimension existente y sus eventos
        if (map.timeDimension) {
          console.log("♻️ Eliminando TimeDimension existente...");
          map.timeDimension.off("timeload"); // Eliminar eventos previos
          delete map.timeDimension;
        }

        console.log("🆕 Creando nuevo TimeDimension...");
        const timeDimension = new L.TimeDimension({ times: timeData });
        map.timeDimension = timeDimension;

        console.log("✅ Asignado TimeDimension al mapa.");

        const tdWmsLayer = L.timeDimension.layer.wms(wmsLayer, {
          timeDimensionName: dimensionName,
          zIndex: 2000,
        });

        tdWmsLayer.addTo(map);
        wmsLayerRef.current = tdWmsLayer;
        tdWmsLayer.on("timeload", function () {
          setLoaded(false);
        });

        console.log("📌 Nueva capa WMS añadida al mapa.");

        // Remover el control de tiempo anterior si existe
        if (timeDimensionControlRef.current) {
          console.log("🗑️ Eliminando control de tiempo anterior...");
          map.removeControl(timeDimensionControlRef.current);
          timeDimensionControlRef.current = null;
        }

        console.log("🆕 Creando nuevo control de tiempo...");
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
        console.log("✅ Control de tiempo agregado.");

        // Obtener y actualizar la fecha inicial
        const initialFormattedTime = new Date(map.timeDimension.getCurrentTime())
          .toISOString()
          .split("T")[0];

        console.log("📅 Fecha inicial:", initialFormattedTime);
        onTimeChange(initialFormattedTime);

        // Evento para actualizar la fecha cuando cambia en el timeline
        map.timeDimension.on("timeload", function () {
          const currentTime = map.timeDimension.getCurrentTime();
          const formattedTime = new Date(currentTime).toISOString().split("T")[0];

          console.log("📆 Fecha cambiada:", formattedTime);
          onTimeChange(formattedTime);
        });
      })
      .catch((error) => {
        console.error("❌ Error en fetchLayersData:", error);
      });
  }, [map, layer, dimensionName, onTimeChange, selectedOption]);

  console.log(selectedOption);
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
