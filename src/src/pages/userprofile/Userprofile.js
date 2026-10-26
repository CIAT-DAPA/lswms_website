import React, { useEffect, useState } from "react";
import "./Userprofile.css";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Placeholder,
  Row,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import noSubscriptionImg from "../../assets/img/noSubscription.png";
import { Link } from "react-router-dom";
import {
  IconEdit,
  IconMailOff,
  IconCalendarWeek,
  IconBell,
  IconPlant,
} from "@tabler/icons-react";
import Services from "../../services/apiService";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

function Userprofile() {
  const [t] = useTranslation("global");
  const [subscription, setSubscription] = useState([]);
  const [toastEdit, setToastEdit] = useState(null);
  const [showToastSubscribe, setShowToastSubscribe] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [editingWaterpoint, setEditingWaterpoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo && userInfo.sub) {
      fetchSubscriptionUser();
    }
  }, [userInfo]);

  const fetchSubscriptionUser = async () => {
    setLoading(true);
    try {
      const response = await Services.get_all_subscription_by_user(
        userInfo.sub
      );
      setSubscription(response);
    } catch (error) {
      console.error("Error al obtener suscripciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (waterpoint, boletin) => {
    try {
      await Services.patch_unsubscribe(waterpoint.id, boletin.id);
      setShowToastSubscribe(true);
      setToastEdit(false);
      fetchSubscriptionUser();
    } catch (error) {
      console.error("Error al cancelar la suscripción:", error);
    }
  };

  const editWp = async () => {
    const subscribe = async (id, type) =>
      await Services.post_subscription(userInfo.sub, id, type);
    const unsubscribe = async (id, subscriptionId) =>
      await Services.patch_unsubscribe(id, subscriptionId);

    let promises = [];

    if (editingWaterpoint.alert && !editingWaterpoint.subscriptionIdAlert) {
      promises.push(subscribe(editingWaterpoint.id, "alert"));
    }
    if (editingWaterpoint.weekly && !editingWaterpoint.subscriptionIdWeekly) {
      promises.push(subscribe(editingWaterpoint.id, "weekly"));
    }
    if (
      editingWaterpoint.forecast &&
      !editingWaterpoint.subscriptionIdForecast
    ) {
      promises.push(subscribe(editingWaterpoint.id, "forecast"));
    }
    if (!editingWaterpoint.weekly && editingWaterpoint.subscriptionIdWeekly) {
      promises.push(
        unsubscribe(
          editingWaterpoint.id,
          editingWaterpoint.subscriptionIdWeekly
        )
      );
    }
    if (!editingWaterpoint.alert && editingWaterpoint.subscriptionIdAlert) {
      promises.push(
        unsubscribe(editingWaterpoint.id, editingWaterpoint.subscriptionIdAlert)
      );
    }
    if (
      !editingWaterpoint.forecast &&
      editingWaterpoint.subscriptionIdForecast
    ) {
      promises.push(
        unsubscribe(
          editingWaterpoint.id,
          editingWaterpoint.subscriptionIdForecast
        )
      );
    }

    try {
      await Promise.all(promises);
      setShowToastSubscribe(true);
      setToastEdit(true);
      setModalVisibility(false);
      fetchSubscriptionUser();
    } catch (error) {
      console.error("Error al editar la suscripción:", error);
    }
  };

  const modalEdit = (waterpoint) => {
    subscription.forEach((item) => {
      item.waterpoints.forEach((wp) => {
        if (wp.id === waterpoint.id) {
          if (item.boletin === "alert") {
            waterpoint.alert = true;
            waterpoint.subscriptionIdAlert = item.id;
          } else if (item.boletin === "weekly") {
            waterpoint.weekly = true;
            waterpoint.subscriptionIdWeekly = item.id;
          } else if (item.boletin === "forecast") {
            waterpoint.forecast = true;
            waterpoint.subscriptionIdForecast = item.id;
          }
        }
      });
    });
    setEditingWaterpoint(waterpoint);
    setModalVisibility(true);
  };

  const handleCheckboxChange = (event) => {
    setEditingWaterpoint({
      ...editingWaterpoint,
      [event.target.name]: event.target.checked,
    });
  };

  const renderWaterpointRow = (waterpoint, boletin, index) => {

    return (
      <Row
        key={index}
        className="justify-content-between align-items-baseline mb-4 mb-md-3 flex-wrap"
      >
        <Col className="col-10 col-md-5">
          <div className="d-flex align-items-stretch">
            <div
              className={`td-name text-center fw-medium px-4 me-2 ${
                waterpoint.last_monitored_deph === 0 &&
                waterpoint.climatology_depth === 0
                  ? "td-gray"
                  : waterpoint.last_monitored_deph >= 0 &&
                    waterpoint.last_monitored_deph < 0.2
                  ? "td-red"
                  : waterpoint.last_monitored_deph > 0.2 &&
                    waterpoint.last_monitored_deph < 0.3
                  ? "td-brown"
                  : waterpoint.last_monitored_deph > 0.3 &&
                    waterpoint.last_monitored_deph < 0.7
                  ? "td-yellow"
                  : "td-green"
              }`}
            >
              {waterpoint.waterpoint_name}
            </div>
          </div>
          <div>{`${waterpoint.adm1_name}, ${waterpoint.adm2_name}, ${waterpoint.adm3_name}`}</div>
        </Col>
        <Col className="col-2">
          {t("monitoring.depth")}: {waterpoint.last_monitored_deph.toFixed(3)}
        </Col>
        <Col className="d-flex col-12 col-md-5">
          <Button
            className="me-4 rounded-4 btn-warning text-black"
            onClick={() => modalEdit(waterpoint)}
          >
            <IconEdit /> {t("user-profile.edit-2")}
          </Button>
          <Button
            className="rounded-4 btn-danger"
            onClick={() => handleUnsubscribe(waterpoint, boletin)}
          >
            <IconMailOff className="me-2" />{" "}
            {t("subscriptionButton.unsubscribe")}
          </Button>
        </Col>
      </Row>
    );
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
          autohide
          className={toastEdit ? "bg-success-subtle" : "bg-danger-subtle"}
        >
          <Toast.Body>
            {toastEdit
              ? t("subscriptionToast.subscribed")
              : t("subscriptionToast.unsubscribed")}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {editingWaterpoint && (
        <Modal
          show={modalVisibility}
          onHide={() => setModalVisibility(false)}
          centered
          size="sm"
        >
          <Modal.Header closeButton>
            <Modal.Title className="h5">
              {t("user-profile.edit")} {editingWaterpoint.waterpoint_name}{" "}
              {t("user-profile.subscription")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            <Form.Check
                type="checkbox"
                id="checkbox-alert"
                label={t("subscriptionButton.alert")}
                checked={editingWaterpoint.alert}
                name="alert"
                onChange={handleCheckboxChange}
              />
              <Form.Check
                type="checkbox"
                id="checkbox-forecast"
                label={t("subscriptionButton.forecast")}
                checked={editingWaterpoint.forecast}
                name="forecast"
                onChange={handleCheckboxChange}
              />
              <Form.Check
                type="checkbox"
                id="checkbox-weekly"
                label={t("subscriptionButton.weekly")}
                checked={editingWaterpoint.weekly}
                name="weekly"
                onChange={handleCheckboxChange}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setModalVisibility(false)}
            >
              {t("monitoring.modal-close")}
            </Button>
            <Button
              variant="primary"
              onClick={editWp}
              disabled={
                !editingWaterpoint.weekly &&
                !editingWaterpoint.alert &&
                !editingWaterpoint.forecast
              }
            >
              {t("user-profile.save")}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <div className="user-bg">
        <Container className="container-user">
          <Row className="text-white align-items-center">
            <Col className="col-3 col-md-2 text-center">
              <div
                className="bg-black border border-5 py-5 rounded-circle d-flex flex-column justify-content-center align-items-center"
                style={{ height: "150px", width: "150px" }}
              >
                <span className="fw-bold fs-1">
                  {userInfo ? (
                    userInfo.name
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word.charAt(0))
                      .join("")
                  ) : (
                    <Placeholder xs={2} />
                  )}
                </span>
              </div>
            </Col>
            <Col className="pb-5 ms-5 ms-lg-0">
              <h3 className="fw-normal mt-3 mb-0 ">
                {userInfo ? userInfo.name : <Placeholder xs={6} />}
              </h3>
              <p>{userInfo ? userInfo.email : <Placeholder xs={3} />}</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mt-5 mb-4">
        <Row>
          {loading ? (
            <Modal
              show={loading}
              backdrop="static"
              keyboard={false}
              centered
              size="sm"
            >
              <Modal.Body className="d-flex align-items-center">
                <Spinner animation="border" role="status" className="me-2" />
                {t("user-profile.loading")}
              </Modal.Body>
            </Modal>
          ) : (
            <Col className="col-12 mt-4">
              {subscription?.length > 0 ? (
                <>
                  <h5 className="fw-medium">{t("user-profile.title")}</h5>
                  <p className="text-wrap-pretty">
                    {t("user-profile.description-1")}
                  </p>
                  <p className="text-wrap-pretty">
                    {t("user-profile.description-2-1")}{" "}
                    <span className="fw-bold">
                      {t("subscriptionButton.weekly")}
                    </span>
                    , {t("user-profile.description-2-2")}{" "}
                    <span className="fw-bold">
                      {t("subscriptionButton.alert")}
                    </span>
                    , {t("user-profile.description-2-3")}
                  </p>
                  {subscription.map((boletin, index) => (
                    <div key={index}>
                      <div className="d-flex">
                        {boletin.boletin === "weekly" ? (
                          <IconCalendarWeek className="me-2" />
                        ) : boletin.boletin === "alert" ? (
                          <IconBell className="me-2" />
                        ) : boletin.boletin === "forecast" ? (
                          <IconPlant className="me-2" />
                        ) : null}
                        <h5 className="fw-medium text-capitalize">
                          {boletin.boletin === "weekly"
                            ? t("subscriptionButton.weekly")
                            : boletin.boletin === "alert"
                            ? t("subscriptionButton.alert")
                            : t("subscriptionButton.forecast")}
                        </h5>
                      </div>
                      {boletin.waterpoints.map((waterpoint, idx) =>
                        renderWaterpointRow(waterpoint, boletin, idx)
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <h3 className="text-center mb-1">
                    {t("user-profile.no-subscription")}
                  </h3>
                  <p className="text-center">
                    {t("user-profile.no-subscription-sub-1")}{" "}
                    <Link to="/monitoring">
                      {t("user-profile.no-subscription-sub-2")}
                    </Link>{" "}
                    {t("user-profile.no-subscription-sub-3")}
                  </p>
                  <img
                    src={noSubscriptionImg}
                    alt="no subscriptions"
                    className="img-fluid"
                  />
                </>
              )}
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}

export default Userprofile;
