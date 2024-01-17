import React, { useEffect, useState } from "react";
import "./Userprofile.css";
import {
  Button,
  Card,
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
} from "@tabler/icons-react";
import Services from "../../services/apiService";
import { useAuth } from "../../hooks/useAuth";

function Userprofile() {
  const [subscription, setSubscription] = useState([]);
  const [toastEdit, setToastEdit] = useState();
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

  const fetchSubscriptionUser = () => {
    setLoading(true);
    Services.get_all_subscription_by_user(userInfo.sub)
      .then((response) => {
        let waterpoints = {};

        response.forEach((item) => {
          item.waterpoints.forEach((waterpoint) => {
            if (!waterpoints[waterpoint.id]) {
              waterpoints[waterpoint.id] = waterpoint;
            }

            if (item.boletin === "weekly") {
              waterpoints[waterpoint.id].weekly = true;
              waterpoints[waterpoint.id].subscriptionIdWeekly = item.id;
            } else if (item.boletin === "alert") {
              waterpoints[waterpoint.id].alert = true;
              waterpoints[waterpoint.id].subscriptionIdAlert = item.id;
            }
          });
        });
        setSubscription(Object.values(waterpoints));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const unsubscribeWp = (waterpoint) => {
    let promises = [];

    if (waterpoint.alert) {
      promises.push(
        Services.patch_unsubscribe(
          waterpoint.id,
          waterpoint.subscriptionIdAlert
        )
      );
    }

    if (waterpoint.weekly) {
      promises.push(
        Services.patch_unsubscribe(
          waterpoint.id,
          waterpoint.subscriptionIdWeekly
        )
      );
    }

    Promise.all(promises)
      .then(() => {
        setShowToastSubscribe(true);
        setToastEdit(false);
        fetchSubscriptionUser();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editWp = () => {
    const shouldSubscribeToAlert =
      editingWaterpoint.alert && !editingWaterpoint.subscriptionIdAlert;
    const shouldSubscribeToWeekly =
      editingWaterpoint.weekly && !editingWaterpoint.subscriptionIdWeekly;
    const shouldUnsubscribeFromWeekly =
      !editingWaterpoint.weekly && editingWaterpoint.subscriptionIdWeekly;
    const shouldUnsubscribeFromAlert =
      !editingWaterpoint.alert && editingWaterpoint.subscriptionIdAlert;

    const subscribe = (id, type) =>
      Services.post_subscription(userInfo.sub, id, type);
    const unsubscribe = (id, subscriptionId) =>
      Services.patch_unsubscribe(id, subscriptionId);

    let promises = [];

    if (shouldSubscribeToAlert) {
      promises.push(subscribe(editingWaterpoint.id, "alert"));
    }
    if (shouldSubscribeToWeekly) {
      promises.push(subscribe(editingWaterpoint.id, "weekly"));
    }
    if (shouldUnsubscribeFromWeekly) {
      promises.push(
        unsubscribe(
          editingWaterpoint.id,
          editingWaterpoint.subscriptionIdWeekly
        )
      );
    }
    if (shouldUnsubscribeFromAlert) {
      promises.push(
        unsubscribe(editingWaterpoint.id, editingWaterpoint.subscriptionIdAlert)
      );
    }

    Promise.all(promises)
      .then(() => {
        setShowToastSubscribe(true);
        setToastEdit(true);
        setModalVisibility(false);
        fetchSubscriptionUser();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalEdit = (waterpoint) => {
    setEditingWaterpoint(waterpoint);
    setModalVisibility(true);
  };

  const handleCheckboxChange = (event) => {
    setEditingWaterpoint({
      ...editingWaterpoint,
      [event.target.name]: event.target.checked,
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
          className={!toastEdit ? `bg-danger-subtle` : `bg-success-subtle`}
          autohide
        >
          <Toast.Body>
            {!toastEdit
              ? `Woohoo, you've unsubscribe from the waterpoint!`
              : `Success! You've edited your subscription.`}
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
              Edit your {editingWaterpoint.waterpoint_name} subscription
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Check
                type={"checkbox"}
                id={`checkbox-weekly`}
                label={`Weekly`}
                checked={editingWaterpoint.weekly}
                name="weekly"
                onChange={handleCheckboxChange}
              />
              <Form.Check
                type={"checkbox"}
                id={`checkbox-alert`}
                label={`Alert`}
                checked={editingWaterpoint.alert}
                name="alert"
                onChange={handleCheckboxChange}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setModalVisibility(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => editWp()}
              disabled={!editingWaterpoint.weekly && !editingWaterpoint.alert}
            >
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <div className="user-bg">
        <Container className="container-user">
          <Row className="text-white align-items-center ">
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
                      .map(function (word) {
                        return word.charAt(0);
                      })
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
      <Container className="mt-5">
        <Row>
          {loading ? (
            <Modal
              show={loading}
              backdrop="static"
              keyboard={false}
              centered
              size="sm"
            >
              <Modal.Body className="d-flex align-items-center ">
                <Spinner animation="border" role="status" className="me-2" />
                cargando
              </Modal.Body>
            </Modal>
          ) : (
            <Col className="col-12 mt-4">
              {subscription?.length > 0 ? (
                <>
                  <h5 className="fw-medium">Subscribed waterpoints</h5>
                  {subscription.map((waterpoint, index) => {
                    return (
                      <>
                        <Row
                          className="justify-content-between align-items-baseline mb-4 mb-md-3 flex-wrap "
                          key={index}
                        >
                          <Col className="col-10 col-md-5">
                            <div className="d-flex align-items-stretch ">
                              <div
                                className={`td-name text-center fw-medium px-4 me-2 ${
                                  waterpoint.last_monitored_scaled_depth > 100
                                    ? "td-green"
                                    : waterpoint.last_monitored_scaled_depth <=
                                        100 &&
                                      waterpoint.last_monitored_scaled_depth >=
                                        50
                                    ? "td-yellow"
                                    : waterpoint.last_monitored_scaled_depth <
                                        50 &&
                                      waterpoint.last_monitored_scaled_depth >=
                                        3
                                    ? "td-brown"
                                    : waterpoint.last_monitored_scaled_depth <
                                        3 &&
                                      waterpoint.last_monitored_scaled_depth > 0
                                    ? "td-red"
                                    : "td-gray"
                                }`}
                              >
                                {waterpoint.waterpoint_name}
                              </div>
                              {waterpoint.alert && (
                                <IconBell className="me-2" />
                              )}
                              {waterpoint.weekly && <IconCalendarWeek />}
                            </div>
                            <div>{`${waterpoint.adm1_name}, ${waterpoint.adm2_name}, ${waterpoint.adm3_name}`}</div>
                          </Col>
                          <Col className="col-2">
                            Depth: {waterpoint.last_monitored_deph.toFixed(3)}
                          </Col>
                          <Col className="d-flex col-12 col-md-5">
                            <Button
                              className="me-4 rounded-4 btn-warning text-black"
                              onClick={() => modalEdit(waterpoint)}
                            >
                              <IconEdit />
                              Edit Subscribe
                            </Button>
                            <Button
                              className=" rounded-4 btn-danger "
                              onClick={() => unsubscribeWp(waterpoint)}
                            >
                              <IconMailOff className="me-2" />
                              Unsubscribe
                            </Button>
                          </Col>
                        </Row>
                      </>
                    );
                  })}
                </>
              ) : (
                <>
                  <h3 className="text-center mb-1 ">
                    At the moment you dont have subscriptions
                  </h3>
                  <p className="text-center">
                    try going to the{" "}
                    <Link to="/monitoring">waterpoint display</Link> and
                    subscribing to a waterpoint
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
