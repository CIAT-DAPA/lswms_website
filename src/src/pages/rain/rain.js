import React, { useEffect, useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./rain.css";
import dominnantlegend from "../../assets/img/dominantlegend.png";
import {
    MapContainer,
    TileLayer,

    WMSTileLayer,
    Popup,
    useMapEvent
} from "react-leaflet";
import Form from "../../components/form/form";
import axios from "axios";
import { fetchLayersData } from "../../utils/utils";
import BtnDownload from "../../components/btnDownload/BtnDownload";

function Rain() {
    const [data, setData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedScenario, setSelectedScenario] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [legendUrl, setLegendUrl] = useState("");
    const [popupInfo, setPopupInfo] = useState(null);
    const mapRef = useRef(null);
    const [dates, setDates] = useState([]);
    const [rasterFileUrl, setRasterFileUrl] = useState("");



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
        if (selectedScenario) {
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

        if (selectedScenario) {
            const bbox = `${lng - 0.1},${lat - 0.1},${lng + 0.1},${lat + 0.1}`;
            const url = `https://geo.aclimate.org/geoserver/aclimate_et/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fjpeg&TRANSPARENT=true&QUERY_LAYERS=aclimate_et:${selectedScenario}&STYLES&LAYERS=aclimate_et:${selectedScenario}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=50&Y=50&SRS=EPSG%3A4326&WIDTH=101&HEIGHT=101&BBOX=${bbox}&time=${selectedDate}`;
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
    console.log(legendUrl)

    useEffect(() => {


        const baseUrl = "https://geo.aclimate.org/geoserver/aclimate_et/wms";
        const params = new URLSearchParams({
            service: "WMS",
            version: "1.1.0",
            request: "GetMap",
            layers: `${selectedScenario}`,
            bbox: "32.75,2.75,48.25,15.25",
            width: "768",
            height: "619",
            srs: "EPSG:4326",
            styles: "",
            format: "image/geotiff", // Cambiar a formato raster adecuado
            time: `${selectedDate}`
        });

        setRasterFileUrl(`${baseUrl}?${params.toString()}`);
    }, [selectedScenario, selectedDate]); // Se ejecuta cuando layerName o time cambian
    useEffect(() => {
        const foundItem = filteredData.find(item => item.Name === selectedScenario);
        setDates(foundItem ? foundItem.Fechas : []);
    }, [filteredData, selectedScenario]);
    return (
        <>
        <MapContainer
            id="map"
            center={[9.149175, 40.498867]}
            zoom={6}
            style={{ height: "100vh", width: "100%" }}
            className="map-monitoring"
            zoomControl={false}
            whenCreated={(map) => (mapRef.current = map)}


        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler />

            




            {selectedOption && selectedScenario && selectedDate && (
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

            )}
            <WMSTileLayer
                zIndex={3001}
                url="https://geo.aclimate.org/geoserver/administrative/wms"
                layers={`adminstrative:et_adm1`}
                format="image/png"
                transparent={true}
                styles="Ethiopia_admin_style_waterpoints"
            />

{popupInfo && (
    <Popup className="custom-popup" zIndex={5000} position={[popupInfo.lat, popupInfo.lng]}>
        <div>
            <p>
                <strong>value: </strong> 
                {
                    (() => {
                        let value = popupInfo.value;
                        const isDominant = selectedScenario === 'subseasonal_country_et_dominant' || selectedScenario === 'seasonal_country_et_dominant';

                        if (isDominant) {
                            if (value > 200) value -= 200;
                            else if (value > 100) value -= 100;
                        }

                        return `${value.toFixed(2)} mm`;
                    })()
                }
            </p>
        </div>
    </Popup>
)}

            <Form
                dates={dates}
                filteredData={filteredData}
                selectedScenario={selectedScenario}
                setSelectedScenario={setSelectedScenario}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
            />
            

            {legendUrl && selectedDate && (
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
        <img
            src={
                selectedScenario.startsWith("subseasonal_country_et_dominant") ||
                selectedScenario.startsWith("seasonal_country_et_dominant")
                    ? dominnantlegend // Ruta de la leyenda especial
                    : legendUrl
            }
            alt="Leyenda"
            style={{
                maxWidth: "200px",
                height:
                    selectedScenario.startsWith("subseasonal_country_et_dominant") ||
                    selectedScenario.startsWith("seasonal_country_et_dominant")
                        ? "80vh"
                        : "auto",
                objectFit: "contain",
                width: "100%"
            }}
        />
    </div>
)}



            {selectedOption && selectedScenario && selectedDate && (
                <div id="btn-rain">
                    <BtnDownload
                        raster
                        rasterFile={rasterFileUrl}
                        jpg
                        idElement={"#map"}
                        nameFile={selectedScenario + "_" + selectedDate}
                    />
                </div>
            )}
        </MapContainer>
        
        </>
        
        
    );
}
export default Rain;
