import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import "./Monitoring.css";
import Services from "../../services/apiService";
import {
  Modal,
  Spinner,
  OverlayTrigger,
  Tooltip,
  Button,
  Dropdown,
  ToastContainer,
  Toast,
  Form,
} from "react-bootstrap";
import Legend from "../../components/legend/Legend";
import { useTranslation } from "react-i18next";
import SearchBar from "../../components/searchBar/SearchBar";
import {
  IconAlertCircleFilled,
  IconBike,
  IconCar,
  IconRoad,
  IconWalk,
  IconId,
  IconInfoCircleFilled,
  IconCloudRain,
  IconChartDonut,
  IconDownload,
} from "@tabler/icons-react";
import RouteInfo from "../../components/routeInfo/RouteInfo";
import WpLabel from "../../components/wpLabel/WpLabel";
import SubscriptionButton from "../../components/subscriptionButton/SubscriptionButton";
import { useAuth } from "../../hooks/useAuth";
import html2canvas from "html2canvas";

// Mapa de iconos
const colorIconMap = {
  green: new L.Icon({
    iconUrl: require(`../../assets/img/greenMarker.png`),
    iconSize: [32, 32],
  }),
  yellow: new L.Icon({
    iconUrl: require(`../../assets/img/yellowMarker.png`),
    iconSize: [32, 32],
  }),
  brown: new L.Icon({
    iconUrl: require(`../../assets/img/brownMarker.png`),
    iconSize: [32, 32],
  }),
  red: new L.Icon({
    iconUrl: require(`../../assets/img/redMarker.png`),
    iconSize: [32, 32],
  }),
  black: new L.Icon({
    iconUrl: require(`../../assets/img/blackMarker.png`),
    iconSize: [32, 32],
  }),
  gray: new L.Icon({
    iconUrl: require(`../../assets/img/grayMarker.png`),
    iconSize: [32, 32],
  }),
};

const getWaterpointColor = (depth, climatologyDepth, name) => {
  // Convertir a números flotantes
  depth = parseFloat(depth);
  climatologyDepth = parseFloat(climatologyDepth);

  if (name === "Muya" || name === "Bakke") return "brown";
  if (name === "Ketala") return "black";
  if (depth === 0 && climatologyDepth === 0) return "gray";
  if (depth >= 0 && depth < 0.2) return "red";
  if (depth >= 0.2 && depth < 0.3) return "brown";
  if (depth >= 0.3 && depth < 0.7) return "yellow";
  if (depth >= 0.7) return "green";
  return "gray"; // Default para casos no contemplados
};
const getStatusText = (color, t) => {
  const statusMap = {
    gray: t("monitoring.seasonally"),
    red: t("monitoring.near"),
    brown: t("monitoring.alert"),
    yellow: t("monitoring.watch"),
    green: t("monitoring.good"),
    black: t("monitoring.no-available"),
  };
  return statusMap[color] || "";
};

function Visualization() {
  const [t, i18n] = useTranslation("global");
  const mapRef = useRef(null);
  const [originalWaterpoints, setOriginalWaterpoints] = useState([]);
  const [filteredWaterpoints, setFilteredWaterpoints] = useState([]);
  const [monitored, setMonitored] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [showSearchPlace, setShowSearchPlace] = useState("");
  const [route, setRoute] = useState();
  const [filter, setFilter] = useState({
    green: true,
    yellow: true,
    brown: true,
    red: true,
    gray: true,
    black: true,
  });
  const [showWarning, setShowWarning] = useState(false);
  const [profile, setProfile] = useState();
  const [waterpointRoute, setWaterpointRoute] = useState();
  const [toastSuccess, setToastSuccess] = useState();
  const [showToastSubscribe, setShowToastSubscribe] = useState(false);
  const { userInfo } = useAuth();
  const [wpstolabel, setWpstolabel] = useState([]);
  const [date, setDate] = useState();
  const [endDate, setEndDate] = useState();
  const [firstLoad, setFirstLoad] = useState(true);

  const handleClose = () => setShowWarning(false);

  useEffect(() => {
    Services.get_all_waterpoints()
      .then((response) => {
        const initialWaterpoints = response.map((wp) => ({
          ...wp,
          color: "gray",
          show: true,
        }));
        setOriginalWaterpoints(initialWaterpoints);
        setFilteredWaterpoints(initialWaterpoints);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (originalWaterpoints.length > 0 && firstLoad) {
      const idsWp = originalWaterpoints.map((item) => item.id);
      const requests = idsWp.map((id) => Services.get_last_data(id));

      Promise.all(requests)
        .then((responses) => {
          const monitoredData = responses.map((response) => response.data[0]);
          const updatedWaterpoints = originalWaterpoints.map((wp) => {
            const monitored = monitoredData.find(
              (m) => m.waterpointId === wp.id
            );
            const depthValue =
              monitored?.values.find((v) => v.type === "depth")?.value || 0;
            const climatologyValue =
              monitored?.values.find((v) => v.type === "climatology_depth")
                ?.value || 0;

            return {
              ...wp,
              color: getWaterpointColor(depthValue, climatologyValue, wp.name),
            };
          });

          setOriginalWaterpoints(updatedWaterpoints);
          setFilteredWaterpoints(updatedWaterpoints);
          setMonitored(monitoredData);
          setDate(monitoredData[0]?.date.split("T")[0]);
          setEndDate(monitoredData[0]?.date.split("T")[0]);
          setFirstLoad(false);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [originalWaterpoints.length, firstLoad]);

  useEffect(() => {
    if (!firstLoad) {
      setLoading(true);
      Services.get_data_by_date(date)
        .then((response) => {
          setMonitored(response.data);
          const updatedWaterpoints = originalWaterpoints.map((wp) => {
            const monitored = response.data.find(
              (m) => m.waterpointId === wp.id
            );
            const depthValue =
              monitored?.values.find((v) => v.type === "depth")?.value || 0;
            const climatologyValue =
              monitored?.values.find((v) => v.type === "climatology_depth")
                ?.value || 0;

            return {
              ...wp,
              color: getWaterpointColor(depthValue, climatologyValue, wp.name),
            };
          });

          setOriginalWaterpoints(updatedWaterpoints);
          setFilteredWaterpoints(updatedWaterpoints);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [date]);

  useEffect(() => {
    const filtered = originalWaterpoints.filter((wp) => {
      // Caso especial para Muya y Bakke
      if (wp.name === "Muya" || wp.name === "Bakke") {
        return filter.brown;
      }
      // Caso especial para Ketala
      if (wp.name === "Ketala") {
        return filter.black;
      }
      return filter[wp.color];
    });

    setFilteredWaterpoints(filtered);
    setWpstolabel(filtered);
  }, [filter, originalWaterpoints]);

  const downloadMapAsJpg = async () => {
    try {
      const html = document.querySelector("#map");
      const canvas = await html2canvas(html, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        ignoreElements: (element) => {
          return element.classList?.contains("exclude");
        },
      });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "map_monitoring.jpg";
      link.click();
    } catch (error) {
      console.error("Error al descargar el mapa como JPG:", error);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
  };

  const handleWpClick = (wp) => {
    const map = mapRef.current;
    map.flyTo([wp.lat, wp.lon], 12);
  };

  const handlePlaceClick = (inicio_lat, inicio_lon) => {
    Services.get_route(
      inicio_lat,
      inicio_lon,
      waterpointRoute.lat,
      waterpointRoute.lon,
      profile
    )
      .then((response) => {
        response.paths[0].points.coordinates =
          response.paths[0].points.coordinates.map((coordinates) => [
            coordinates[1],
            coordinates[0],
          ]);
        setRoute(response.paths[0]);
        setShowSearchPlace(false);
      })
      .catch((error) => {
        if (error instanceof Error) {
          setAlert(true);
          setAlertText(t("monitoring.alert-route"));
        } else {
          console.log(error);
        }
      });
  };

  const popupData = (wp) => {
    if (wp.name === "Ketala") {
      return (
        <Marker
          position={[wp.lat, wp.lon]}
          icon={colorIconMap["black"]}
          key={wp.id}
        >
          <Popup closeButton={false} className="popup" maxWidth={200}>
            <div className="text-center">
              <WpLabel waterpoint={wp} />
              <h6 className="fw-medium mb-0 text-gray">Apologies,</h6>
              <p className="text-gray mt-0">
                There is currently no data available for your selected location.
              </p>
            </div>
          </Popup>
        </Marker>
      );
    }
    const monitoredData = monitored.find((data) => data.waterpointId === wp.id);
    const depthValue = monitoredData?.values.find(
      (value) => value.type === "depth"
    );
    const climatology_depthValue = monitoredData?.values.find(
      (value) => value.type === "climatology_depth"
    );

    const hasContentsWp =
      monitoredData?.am || monitoredData?.or || monitoredData?.en;

    return (
      <>
        {hasContentsWp && (
          <Modal show={showWarning} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {t("monitoring.modal-title") || "Warning"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {t("monitoring.modal-body") ||
                "The waterpoint profile is not available in the language selected, only in"}{" "}
              <strong>
                {monitoredData["en"]
                  ? "English"
                  : monitoredData["am"]
                  ? "Amharic"
                  : "Afaan Oromo"}
              </strong>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t("monitoring.modal-close") || "Close"}
              </Button>
              <Link
                type="button"
                className={`btn btn-primary text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-3 py-2 ${
                  hasContentsWp ? "" : "disabled "
                }`}
                to={`/profile/${wp.id}/${Object.keys(monitoredData).find(
                  (key) => monitoredData[key] === true
                )}`}
              >
                {t("monitoring.modal-continue") ||
                  "Continue to waterpoint profile"}
              </Link>
            </Modal.Footer>
          </Modal>
        )}

        <Marker
          position={[wp.lat, wp.lon]}
          icon={colorIconMap[wp.color]}
          key={wp.id}
        >
          <Popup closeButton={false} className="popup">
            <div>
              <div className="d-flex align-items-center justify-content-between ">
                <h6 className="fw-medium mb-0">
                  {t("monitoring.waterpoint")} {wp.name}{" "}
                </h6>
                <Dropdown variant="sm">
                  <Dropdown.Toggle
                    variant="outline-primary"
                    id="dropdown-basic"
                  >
                    <IconRoad style={{ position: "inherit" }} />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as="button"
                      onClick={() => {
                        setShowSearchPlace(true);
                        setProfile("foot");
                        setWaterpointRoute(wp);
                      }}
                    >
                      <IconWalk
                        style={{ position: "inherit" }}
                        className="me-2"
                      />
                      {t("monitoring.walk")}
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => {
                        setShowSearchPlace(true);
                        setProfile("car");
                        setWaterpointRoute(wp);
                      }}
                    >
                      <IconCar
                        style={{ position: "inherit" }}
                        className="me-2"
                      />
                      {t("monitoring.car")}
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => {
                        setShowSearchPlace(true);
                        setProfile("bike");
                        setWaterpointRoute(wp);
                      }}
                    >
                      <IconBike
                        style={{ position: "inherit" }}
                        className="me-2"
                      />
                      {t("monitoring.bike")}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <p className="mt-0 mb-2">
                {t("monitoring.date")}: {monitoredData.date.split("T")[0]}
              </p>
            </div>
            <table className="fs-6">
              <tbody>
                <tr>
                  <td>{t("monitoring.condition")}:</td>
                  <td>
                    <div
                      className={`td-name text-center fw-medium td-${wp.color}`}
                    >
                      {getStatusText(wp.color, t)}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="d-flex align-items-center ">
                    <OverlayTrigger
                      placement="left"
                      overlay={
                        <Tooltip id={`tooltip-left`}>
                          {t("monitoring.median-depth-info")}
                        </Tooltip>
                      }
                    >
                      <IconInfoCircleFilled />
                    </OverlayTrigger>
                    {t("monitoring.median-depth")} (%):
                  </td>
                  <td>{depthValue.value.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <p className="fs-6 mt-0">
              {depthValue.value < 0.2
                ? t("monitoring.near-m")
                : depthValue.value >= 0.2 && depthValue.value < 0.3
                ? t("monitoring.alert-m")
                : depthValue.value >= 0.3 && depthValue.value < 0.7
                ? t("monitoring.watch-m")
                : t("monitoring.good-m")}
            </p>
            <div className="d-flex justify-content-between mt-3">
              {hasContentsWp && !monitoredData[i18n.language] ? (
                <Button
                  className={`btn btn-primary text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-3 py-2 ${
                    hasContentsWp ? "" : "disabled "
                  }`}
                  onClick={() => setShowWarning(true)}
                >
                  <IconId style={{ position: "inherit" }} className="me-3" />
                  {t("monitoring.profile")}
                </Button>
              ) : (
                <Link
                  type="button"
                  className={`btn btn-primary btn-sm text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-2 py-2 ${
                    hasContentsWp ? "" : "disabled "
                  }`}
                  to={`/profile/${wp.id}`}
                >
                  <IconId style={{ position: "inherit" }} className="me-2" />
                  {t("monitoring.profile")}
                </Link>
              )}

              <a
                href={`/dashboard/${wp.id}`}
                className="btn btn-primary btn-sm text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-2 py-2 mx-2"
                role="button"
              >
                <IconChartDonut
                  style={{ position: "inherit" }}
                  className="me-2"
                />
                {t("monitoring.data")}
              </a>

              <Link
                type="button"
                className="btn btn-primary btn-sm text-white rounded-3 fw-medium d-flex align-items-center justify-content-between "
                to={`/forecast/${wp.id}`}
              >
                <IconCloudRain
                  style={{ position: "inherit" }}
                  className="me-2"
                />
                {t("monitoring.forecast")}
              </Link>
              <div className="mx-2">
                <SubscriptionButton
                  idWater={wp.id}
                  idUser={userInfo?.sub}
                  setShowToastSubscribe={setShowToastSubscribe}
                  setToastSuccess={setToastSuccess}
                  label
                  size
                  isMonitoringBtn
                  language={i18n.language}
                />
              </div>
            </div>
          </Popup>
        </Marker>
      </>
    );
  };

  return (
    <div id="map">
      <ToastContainer
        className="p-3 position-fixed"
        position="bottom-end"
        style={{ zIndex: 2000 }}
      >
        <Toast
          onClose={() => setShowToastSubscribe(false)}
          show={showToastSubscribe}
          delay={2000}
          className={!toastSuccess ? `bg-danger-subtle` : `bg-success-subtle`}
          autohide
        >
          <Toast.Body>
            {!toastSuccess
              ? t("subscriptionToast.unsubscribed")
              : t("subscriptionToast.subscribed")}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      {/* Modal de alert de obtener ubicacion */}
      <Modal show={alert} onHide={() => setAlert(false)} centered>
        <Modal.Body className="d-flex align-items-center ">
          <IconAlertCircleFilled
            className="me-2 text-danger"
            size={50}
          ></IconAlertCircleFilled>
          {alertText}
        </Modal.Body>
      </Modal>
      {/* Modal de buscar punto de inicio */}
      <Modal
        show={showSearchPlace}
        onHide={() => setShowSearchPlace(false)}
        centered
      >
        <Modal.Body className="d-flex flex-column">
          <p>{t("monitoring.modal-search")}</p>
          <SearchBar
            waterpoints={originalWaterpoints}
            type="places"
            onWpClick={handlePlaceClick}
          />
        </Modal.Body>
      </Modal>
      {/* Modal de loading */}
      <Modal
        show={loading}
        backdrop="static"
        keyboard={false}
        centered
        size="sm"
      >
        <Modal.Body className="d-flex align-items-center ">
          <Spinner animation="border" role="status" className="me-2" />
          {t("monitoring.loading")}
        </Modal.Body>
      </Modal>
      <MapContainer
        center={[9.149175, 40.498867]}
        zoom={6}
        style={{ height: "100vh", width: "100%" }}
        className="map-monitoring"
        zoomControl={false}
        ref={mapRef}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <WpLabel waterpoints={wpstolabel} />
        {route && (
          <Polyline
            color="#0016ff"
            positions={route.points.coordinates}
            weight={5}
          />
        )}
        {filteredWaterpoints.map((wp, i) => (
          <div key={i}>{loading ? null : popupData(wp)}</div>
        ))}
      </MapContainer>
      <div className="position-absolute top-left-bar d-flex gap-2 flex-column flex-md-row">
        <SearchBar
          bigSize={true}
          waterpoints={originalWaterpoints}
          onWpClick={handleWpClick}
          type="waterpoints"
        />
        <Form.Control
          className="date-picker rounded-4"
          type="date"
          aria-label="Monitored Date"
          value={date}
          onChange={handleDateChange}
          min="2001-01-01"
          max={endDate}
        />
      </div>

      <Legend setFilter={setFilter} filter={filter} />
      <Button
        id={route ? `btn-download-map-up` : `btn-download-map`}
        className="rounded-4 exclude"
        onClick={() => downloadMapAsJpg()}
      >
        <IconDownload size={20} />
      </Button>
      {route && <RouteInfo route={route} />}
    </div>
  );
}

export default Visualization;
