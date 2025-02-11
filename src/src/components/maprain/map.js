import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, LayersControl, ZoomControl, WMSTileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import axios from "axios";

const MapComponent = ({ selectedScenario, selectedDate, selectedOption, legendUrl }) => {
    const mapRef = useRef(null);
    const [popupInfo, setPopupInfo] = useState(null);

    useEffect(() => {
        if (mapRef.current && selectedScenario && selectedDate) {
            mapRef.current.setView([9.149175, 40.498867], 6, { animate: false });
        }
    }, [selectedScenario, selectedDate]);

    const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        if (!selectedScenario || !selectedDate) return;

        const bbox = `${lng - 0.1},${lat - 0.1},${lng + 0.1},${lat + 0.1}`;
        const url = `https://geo.aclimate.org/geoserver/aclimate_et/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&QUERY_LAYERS=aclimate_et:${selectedScenario}&LAYERS=aclimate_et:${selectedScenario}&INFO_FORMAT=application/json&BBOX=${bbox}&time=${selectedDate}`;

        try {
            const response = await axios.get(url);
            const value = response.data.features?.[0]?.properties?.GRAY_INDEX || "No data";
            if (value !== "No data") setPopupInfo({ lat, lng, value });
        } catch (error) {
            console.error("Error al obtener el valor del pixel:", error);
        }
    };

    const MapClickHandler = () => {
        useMapEvent("click", handleMapClick);
        return null;
    };

    return (
        <MapContainer ref={mapRef} center={[9.149175, 40.498867]} zoom={6} style={{ height: "100vh" }} zoomControl={false}>
            <MapClickHandler />
            <LayersControl position="topright" collapsed={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </LayersControl>
            {legendUrl && <img src={legendUrl} alt="Leyenda" style={{ position: "absolute", bottom: "20px", right: "20px", zIndex: 1000 }} />}
            {popupInfo && <Popup position={[popupInfo.lat, popupInfo.lng]}>{popupInfo.value}</Popup>}
        </MapContainer>
    );
};
export default MapComponent;