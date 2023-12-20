import React, { useEffect, useRef } from "react";
import "./Forage.css";
import {
  LayersControl,
  MapContainer,
  TileLayer,
  WMSTileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet-timedimension";
import Configuration from "../../conf/Configuration";

function Forage() {
  return (
    <>
      <MapContainer
        center={[9.149175, 40.498867]}
        zoom={6}
        style={{
          height: "100vh",
          width: "100%",
        }}
        className="map-monitoring"
        zoomControl={false}
      >
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
        <ZoomControl position="topright" />
        <AddWMSLayer />
      </MapContainer>
    </>
  );
}

function AddWMSLayer() {
  const map = useMap();
  const timeDimensionControlRef = useRef(null);

  useEffect(() => {
    const wmsLayer = L.tileLayer.wms(Configuration.get_url_geoserver(), {
      layers: "waterpoints_et:biomass",
      format: "image/png",
      transparent: true,
    });

    // Create a time dimension
    const timeDimension = new L.TimeDimension({
      time: "2022-01", // Start the timeline at this date
      timeInterval: "2022-01/2023-09", // Change this to match your data
      period: "P1M", // Change this to match your data
    });
    map.timeDimension = timeDimension;

    // Create and add a TimeDimension Layer to the map
    var tdWmsLayer = L.timeDimension.layer.wms(wmsLayer, {
      updateTimeDimension: true,
      updateTimeDimensionMode: "replace",
      timeDimensionName: "time", // Change this to the name of the time dimension in the WMS server
      requestTimeFromCapabilities: true, // Add this line
    });
    tdWmsLayer.addTo(map);

    // Create and add a TimeDimension Control to the map
    if (!timeDimensionControlRef.current) {
      var timeDimensionControl = new L.Control.TimeDimension({
        timeDimension: timeDimension,
        position: "bottomleft",
        autoPlay: false,
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

export default Forage;
