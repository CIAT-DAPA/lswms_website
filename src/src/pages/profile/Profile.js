import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import bgImg from "../../assets/img/profilebg.jpg";
import L from "leaflet";
import Simplelegend from "../../components/simpleLegend/Simplelegend";

import {
  Carousel,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "./Profile.css";
import {
  LayersControl,
  MapContainer,
  TileLayer,
  WMSTileLayer,
  Marker,
} from "react-leaflet";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import Services from "../../services/apiService";
import { useTranslation } from "react-i18next";
import ItemIconX from "../../components/itemIconX/ItemIconX";
import ItemIconY from "../../components/itemIconY/ItemIconY";
import ItemText from "../../components/itemText/ItemText";
import ItemTable from "../../components/itemTable/ItemTable";
import ItemSimpleList from "../../components/itemSimpleList/ItemSimpleList";
import ItemComplexList from "../../components/itemComplexList/ItemComplexList";
import Configuration from "../../conf/Configuration";

import { useAuth } from "../../hooks/useAuth";
import NavigationGroupBtns from "../../components/navigationGroupBtns/NavigationGroupBtns";

function Waterprofile() {
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
  const [t, i18n] = useTranslation("global");
  const { idWater, language } = useParams();
  const [wp, setWp] = useState();
  const [wpProfile, setWpProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(true);

  const [wsTable, setWsTable] = useState(null);
  const [show, setShow] = useState(false);
  const [showToastSubscribe, setShowToastSubscribe] = useState(false);
  const [toastSuccess, setToastSuccess] = useState();
  const { userInfo } = useAuth();

  useEffect(() => {
    fetchWaterProfile();
  }, []);

  useEffect(() => {
    if (language && i18n.language !== language) {
      setShow(true);
    }

    fetchWaterProfile();
  }, [i18n.language]);

  useEffect(() => {
    if (wp) {
      const { adm1, adm2, adm3, watershed_name } = wp;
      setWsTable({ adm1, adm2, adm3, watershed_name });
    }
  }, [wp]);

  // Función para obtener los datos del perfil del agua
  const fetchWaterProfile = () => {
    const languageProfile = language || i18n.language;
    setLoading(true);
    Services.get_waterpoints_profile(idWater, languageProfile)
      .then((response) => {
        setWp(response[0]);
        if (response[0].contents_wp.length > 0)
          setWpProfile({
            contents_wp: response[0].contents_wp,
            contents_ws: response[0].contents_ws,
          });
        else setShow(true);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getPopulationByLanguage = () => {
    if (i18n.language === "en") {
      return wp.contents_wp
        .find((e) => e.title === "general")
        ?.values?.find((e) => "population" in e)?.population;
    } else if (i18n.language === "am") {
      return wp.contents_wp
        .find((e) => e.title === "አጠቃላይ")
        ?.values?.find((e) => "የህዝብ ብዛት" in e)?.["የህዝብ ብዛት"];
    } else if (i18n.language === "or") {
      return wp.contents_wp
        .find((e) => e.title === "Waliigala")
        ?.values?.find((e) => "Baay'ina uummataa" in e)?.["Baay'ina uummataa"];
    } else {
      return "";
    }
  };

  // Generate the pdf based on a component
  const downloadProfileAsPdf = async () => {
    let html = document.querySelector("#profile");
    console.log(html.offsetWidth, html.offsetHeight);
    let report = new JsPDF("p", "px", [
      html.offsetHeight + 50,
      html.offsetWidth + 50,
    ]);
    const canvas = await html2canvas(html, {
      useCORS: true,
      allowTaint: true,
      onrendered: function (canvas) {
        document.body.appendChild(canvas);
      },
    });
    const img = canvas.toDataURL("image/png");
    report.addImage(img, "JPEG", 20, 20, html.offsetWidth, html.offsetHeight);
    report.save(`Profile_${wp.name}.pdf`);
  };

  const renderWpItem = (item, type, index, title) => {
    if (type === "icon-x") {
      return <ItemIconX item={item} key={index} />;
    } else if (type === "icon-y") {
      return <ItemIconY item={item} key={index} />;
    } else if (type === "text") {
      return <ItemText item={item} key={index} />;
    } else if (type === "table") {
      return <ItemTable item={item} key={index} title={title} />;
    } else if (type === "simple-list") {
      return <ItemSimpleList item={item} key={index} />;
    } else if (type === "complex-list") {
      return <ItemComplexList item={item} key={index} />;
    } else {
      return <></>;
    }
  };
  console.log(wp)
  return (
    <>
      {idWater ? (
        loading ? (
          <Modal
            show={loading}
            backdrop="static"
            keyboard={false}
            centered
            size="sm"
          >
            <Modal.Body className="d-flex align-items-center ">
              <Spinner animation="border" role="status" className="me-2" />
              {t("profile.loading")}
            </Modal.Body>
          </Modal>
        ) : (
          <>
            <ToastContainer
              className="p-3 position-fixed "
              position="bottom-end"
              style={{ zIndex: 1 }}
            >
              <Toast
                show={show}
                onClose={() => setShow(false)}
                autohide
                delay={3000}
              >
                <Toast.Header className="bg-warning-subtle">
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                  />
                  <strong className="me-auto">
                    {t("profile.toast-title") || "Warning"}
                  </strong>
                </Toast.Header>
                <Toast.Body>
                  {t("profile.toast-body") ||
                    "The waterpoint profile is not available in the language selected"}
                </Toast.Body>
              </Toast>
            </ToastContainer>

            <ToastContainer
              className="p-3 position-fixed"
              position="bottom-end"
              style={{ zIndex: 2000 }}
            >
              <Toast
                onClose={() => setShowToastSubscribe(false)}
                show={showToastSubscribe}
                delay={2000}
                className={
                  !toastSuccess ? `bg-danger-subtle` : `bg-success-subtle`
                }
                autohide
              >
                <Toast.Body>
                  {!toastSuccess
                    ? t("subscriptionToast.unsubscribed")
                    : t("subscriptionToast.subscribed")}
                </Toast.Body>
              </Toast>
            </ToastContainer>

            <div id="profile">
              <div className="profile-bg">
                <div
                  className="position-absolute z-3 d-flex align-items-center"
                  style={{ top: "43%", right: "3vw" }}
                >
                  <NavigationGroupBtns
                    wp={wp}
                    noProfile
                    downloadAction={downloadProfileAsPdf}
                    infoWhite
                    idWater={idWater}
                    idUser={userInfo?.sub}
                    setShowToastSubscribe={setShowToastSubscribe}
                    setToastSuccess={setToastSuccess}
                  />
                </div>
                <Carousel
                  fade
                  controls={false}
                  interval={5000}
                  pause={false}
                  className="w-100"
                >
                  <Carousel.Item>
                    <img src={bgImg} className="w-100 img-carousel" />
                    <Carousel.Caption className="mb-5 mb-md-0">
                      <h5 className="fw-medium">{`${wp.adm1}, ${wp.adm2}, ${wp.adm3}, ${wp.watershed_name}`}</h5>
                      <h1 className="fw-normal my-2">{wp.name}</h1>
                      <p className="fw-normal">
                        {t("profile.area")}: {wp.area} ha <br />{" "}
                        {t("profile.population")}: {getPopulationByLanguage()}
                        <br /> Lat: {wp.lat}, Lon: {wp.lon}
                      </p>
                    </Carousel.Caption>
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      src={bgImg}
                      style={{ filter: "grayscale(1)" }}
                      className="w-100 img-carousel"
                    />
                    <Carousel.Caption className="mb-5 mb-md-0">
                      <h5 className="fw-medium">{`${wp.adm1}, ${wp.adm2}, ${wp.adm3}, ${wp.watershed_name}`}</h5>
                      <h1 className="fw-normal my-2">{wp.name}</h1>
                      <p className="fw-normal">
                        {t("profile.area")}: {wp.area} ha <br />{" "}
                        {t("profile.population")}: {getPopulationByLanguage()}
                        <br /> Lat: {wp.lat}, Lon: {wp.lon}
                      </p>
                    </Carousel.Caption>
                  </Carousel.Item>
                </Carousel>
              </div>
              <Container className="mt-3">
                <Modal
                  show={loaded}
                  backdrop="static"
                  keyboard={false}
                  centered
                  size="sm"
                  zIndex={1000}
                >
                  <Modal.Body className="d-flex align-items-center">
                    <Spinner
                      animation="border"
                      role="status"
                      className="me-2"
                    />
                    {t("profile.loading-wateshed")}
                  </Modal.Body>
                </Modal>
                <Row>
                  <Col className="col-12 col-md-8">
                    <h4 className="fw-medium">{t("profile.map")}</h4>
                    <MapContainer
                      center={[wp.lat, wp.lon]}
                      zoom={14}
                      style={{
                        height: "400px",
                        width: "100%",
                      }}
                    >
                      <Marker
                        position={[wp.lat, wp.lon]}
                        icon={
                          wp.depth ==0 && wp.climatology_depth ==0
                            ? grayIcon
                            : wp.depth >= 0 && wp.depth <0.2
                            ? redIcon
                            : wp.depth > 0.2 && wp.depth < 0.3
                            ? brownIcon
                            : wp.depth > 0.3 && wp.depth < 0.7
                            ? yellowIcon
                            : greenIcon
                        }
                        key={wp.id}
                      ></Marker>
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
                            cql_filter={`Name='${wp.watershed_name}'`}
                            zIndex={1000}
                            eventHandlers={{
                              load: () => {
                                setLoaded(false);
                              },
                            }}
                          />
                        </LayersControl.Overlay>
                      </LayersControl>
                      <Simplelegend />
                    </MapContainer>
                    <h4 className="mt-4 mb-3">{t("profile.watershed")}</h4>

                    {wpProfile?.contents_ws.length > 0 && (
                      <div>
                        {wpProfile.contents_ws
                          .reduce((acc, e, index) => {
                            if (e.position === "left") {
                              const existingGroup = acc.find(
                                (group) =>
                                  group.typecontent_name === e.typecontent_name
                              );

                              if (existingGroup) {
                                existingGroup.items.push(e);
                              } else {
                                acc.push({
                                  typecontent_name: e.typecontent_name,
                                  items: [e],
                                });
                              }
                            }
                            return acc;
                          }, [])
                          .map((group, groupIndex) => (
                            <div key={groupIndex}>
                              <h5 className="text-capitalize mt-3">
                                {group.typecontent_name}
                              </h5>
                              {group.items.map((item, itemIndex) => (
                                <div key={itemIndex}>
                                  {renderWpItem(item, item.type, itemIndex)}
                                </div>
                              ))}
                            </div>
                          ))}
                      </div>
                    )}
                    <h4 className="mt-4 mb-3">{t("profile.waterpoint")}</h4>

                    {wpProfile?.contents_wp.length > 0 && (
                      <div>
                        {wpProfile.contents_wp
                          .reduce((acc, e, index) => {
                            if (e.position === "left") {
                              const existingGroup = acc.find(
                                (group) =>
                                  group.typecontent_name === e.typecontent_name
                              );

                              if (existingGroup) {
                                existingGroup.items.push(e);
                              } else {
                                acc.push({
                                  typecontent_name: e.typecontent_name,
                                  items: [e],
                                });
                              }
                            }
                            return acc;
                          }, [])
                          .map((group, groupIndex) => (
                            <div key={groupIndex}>
                              <h5 className="text-capitalize mt-3">
                                {group.typecontent_name}
                              </h5>
                              {group.items.map((item, itemIndex) => (
                                <div key={itemIndex}>
                                  {renderWpItem(item, item.type, itemIndex)}
                                </div>
                              ))}
                            </div>
                          ))}
                      </div>
                    )}
                  </Col>
                  <Col className="col-12 col-md-4">
                    <h4 className="text-capitalize ">
                      {t("profile.watershed-d")}
                    </h4>
                    {wsTable &&
                      renderWpItem(
                        wsTable,
                        "table",
                        0,
                        "Watershed description"
                      )}
                    {wpProfile?.contents_ws.length > 0 && (
                      <div>
                        {wpProfile.contents_ws
                          .reduce((acc, e, index) => {
                            if (e.position === "right") {
                              const existingGroup = acc.find(
                                (group) =>
                                  group.typecontent_name === e.typecontent_name
                              );

                              if (existingGroup) {
                                existingGroup.items.push(e);
                              } else {
                                acc.push({
                                  typecontent_name: e.typecontent_name,
                                  items: [e],
                                });
                              }
                            }
                            return acc;
                          }, [])
                          .map((group, groupIndex) => (
                            <div key={groupIndex}>
                              <h5 className="text-capitalize mt-3">
                                {group.typecontent_name}
                              </h5>
                              {group.items.map((item, itemIndex) => (
                                <div key={itemIndex}>
                                  {renderWpItem(item, item.type, itemIndex)}
                                </div>
                              ))}
                            </div>
                          ))}
                      </div>
                    )}
                    <h4 className="text-capitalize ">
                      {t("profile.waterpoint-d")}
                    </h4>
                    {wpProfile?.contents_wp.length > 0 && (
                      <div>
                        {wpProfile.contents_wp
                          .reduce((acc, e, index) => {
                            if (e.position === "right") {
                              const existingGroup = acc.find(
                                (group) =>
                                  group.typecontent_name === e.typecontent_name
                              );

                              if (existingGroup) {
                                existingGroup.items.push(e);
                              } else {
                                acc.push({
                                  typecontent_name: e.typecontent_name,
                                  items: [e],
                                });
                              }
                            }
                            return acc;
                          }, [])
                          .map((group, groupIndex) => (
                            <div key={groupIndex}>
                              <h5 className="text-capitalize mt-3">
                                {group.typecontent_name}
                              </h5>
                              {group.items.map((item, itemIndex) => (
                                <div key={itemIndex}>
                                  {renderWpItem(item, item.type, itemIndex)}
                                </div>
                              ))}
                            </div>
                          ))}
                      </div>
                    )}
                  </Col>
                </Row>
              </Container>
            </div>
            <Container className="mb-2 mt-2 d-flex justify-content-between ">
              <div className="d-flex align-items-center mb-2 mt-4">
                <NavigationGroupBtns
                  wp={wp}
                  data
                  forecast
                  download
                  downloadAction={downloadProfileAsPdf}
                  share
                  subscription
                  label
                  noTooltip
                  idWater={idWater}
                  idUser={userInfo?.sub}
                  setShowToastSubscribe={setShowToastSubscribe}
                  setToastSuccess={setToastSuccess}
                />
              </div>
            </Container>
          </>
        )
      ) : (
        <div
          style={{ height: "100vh" }}
          className="d-flex justify-content-around flex-column align-items-center flex-lg-row"
        >
          <img src={img404} alt="" />
          <div>
            <h1>{t("profile.notFound-title")}</h1>
            <p>{t("profile.notFound-d")}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Waterprofile;
