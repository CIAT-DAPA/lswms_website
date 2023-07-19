import React from "react";
import { MapContainer, TileLayer} from "react-leaflet";

function Visualization() {
  return (
    <MapContainer center={[9.145, 40.489]} zoom={5} style={{
      height: "100vh",
      width: "100%",
    }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
   
    </MapContainer>
  );
}

export default Visualization;
