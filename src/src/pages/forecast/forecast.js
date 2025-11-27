import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import noDataImg from "../../assets/img/noSubscription.png";
import { useAuth } from "../../hooks/useAuth";

import {
  Col,
  Container,
  Modal,
  Row,
  Spinner,
  ToastContainer,
  Toast,
} from "react-bootstrap";

import ForecastItem from "../../components/forecastItem/ForecastItem";
import Services from "../../services/apiService";
import { useTranslation } from "react-i18next";
import "./Forecast.css";
import NavigationGroupBtns from "../../components/navigationGroupBtns/NavigationGroupBtns";

function Forecast() {
  const { userInfo } = useAuth();
  const [showToastSubscribe, setShowToastSubscribe] = useState(false);
  const [toastSuccess, setToastSuccess] = useState();
  const [show, setShow] = useState(false);

  const [t, i18n] = useTranslation("global");
  const [wp, setWp] = useState();
  const [wpData, setWpData] = useState();
  const [loading, setLoading] = useState(true);

  // Nuevo formato: vienen directo del endpoint seasonal_sub_forecast
  const [subseasonal, setSubseasonal] = useState(null); // {year, month, weeks:[...]}
  const [seasonal, setSeasonal] = useState(null);       // {year, month, measure, lower, normal, upper}

  const { idWp } = useParams();

  // Perfil del waterpoint
  useEffect(() => {
    if (!idWp) return;

    // Call to API to get waterpoint profile
    Services.get_waterpoints_profile(idWp, i18n.language)
      .then((response) => {
        if (response && response.length > 0) {
          setWp(response[0]);
        } else {
          setWp(null);
        }
      })
      .catch((error) => {
        console.log(error);
        setWp(null);
      });
  }, [idWp, i18n.language]);

  // Datos monitoreados para el gráfico / info histórica
  useEffect(() => {
    if (!idWp) return;

    Services.get_data_monitored(idWp)
      .then((response) => {
        setWpData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [idWp]);

  // Listener para refrescar al navegar atrás
  useEffect(() => {
    const handler = () => window.location.reload();
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Nuevo: obtener forecasts desde NUEVO endpoint backend
  useEffect(() => {
    if (!idWp) return;

    Services.get_forecasts(idWp)
      .then((response) => {
        if (!response) return;
        setSeasonal(response.seasonal || null);
        setSubseasonal(response.subseasonal || null);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [idWp]);

  return (
    <div>
      {idWp ? (
        loading || !wp ? (
          <Modal
            show={loading}
            backdrop="static"
            keyboard={false}
            centered
            size="sm"
          >
            <Modal.Body className="d-flex align-items-center ">
              <Spinner animation="border" role="status" className="me-2" />
              {t("data.loading")}
            </Modal.Body>
          </Modal>
        ) : (
          <>
            {/* Toast para idioma de perfil */}
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

            {/* Toast para suscripciones */}
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

            <Container className="">
              {/* Header con info del WP */}
              <Row className="pt-5 border-bottom border-2">
                <Container className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="pt-2 mb-0">{wp.name}</h1>
                    <p className="mb-0">{`${wp.adm1}, ${wp.adm2}, ${wp.adm3}, ${wp.watershed_name}`}</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <NavigationGroupBtns
                      noDownload
                      noForecast
                      idWater={idWp}
                      idUser={userInfo?.sub}
                      setShowToastSubscribe={setShowToastSubscribe}
                      setToastSuccess={setToastSuccess}
                      wp={wp}
                      wpId={wp.id}
                      positionTooltip="bottom"
                    />
                  </div>
                </Container>
              </Row>

              {/* Subseasonal */}
              <Row className="mt-3">
                <h5 className="mb-0">{t("data.subseasonal")}</h5>
                <p className="fw-light ">
                  {t("data.source")}:{" "}
                  <a
                    className="edacap-link"
                    href="https://edacap.ethioagroclimate.net/#/Home"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AClimate Ethiopia{" "}
                  </a>
                </p>
                <p>{t("data.subseasonal-d")}</p>

                {subseasonal && subseasonal.weeks && subseasonal.weeks.length > 0 ? (
                  subseasonal.weeks.map((week, i) => (
                    <Col className="col-12 col-md-3" key={i}>
                      <ForecastItem
                        year={subseasonal.year}
                        month={subseasonal.month}
                        week={week.week}
                        probabilities={{
                          measure: week.measure,
                          lower: week.lower,
                          normal: week.normal,
                          upper: week.upper,
                        }}
                        name={wp.name}
                      />
                    </Col>
                  ))
                ) : (
                  <div className="d-flex flex-column align-items-center ">
                    <h6 className=" mb-1 ">{t("data.no-forecast")}</h6>
                    <img src={noDataImg} alt="no data available" height={200} />
                  </div>
                )}
              </Row>

              {/* Seasonal */}
              <Row className="mt-3 justify-content-around ">
                <h5 className="mb-0">{t("data.seasonal")}</h5>
                <p className="fw-light ">
                  {t("data.source")}: AClimate Ethiopia
                </p>
                <p>{t("data.seasonal-d")}</p>

                {seasonal ? (
                  <Col className="col-12 col-md-4">
                    <ForecastItem
                      year={seasonal.year}
                      month={seasonal.month}
                      probabilities={{
                        measure: seasonal.measure,
                        lower: seasonal.lower,
                        normal: seasonal.normal,
                        upper: seasonal.upper,
                      }}
                      name={wp.name}
                    />
                  </Col>
                ) : (
                  <div className="d-flex flex-column align-items-center ">
                    <h6 className=" mb-1 ">{t("data.no-forecast")}</h6>
                    <img src={noDataImg} alt="no data available" height={200} />
                  </div>
                )}
              </Row>
            </Container>

            {/* Botones de navegación abajo */}
            <Container className="mb-2 mt-2 d-flex justify-content-between ">
              <div className="d-flex align-items-center">
                <NavigationGroupBtns
                  noDownload
                  noForecast
                  idWater={idWp}
                  idUser={userInfo?.sub}
                  setShowToastSubscribe={setShowToastSubscribe}
                  setToastSuccess={setToastSuccess}
                  wp={wp}
                  wpId={wp.id}
                  positionTooltip="bottom"
                  label
                  noTooltip
                />
              </div>
            </Container>
          </>
        )
      ) : (
        // Caso sin idWp
        <div
          style={{ height: "100vh" }}
          className="d-flex justify-content-around flex-column align-items-center flex-lg-row"
        >
          <img src={img404} alt="" />
          <div>
            <h1>{t("data.notFound-title")}</h1>
            <p>{t("data.notFound-d")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Forecast;