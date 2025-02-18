import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import Configuration from "../../conf/Configuration";
import { centroid } from "@turf/turf";

// Actualiza la vista del mapa
const MapUpdater = ({ center, timestamp }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

// Componente para crear un pane personalizado para el raster
const CreateRasterPane = () => {
  const map = useMap();
  useEffect(() => {
    if (!map.getPane("rasterPane")) {
      map.createPane("rasterPane");
      // Ubicar el pane sobre la capa base pero por debajo de las capas vectoriales
      map.getPane("rasterPane").style.zIndex = 250;
    }
  }, [map]);
  return null;
};

// Componente que aplica el clip-path al pane del raster según el GeoJSON del woreda
const RasterClip = ({ woredaName }) => {
  const map = useMap();
  const [woredaGeoJSON, setWoredaGeoJSON] = useState(null);

  // Se obtiene la geometría del woreda
  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const wfsUrl = `${Configuration.get_adm_level_url_geoserver()}/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=administrative:et_adm3_wp&cql_filter=ADM3_EN='${woredaName}'&outputFormat=application/json`;
        const response = await fetch(wfsUrl);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          setWoredaGeoJSON(data.features[0]);
        }
      } catch (error) {
        console.error("Error al obtener el GeoJSON para el clip:", error);
      }
    };
    fetchGeoJSON();
  }, [woredaName]);

  // Función para calcular y aplicar el clip-path al pane del raster
  const updateClip = () => {
    if (!woredaGeoJSON) return;
    let coords = [];
    if (woredaGeoJSON.geometry.type === "Polygon") {
      // Usamos el primer anillo (el exterior)
      coords = woredaGeoJSON.geometry.coordinates[0];
    } else if (woredaGeoJSON.geometry.type === "MultiPolygon") {
      // Tomamos el primer polígono y su anillo exterior
      coords = woredaGeoJSON.geometry.coordinates[0][0];
    }
    // Convertir las coordenadas [lng, lat] a puntos en pantalla
    const points = coords.map((coord) => {
      const latlng = new L.LatLng(coord[1], coord[0]);
      return map.latLngToLayerPoint(latlng);
    });
    if (points.length === 0) return;
    // Crear la cadena SVG path (por ejemplo: "M x y L x y ... Z")
    let pathString = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathString += ` L ${points[i].x} ${points[i].y}`;
    }
    pathString += " Z";
    // Aplicar el clip-path al pane del raster
    const pane = map.getPane("rasterPane");
    if (pane) {
      pane.style.clipPath = `path('${pathString}')`;
      pane.style.webkitClipPath = `path('${pathString}')`;
    }
  };

  // Actualizamos el clip al cargar y al mover/zoomear el mapa
  useEffect(() => {
    updateClip();
    map.on("moveend zoomend", updateClip);
    return () => {
      map.off("moveend zoomend", updateClip);
    };
  }, [woredaGeoJSON, map]);

  return null;
};

function WoredaMap({ woreda }) {
  const [center, setCenter] = useState([9.149175, 40.498867]);
  const [loading, setLoading] = useState(true);

  // Se obtiene el centro del woreda usando el WFS
  useEffect(() => {
    const fetchCentroid = async () => {
      try {
        const wfsUrl = `${Configuration.get_adm_level_url_geoserver()}/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=administrative:et_adm3_wp&cql_filter=ADM3_EN='${
          woreda.name
        }'&outputFormat=application/json`;
        const response = await fetch(wfsUrl);
        const data = await response.json();
        if (data.features?.length > 0) {
          const geometry = data.features[0].geometry;
          const featureCentroid = centroid(geometry).geometry.coordinates;
          setCenter([featureCentroid[1], featureCentroid[0]]); // [lat, lng]
        }
      } catch (error) {
        console.error("Error al obtener el centro:", error);
      } finally {
        setLoading(false);
      }
    };

    if (woreda?.name) {
      fetchCentroid();
    }
  }, [woreda]);

  if (loading) return <div>Cargando mapa...</div>;

  return (
    <MapContainer
      id="map-modal"
      center={center}
      zoom={6}
      style={{ height: "200px", width: "100%" }}
      zoomControl={false}
    >
      {/* Creamos el pane para el raster */}
      <CreateRasterPane />
      {/* Mapa base */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Shapefile del woreda */}
      <WMSTileLayer
        url={`${Configuration.get_adm_level_url_geoserver()}`}
        layers="administrative:et_adm3_wp"
        format="image/png"
        cql_filter={`ADM3_EN='${woreda.name}'`}
        transparent={true}
        zIndex={300}
      />
      {/* Raster (biomasa) en el pane personalizado */}
      <WMSTileLayer
        url={`${Configuration.get_url_geoserver()}`}
        layers="waterpoints_et:biomass"
        format="image/png"
        transparent={true}
        crs={L.CRS.EPSG4326}
        version="1.1.1"
        time={new Date(woreda.timestamp).toISOString()}
        zIndex={1}
        pane="rasterPane"
      />
      <ZoomControl position="topright" />
      <MapUpdater center={center} timestamp={woreda.timestamp} />
      {/* Aplicamos el clip al raster según el woreda */}
      <RasterClip woredaName={woreda.name} />
    </MapContainer>
  );
}

export default WoredaMap;
