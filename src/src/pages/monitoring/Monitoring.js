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
} from "@tabler/icons-react";
import RouteInfo from "../../components/routeInfo/RouteInfo";
import WpLabel from "../../components/wpLabel/WpLabel";
import SubscriptionButton from "../../components/subscriptionButton/SubscriptionButton";
import { useAuth } from "../../hooks/useAuth";

function Visualization() {
  const [t, i18n] = useTranslation("global");
  //Options for leaflet map
  const greenIcon = new L.Icon({
    iconUrl: require(`../../assets/img/greenMarker.png`),
    iconSize: [32, 32],
  });
  const yellowIcon = new L.Icon({
    iconUrl: require(`../../assets/img/yellowMarker.png`),
    iconSize: [32, 32],
  });
  const brownIcon = new L.Icon({
    iconUrl: require(`../../assets/img/brownMarker.png`),
    iconSize: [32, 32],
  });
  const redIcon = new L.Icon({
    iconUrl: require(`../../assets/img/redMarker.png`),
    iconSize: [32, 32],
  });
  const grayIcon = new L.Icon({
    iconUrl: require(`../../assets/img/grayMarker.png`),
    iconSize: [32, 32],
  });
  const mapRef = useRef(null);
  const [waterpoints, setWaterpoints] = useState([]);
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
  });
  const [showWarning, setShowWarning] = useState(false);
  const [profile, setProfile] = useState();
  const [waterpointRoute, setWaterpointRoute] = useState();
  const [toastSuccess, setToastSuccess] = useState();
  const [showToastSubscribe, setShowToastSubscribe] = useState(false);
  const { userInfo } = useAuth();
  const [wpstolabel, SetWpstolabel] = useState();

  const handleClose = () => setShowWarning(false);

  useEffect(() => {
    //Call to API to get waterpoints
    Services.get_all_waterpoints()
      .then((response) => {
        setWaterpoints(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (waterpoints.length > 0) {
      const idsWp = waterpoints.map((item) => item.id);
      const requests = idsWp.map((id) => Services.get_last_data(id));

      Promise.all(requests)
        .then((responses) => {
          const monitoredData = responses.map((response) => response.data[0]);
          setMonitored(monitoredData);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [waterpoints.length]);

  monitored.forEach((val) => {
    const scaledDepth = val.values.find(
      (val) => val.type === "scaled_depth"
    ).value;
    const climatologyScaledDepth = val.values.find(
      (val) => val.type === "climatology_scaled_depth"
    ).value;
    let color;
    if (scaledDepth === 0) {
      color = "gray";
    } else if (scaledDepth > climatologyScaledDepth) {
      color = "green";
    } else if (climatologyScaledDepth === 0) {
      color = "gray";
    } else {
      const ratio = scaledDepth / climatologyScaledDepth;
      if (ratio > 0.5) {
        color = "yellow";
      } else if (ratio > 0.03) {
        color = "brown";
      } else {
        color = "red";
      }
    }
    const waterpointId = val.waterpointId;
    const first = waterpoints.find((item) => item.id === waterpointId);
    if (first) {
      first.color = color;
    }
  });
  waterpoints.forEach((waterpoint) => {
    waterpoint.show = true;
  });

  useEffect(() => {
    waterpoints.forEach((waterpoint) => {
      if (filter[waterpoint.color] === false) {
        waterpoint.show = false;
      }
    });
    SetWpstolabel(waterpoints.filter((wp) => wp.show));
  }, [filter, waterpoints]);

  const popupData = (wp) => {
    const monitoredData = monitored.find((data) => data.waterpointId === wp.id);
    const depthValue = monitoredData
      ? monitoredData.values.find((value) => value.type === "depth")
      : null;
    const scaledDepthValue = monitoredData
      ? monitoredData.values.find((value) => value.type === "scaled_depth")
      : null;
    const scaledDepthClimatologyValue = monitoredData
      ? monitoredData.values.find(
          (value) => value.type === "climatology_scaled_depth"
        )
      : null;
    const hasContentsWp =
      monitoredData.am || monitoredData.or || monitoredData.en;

    return !filter.green &&
      scaledDepthValue.value >
        scaledDepthClimatologyValue.value ? null : !filter.yellow &&
      scaledDepthValue.value / scaledDepthClimatologyValue.value > 0.5 &&
      scaledDepthValue.value <=
        scaledDepthClimatologyValue.value ? null : !filter.brown &&
      scaledDepthValue.value / scaledDepthClimatologyValue.value > 0.03 &&
      scaledDepthValue.value / scaledDepthClimatologyValue.value <=
        0.5 ? null : !filter.red &&
      !(
        scaledDepthValue.value > scaledDepthClimatologyValue.value ||
        scaledDepthValue.value / scaledDepthClimatologyValue.value > 0.5 ||
        scaledDepthValue.value / scaledDepthClimatologyValue.value > 0.03 ||
        (scaledDepthValue.value === 0 &&
          scaledDepthClimatologyValue.value === 0)
      ) ? null : !filter.gray &&
      scaledDepthValue.value === 0 &&
      scaledDepthClimatologyValue.value === 0 ? null : (
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
          icon={
            scaledDepthValue.value > scaledDepthClimatologyValue.value
              ? greenIcon
              : scaledDepthValue.value / scaledDepthClimatologyValue.value > 0.5
              ? yellowIcon
              : scaledDepthValue.value / scaledDepthClimatologyValue.value >
                0.03
              ? brownIcon
              : scaledDepthValue.value === 0 &&
                scaledDepthClimatologyValue.value === 0
              ? grayIcon
              : redIcon
          }
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
                      className={`td-name text-center fw-medium ${
                        scaledDepthValue.value >
                        scaledDepthClimatologyValue.value
                          ? "td-green"
                          : scaledDepthValue.value /
                              scaledDepthClimatologyValue.value >
                            0.5
                          ? "td-yellow"
                          : scaledDepthValue.value /
                              scaledDepthClimatologyValue.value >
                            0.03
                          ? "td-brown"
                          : scaledDepthValue.value === 0 &&
                            scaledDepthClimatologyValue.value === 0
                          ? "td-gray"
                          : "td-red"
                      }`}
                    >
                      {scaledDepthValue.value >
                      scaledDepthClimatologyValue.value
                        ? t("monitoring.good")
                        : scaledDepthValue.value /
                            scaledDepthClimatologyValue.value >
                          0.5
                        ? t("monitoring.watch")
                        : scaledDepthValue.value /
                            scaledDepthClimatologyValue.value >
                          0.03
                        ? t("monitoring.alert")
                        : scaledDepthValue.value === 0 &&
                          scaledDepthClimatologyValue.value === 0
                        ? t("monitoring.seasonally")
                        : t("monitoring.near")}
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
                  <td>{scaledDepthValue.value.toFixed(2)}</td>
                </tr>
                {/* <tr>
                  <td>{t("monitoring.area")} (ha):</td>
                  <td>{wp.area}</td>
                </tr> */}
              </tbody>
            </table>
            <p className="fs-6 mt-0">
              {scaledDepthValue.value > scaledDepthClimatologyValue.value
                ? t("monitoring.good-m")
                : scaledDepthValue.value / scaledDepthClimatologyValue.value >
                  0.5
                ? t("monitoring.watch-m")
                : scaledDepthValue.value / scaledDepthClimatologyValue.value >
                  0.03
                ? t("monitoring.alert-m")
                : scaledDepthValue.value === 0 &&
                  scaledDepthClimatologyValue.value === 0
                ? t("monitoring.seasonally-m")
                : t("monitoring.near-m")}
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

  return (
    <>
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
            waterpoints={waterpoints}
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
        style={{
          height: "100vh",
          width: "100%",
        }}
        className="map-monitoring"
        zoomControl={false}
        ref={mapRef}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waterpoints && <WpLabel waterpoints={wpstolabel} />}

        {route && (
          <Polyline
            color="#0016ff"
            positions={route.points.coordinates}
            weight={5}
          />
        )}
        {waterpoints.map((wp, i) => (
          <div key={i}>{loading ? <></> : popupData(wp)}</div>
        ))}
      </MapContainer>
      <SearchBar
        bigSize={true}
        waterpoints={waterpoints}
        onWpClick={handleWpClick}
        type="waterpoints"
      />
      <Legend setFilter={setFilter} filter={filter} />
      {route && <RouteInfo route={route} />}
    </>
  );
}

export default Visualization;
