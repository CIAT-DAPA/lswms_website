import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-timedimension";
import Configuration from "../../conf/Configuration";
import axios from "axios";

function TimelineController({ dimensionName, layer }) {
  const map = useMap();
  const timeDimensionControlRef = useRef(null);

  // Define your custom control
  L.Control.TimeDimensionCustom = L.Control.TimeDimension.extend({
    _getDisplayDateFormat: function (date) {
      return (
        date.getUTCFullYear() +
        "-" +
        ("0" + (date.getUTCMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getUTCDate()).slice(-2) // Add this line
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
    console.log(dates);
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

      // Create and add a TimeDimension Layer to the map
      const tdWmsLayer = L.timeDimension.layer.wms(wmsLayer, {
        timeDimensionName: dimensionName,
      });
      tdWmsLayer.addTo(map);
      // Create and add a TimeDimension Control to the map
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
      }
    });
  }, [map]);

  return null;
}

export default TimelineController;
