import React, { useEffect, useState } from "react";
import "./Userprofile.css";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import noSubscriptionImg from "../../assets/img/noSubscription.png";
import { Link } from "react-router-dom";
import {
  IconEdit,
  IconMessageDots,
  IconMail,
  IconMailOff,
} from "@tabler/icons-react";
import Services from "../../services/apiService";

function Userprofile() {
  const [notification, setNotifications] = useState([]);

  useEffect(() => {
    Services.get_all_subscription_by_user("test")
      .then((response) => {
        setNotifications(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [showToastUnsubscribe, setShowToastUnsubscribe] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(
    Array(notification.length).fill(false)
  );

  const unsubscribeWp = (id) => {
    setwaterpointsTest(notification.filter((wp) => wp.id !== id));
    setShowToastUnsubscribe(true);
  };

  const editWp = (id) => {
    setModalVisibility((prevVisibility) =>
      prevVisibility.map((value, index) => (index === id - 1 ? true : value))
    );
  };

  return (
    <>
      <ToastContainer
        className="p-3"
        position="bottom-end"
        style={{ zIndex: 1 }}
      >
        <Toast
          onClose={() => setShowToastUnsubscribe(false)}
          show={showToastUnsubscribe}
          delay={3000}
          className="bg-danger-subtle "
          autohide
        >
          <Toast.Body>
            Woohoo, you've unsubscribe from this waterpoint!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="user-bg">
        <Container className="container-user">
          <Row className="text-white align-items-center ">
            <Col className="col-3 col-md-2 text-center">
              <div
                className="bg-black border border-5 py-5 rounded-circle d-flex flex-column justify-content-center align-items-center"
                style={{ height: "150px", width: "150px" }}
              >
                <span className="fw-bold fs-1">MT</span>
              </div>
            </Col>
            <Col className="pb-5 ms-5 ms-lg-0">
              <h3 className="fw-normal my-4">Mekonnen Tolcha</h3>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="mt-5">
        <Row className="">
          <Col className="col-12 col-md-8 mt-4">
            {notification?.length > 0 ? (
              <>
                <h5 className="fw-medium">Subscribed waterpoints</h5>
                {notification.map((waterpoint, index) => {
                  return (
                    <>
                      <Modal
                        show={modalVisibility[index]}
                        onHide={() =>
                          setModalVisibility((prevState) =>
                            prevState.map((value, i) =>
                              i === index ? false : value
                            )
                          )
                        }
                        centered
                        size="sm"
                        key={index + 100}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title className="h5">
                            Edit your subscriptions
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Check
                              type={"checkbox"}
                              id={`default-checkbox`}
                              label={`Email`}
                              checked={waterpoint.email}
                              onChange={(e) => {
                                const newWaterpoints = [...waterpointsTest];
                                const index = newWaterpoints.findIndex(
                                  (wp) => wp.id === waterpoint.id
                                );
                                newWaterpoints[index] = {
                                  ...newWaterpoints[index],
                                  email: e.target.checked,
                                };
                                setwaterpointsTest(newWaterpoints);
                              }}
                            />
                            <Form.Check
                              type={"checkbox"}
                              id={`default-checkbox`}
                              label={`SMS`}
                              checked={waterpoint.sms}
                              onChange={(e) => {
                                const newWaterpoints = [...waterpointsTest];
                                const index = newWaterpoints.findIndex(
                                  (wp) => wp.id === waterpoint.id
                                );
                                newWaterpoints[index] = {
                                  ...newWaterpoints[index],
                                  sms: e.target.checked,
                                };
                                setwaterpointsTest(newWaterpoints);
                              }}
                            />
                          </Form>
                        </Modal.Body>
                      </Modal>
                      <Row
                        className="justify-content-between align-items-baseline mb-3"
                        key={index}
                      >
                        <Col className="col-auto">
                          <div className="d-flex align-items-stretch ">
                            <div
                              className={`td-name text-center fw-medium px-4 me-2 td-brown`}
                            >
                              {waterpoint.name}
                            </div>
                            {waterpoint.email && <IconMail className="me-2" />}
                            {waterpoint.sms && <IconMessageDots />}
                          </div>
                          <div>{`${waterpoint.region}, ${waterpoint.woreda}, ${waterpoint.kebele}`}</div>
                        </Col>
                        <Col className="col-auto">
                          <p>Depth: {waterpoint.depth}</p>
                        </Col>
                        <Col className="d-flex col-auto">
                          <Button
                            className="me-4 rounded-4 btn-warning text-black"
                            onClick={() => editWp(waterpoint.id)}
                          >
                            <IconEdit />
                            Edit Subscribe
                          </Button>
                          <Button
                            className=" rounded-4 btn-danger "
                            onClick={() => unsubscribeWp(waterpoint.id)}
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
          <Col className="col-12 col-md-4 mt-4">
            <h5 className="text-capitalize ">Contact information</h5>
            <table className="fs-6 w-100">
              <tbody>
                <tr className="tr-table">
                  <td className="text-capitalize ">{`Email:`}</td>
                  <td className="text-end text-capitalize">{`example@test.com`}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Userprofile;
