import React, { useEffect, useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import "./rain.css";
import {
    MapContainer,
    TileLayer,
    LayersControl,
    WMSTileLayer,
    Popup,
    useMapEvent
} from "react-leaflet";
import Form from "../../components/form/form";
import axios from "axios";
import { fetchLayersData } from "../../utils/utils";
import TimelineControllerRain from "../../components/timelinerain/timelinerain";

function Rain() {
    const [t, i18n] = useTranslation("global");
    const [data, setData] = useState(null);
    const [selectedOption, setSelectedOption] = useState("Subseasonal");
    const [selectedScenario, setSelectedScenario] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [legendUrl, setLegendUrl] = useState("");
    const [popupInfo, setPopupInfo] = useState(null);
    const mapRef = useRef(null);
    const [selectedTimestamp, setSelectedTimestamp] = useState(null);

    const handleTimelineChange = (newTimestamp) => {
        setSelectedTimestamp(newTimestamp);
    };
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchLayersData();
            setData(result);
        };

        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter(item => {
            const name = item.Name.toLowerCase();
            if (selectedOption === "Seasonal") {
                return name.includes("seasonal") && !name.includes("subseasonal");
            }
            if (selectedOption === "Subseasonal") {
                return name.includes("subseasonal");
            }
            return false;
        });
    }, [data, selectedOption]);

    useEffect(() => {
        setSelectedScenario("");
        setSelectedDate("");
    }, [selectedOption]);

    useEffect(() => {
        if (selectedScenario ) {
            const url = `https://geo.aclimate.org/geoserver/aclimate_et/wms?request=GetLegendGraphic&format=image/png&layer=aclimate_et:${selectedScenario}`;
            setLegendUrl(url);
        } else {
            setLegendUrl("");
        }
    }, [selectedScenario]);
    useEffect(() => {
        setPopupInfo(null);
    }, [selectedScenario]);
    const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;

        if (selectedScenario ) {
            const bbox = `${lng - 0.1},${lat - 0.1},${lng + 0.1},${lat + 0.1}`;
            const url = `https://geo.aclimate.org/geoserver/aclimate_et/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fjpeg&TRANSPARENT=true&QUERY_LAYERS=aclimate_et:${selectedScenario}&STYLES&LAYERS=aclimate_et:${selectedScenario}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=50&Y=50&SRS=EPSG%3A4326&WIDTH=101&HEIGHT=101&BBOX=${bbox}&time=${selectedTimestamp}`;
            try {
                const response = await axios.get(url);
                const featureInfo = response.data;

                const rawValue = featureInfo.features?.[0]?.properties?.GRAY_INDEX;

                const value =
                    rawValue === undefined || rawValue === -3.3999999521443642e38
                        ? "No data"
                        : parseFloat(rawValue).toFixed(1);

                if (value === "No data") return;

                setPopupInfo({ lat, lng, value });

            } catch (error) {
                console.error("Error al obtener el valor del pixel:", error);
            }
        }
    };
    const MapClickHandler = () => {
        useMapEvent("click", handleMapClick);
        return null;
    };

    return (
        <MapContainer
            id="map"
            center={[9.149175, 40.498867]}
            zoom={6}
            style={{ height: "100vh", width: "100%" }}
            className="map-monitoring"
            zoomControl={false}
            whenCreated={(map) => (mapRef.current = map)}
        >
            <MapClickHandler />

            <LayersControl
                key={i18n.language} // Fuerza la actualización cuando cambia el idioma
                position="topright"
                collapsed={false}
            >
                <LayersControl.BaseLayer
                    checked={selectedOption === "Subseasonal"}
                    name={t("rain.subseasonal")}
                >
                    <TileLayer
                        attribution="Subseasonal Data"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        eventHandlers={{
                            add: () => setSelectedOption("Subseasonal"),
                        }}
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer
                    checked={selectedOption === "Seasonal"}
                    name={t("rain.seasonal")}
                >
                    <TileLayer
                        attribution="Seasonal Data"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        eventHandlers={{
                            add: () => setSelectedOption("Seasonal"),
                        }}
                    />
                </LayersControl.BaseLayer>
            </LayersControl>




            {/* {selectedOption && selectedScenario && selectedDate && (
                <WMSTileLayer
                    zIndex={1000}
                    key={`${selectedOption}-${selectedScenario}-${selectedDate}`}
                    url="https://geo.aclimate.org/geoserver/aclimate_et/wms"
                    layers={`aclimate_et:${selectedScenario}`}
                    format="image/png"
                    transparent={true}
                    styles=""
                    params={`time:${selectedDate}`}
                    version="1.1.1"
                />

            )} */}
            <WMSTileLayer
                zIndex={3001}
                url="https://geo.aclimate.org/geoserver/administrative/wms"
                layers={`adminstrative:et_adm1`}
                format="image/png"
                transparent={true}
                styles="Ethiopia_admin_style_waterpoints"
            />
            {selectedOption && (
                <TimelineControllerRain
                dimensionName="time"
                layer={selectedScenario}
                onTimeChange={handleTimelineChange}
                selectedOption={selectedOption}
                selectedScenario={selectedScenario}
            />
            )}
            <Form
                filteredData={filteredData}
                selectedScenario={selectedScenario}
                setSelectedScenario={setSelectedScenario}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedOption={selectedOption}
            />


            {legendUrl && (
                <div
                    className="position-absolute"
                    style={{
                        bottom: "20px",
                        right: "20px",
                        background: "white",
                        padding: "10px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                        zIndex: 1000
                    }}
                >
                    <img src={legendUrl} alt="Leyenda" style={{ maxWidth: "200px" }} />
                </div>
            )}
          
        </MapContainer>
    );
}
export default Rain;
