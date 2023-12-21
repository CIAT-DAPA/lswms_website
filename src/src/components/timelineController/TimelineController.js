import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-timedimension";
import Configuration from "../../conf/Configuration";

function TimelineController({ dimensionName, layer }) {
  const map = useMap();
  const timeDimensionControlRef = useRef(null);

  // Define your custom control
  L.Control.TimeDimensionCustom = L.Control.TimeDimension.extend({
    _getDisplayDateFormat: function (date) {
      return (
        date.getUTCFullYear() + "-" + ("0" + (date.getUTCMonth() + 1)).slice(-2)
      );
    },
  });

  useEffect(() => {
    const wmsLayer = L.tileLayer.wms(Configuration.get_url_geoserver(), {
      layers: layer,
      format: "image/png",
      transparent: true,
    });

    // Create a time dimension
    const timeDimension = new L.TimeDimension({
      timeInterval: "2022-01/2023-09",
      period: "P1M",
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
  }, [map]);

  return null;
}

export default TimelineController;
