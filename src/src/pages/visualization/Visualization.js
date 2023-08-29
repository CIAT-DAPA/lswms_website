import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import profileIcon from "../../assets/svg/profile.svg";
import dataIcon from "../../assets/svg/data.svg";
import { Link } from "react-router-dom";
import "./Visualization.css";
import Configuration from "../../conf/Configuration";
import axios from "axios";
import { Modal, Spinner } from "react-bootstrap";
import Legend from "../../components/legend/Legend";
import { useTranslation } from "react-i18next";

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

  const urlWp = `${Configuration.get_url_api_base()}/waterpointsprofiles`;
  const [waterpoints, setWaterpoints] = useState([]);
  const [monitored, setMonitored] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Call to API to get waterpoints
    axios
      .get(urlWp)
      .then((response) => {
        setWaterpoints(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (waterpoints.length > 0) {
      //Call to API to get each monitored data for each wp
      const idsWp = waterpoints.map((item) => item.id);
      const requests = idsWp.map((id) =>
        axios.get(`${Configuration.get_url_api_base()}/lastmonitored/${id}`)
      );

      Promise.all(requests)
        .then((responses) => {
          const monitoredData = responses.map((response) => {
            return response.data[0];
          });
          setMonitored(monitoredData);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [waterpoints]);

  const popupData = (wp) => {
    // Find the corresponding monitored data for the current waterpoint
    const monitoredData = monitored.find((data) => data.waterpointId === wp.id);

    // Get the value of depth if the monitored data is found
    const depthValue = monitoredData
      ? monitoredData.values.find((value) => value.type === "depth")
      : null;
    const scaledDepthValue = monitoredData
      ? monitoredData.values.find((value) => value.type === "scaled_depth")
      : null;

    // If there is wp content or not
    const hasContentsWp = wp.contents_wp.length > 0;

    return (
      <Marker
        position={[wp.lat, wp.lon]}
        icon={
          scaledDepthValue.value > 100
            ? greenIcon
            : scaledDepthValue.value <= 100 && scaledDepthValue.value >= 50
            ? yellowIcon
            : scaledDepthValue.value < 50 && scaledDepthValue.value >= 3
            ? brownIcon
            : scaledDepthValue.value < 3 && scaledDepthValue.value > 0
            ? redIcon
            : grayIcon
        }
        key={wp.id}
      >
        <Popup>
          <div>
            <h6 className="fw-medium mb-0">
              {t("monitoring.waterpoint")} {wp.name} {t("monitoring.overview")}
            </h6>
            <p className="mt-0 mb-2">
              {t("monitoring.date")}: {monitoredData.date.split("T")[0]}
            </p>
          </div>
          <table className="fs-6">
            <tbody>
              <tr>
                <td>{t("monitoring.name")}:</td>
                <td>
                  <div
                    className={`td-name text-center fw-medium ${
                      scaledDepthValue.value > 100
                        ? "td-green"
                        : scaledDepthValue.value <= 100 &&
                          scaledDepthValue.value >= 50
                        ? "td-yellow"
                        : scaledDepthValue.value < 50 &&
                          scaledDepthValue.value >= 3
                        ? "td-brown"
                        : scaledDepthValue.value < 3 &&
                          scaledDepthValue.value > 0
                        ? "td-red"
                        : "td-gray"
                    }`}
                  >
                    {wp.name}
                  </div>
                </td>
              </tr>
              <tr>
                <td>{t("monitoring.depth")} (%):</td>
                <td>{depthValue.value}</td>
              </tr>
              <tr>
                <td>{t("monitoring.median-depth")} (%):</td>
                <td>{scaledDepthValue.value}</td>
              </tr>
              <tr>
                <td>{t("monitoring.area")} (ha):</td>
                <td>{wp.area}</td>
              </tr>
            </tbody>
          </table>
          <p className="fs-6 mt-0">
            {scaledDepthValue.value > 100
              ? t("monitoring.good-m")
              : scaledDepthValue.value <= 100 && scaledDepthValue.value >= 50
              ? t("monitoring.watch-m")
              : scaledDepthValue.value < 50 && scaledDepthValue.value >= 3
              ? t("monitoring.alert-m")
              : scaledDepthValue.value < 3 && scaledDepthValue.value > 0
              ? t("monitoring.near-m")
              : t("monitoring.seasonally-m")}
          </p>
          <div className="d-flex justify-content-between mt-3">
            <Link
              type="button"
              className={`btn btn-primary text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-3 py-2 ${
                hasContentsWp ? "" : "disabled "
              }`}
              to="/waterprofile"
              state={{ idWater: wp.id }}
            >
              <img src={profileIcon} alt="" className="me-3" />
              {t("monitoring.profile")}
            </Link>

            <Link
              type="button"
              className="btn btn-primary text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-3 py-2"
              to="/historicaldata"
              state={{ idWater: wp.id }}
            >
              <img src={dataIcon} alt="" className="me-3" />
              {t("monitoring.data")}
            </Link>
          </div>
        </Popup>
      </Marker>
    );
  };

  return (
    <>
      <Modal
        show={loading}
        backdrop="static"
        keyboard={false}
        centered
        size="sm"
      >
        <Modal.Body className="d-flex align-items-center ">
          <Spinner animation="border" role="status" className="me-2" />
          Getting the waterpoints...
        </Modal.Body>
      </Modal>
      <MapContainer
        center={[9.149175, 40.498867]}
        zoom={6}
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waterpoints.map((wp, i) => {
          return <div key={i}>{loading ? <></> : popupData(wp)}</div>;
        })}
      </MapContainer>
      <Legend />
    </>
  );
}

export default Visualization;
