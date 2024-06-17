import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import noDataImg from "../../assets/img/noSubscription.png";
import SubscriptionButton from "../../components/subscriptionButton/SubscriptionButton";
import { useAuth } from "../../hooks/useAuth";

import {
  Col,
  Container,
  Modal,
  Row,
  Spinner,
  Button,
  OverlayTrigger,
  Popover,
  Tooltip,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import {
  IconDownload,
  IconChartDonut,
  IconShare,
  IconBrandFacebook,
  IconBrandX,
  IconInfoCircleFilled,
  IconInfoCircle,
  IconCloudRain,
} from "@tabler/icons-react";
import ForecastItem from "../../components/forecastItem/ForecastItem";
import Services from "../../services/apiService";
import { useTranslation } from "react-i18next";
import "./Forecast.css";

function Forecast() {
  const { userInfo } = useAuth();
  const [showToastSubscribe, setShowToastSubscribe] = useState(false);
  const [toastSuccess, setToastSuccess] = useState();
  const [show, setShow] = useState(false);

  const [t, i18n] = useTranslation("global");
  const [wp, setWp] = useState();
  const [wpData, setWpData] = useState();
  const [loading, setLoading] = useState(true);
  const [aclimateId, setAclimateId] = useState(null);
  const [subseasonal, setSubseasonal] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const { idWp } = useParams();

  useEffect(() => {
    //Call to API to get waterpoint
    Services.get_waterpoints_profile(idWp, i18n.language)
      .then((response) => {
        setWp(response[0]);
      })
      .catch((error) => {
        console.log(error);
      });

    //Call to API to get climatology
    Services.get_one_waterpoints(idWp)
      .then((response) => {
        setAclimateId(response[0].aclimate_id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [idWp, i18n.language]);

  useEffect(() => {
    //Call to API to get monitored data waterpoints
    Services.get_data_monitored(idWp)
      .then((response) => {
        setWpData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [idWp]);

  useEffect(() => {
    if (wpData) {
      const years = [
        ...new Set(wpData.map((item) => new Date(item.date).getFullYear())),
      ];
      years.sort((a, b) => b - a);
    }
  }, [wpData]);

  useEffect(() => {
    window.addEventListener("popstate", (event) => {
      window.location.reload();
    });
  }, []);

  useEffect(() => {
    if (aclimateId) {
      //Call to API to get forecast
      Services.get_subseasonal(aclimateId)
        .then((response) => {
          setSubseasonal(response);
        })
        .catch((error) => {
          console.log(error);
        });

      Services.get_seasonal(aclimateId)
        .then((response) => {
          setSeasonal(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [aclimateId]);

  const popoverShare = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">{t("profile.share")}</Popover.Header>
      <Popover.Body>
        <Button
          className="me-2 btn-facebook"
          onClick={() => {
            const url = window.location.href;
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
              url
            )}`;
            window.open(shareUrl, "_blank");
          }}
        >
          <IconBrandFacebook />
        </Button>
        <Button
          className="btn-x"
          onClick={() => {
            const url = window.location.href;
            const text = "Check this waterpoint profile!";
            const shareUrl = `https://twitter.com/share?url=${encodeURI(
              url
            )}&text=${encodeURI(text)}`;
            window.open(shareUrl, "_blank");
          }}
        >
          <IconBrandX />
        </Button>
      </Popover.Body>
    </Popover>
  );
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
            <Container className="">
              <Row className="pt-5 border-bottom border-2">
                <Container className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="pt-2 mb-0">{wp.name}</h1>
                    <p className="mb-0">{`${wp.adm1}, ${wp.adm2}, ${wp.adm3}, ${wp.watershed_name}`}</p>
                  </div>
                  <div className="d-flex">
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="dashboard-tooltip">
                          {t("profile.data-popup")}
                        </Tooltip>
                      }
                    >
                      <a
                        href={`/dashboard/${wp.id}`}
                        className="btn btn-primary me-2 rounded-4"
                        role="button"
                        onClick={() => window.location.reload()}
                      >
                        <IconChartDonut />
                      </a>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="subscription-tooltip">
                          {t("profile.subscribe-popup")}
                        </Tooltip>
                      }
                    >
                      <div>
                        <SubscriptionButton
                          idWater={idWp}
                          idUser={userInfo?.sub}
                          setShowToastSubscribe={setShowToastSubscribe}
                          setToastSuccess={setToastSuccess}
                        />
                      </div>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="share-tooltip">
                          {t("profile.share")}
                        </Tooltip>
                      }
                    >
                      <div>
                        <OverlayTrigger
                          trigger="click"
                          placement="bottom"
                          rootClose={true}
                          overlay={popoverShare}
                        >
                          <Button className="rounded-4">
                            <IconShare />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </OverlayTrigger>
                  </div>
                </Container>
              </Row>

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
                {subseasonal && subseasonal.length > 0 ? (
                  subseasonal.map((week, i) => (
                    <Col className="col-12 col-md-3" key={i}>
                      <ForecastItem
                        year={week.year}
                        month={week.month}
                        week={week.week}
                        probabilities={week.probabilities}
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
              <Row className="mt-3 justify-content-around ">
                <h5 className="mb-0">{t("data.seasonal")}</h5>
                <p className="fw-light ">
                  {t("data.source")}: AClimate Ethiopia
                </p>
                <p>{t("data.seasonal-d")}</p>
                {seasonal && seasonal.length > 0 ? (
                  seasonal.map((month, i) => {
                    return (
                      <Col className="col-12 col-md-4">
                        <ForecastItem
                          year={month.year}
                          month={month.month}
                          probabilities={month.probabilities}
                          name={wp.name}
                          key={i}
                        />
                      </Col>
                    );
                  })
                ) : (
                  <div className="d-flex flex-column align-items-center ">
                    <h6 className=" mb-1 ">{t("data.no-forecast")}</h6>
                    <img src={noDataImg} alt="no data available" height={200} />
                  </div>
                )}
              </Row>
            </Container>
            <Container className="mb-2 mt-2 d-flex justify-content-between ">
              <div className="d-flex align-items-center">
                <a
                  href={`/dashboard/${wp.id}`}
                  className="btn btn-primary me-3 rounded-4"
                >
                  <IconChartDonut className="me-3" />
                  {t("monitoring.data")}
                </a>

                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  rootClose={true}
                  overlay={popoverShare}
                >
                  <Button className="rounded-4 mb-2 mb-sm-0 me-3">
                    <IconShare className="me-3" />
                    {t("profile.share")}
                  </Button>
                </OverlayTrigger>
                <SubscriptionButton
                  idWater={idWp}
                  idUser={userInfo?.sub}
                  setShowToastSubscribe={setShowToastSubscribe}
                  setToastSuccess={setToastSuccess}
                  label
                />
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      {t("monitoring.subscription-info")}
                    </Tooltip>
                  }
                >
                  <IconInfoCircleFilled />
                </OverlayTrigger>
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
            <h1>{t("data.notFound-title")}</h1>
            <p>{t("data.notFound-d")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Forecast;
