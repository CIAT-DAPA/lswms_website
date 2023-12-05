import React from "react";
import "./Userprofile.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import userImg from "../../assets/img/userTest.png";
import noSubscriptionImg from "../../assets/img/noSubscription.png";
import { Link } from "react-router-dom";
import {
  IconEdit,
  IconMessageDots,
  IconMail,
  IconMailOff,
} from "@tabler/icons-react";

function Userprofile() {
  const subscriptions = true;
  return (
    <>
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
            <Col className="pb-5">
              <h3 className="fw-normal my-4">Mekonnen Tolcha</h3>
            </Col>
            <Col className="col-1 pb-5 text-end">
              <Button className="rounded-4">
                <IconEdit />
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="mt-5">
        <Row className="">
          <Col className="col-12 col-md-8 mt-4">
            {subscriptions ? (
              <>
                <h5 className="fw-medium">Subscribed waterpoints</h5>
                <Row className="justify-content-between align-items-baseline mb-3">
                  <Col className="col-auto">
                    <div className="d-flex align-items-stretch ">
                      <div
                        className={`td-name text-center fw-medium px-4 me-2 td-brown`}
                      >
                        Burra
                      </div>
                      <IconMail className="me-2" />
                      <IconMessageDots />
                    </div>
                    <div>Borena, Yabelo, Tsadim</div>
                  </Col>
                  <Col className="col-auto">
                    <p>Depth: 3.50%</p>
                  </Col>
                  <Col className="d-flex col-auto">
                    <Button className="me-4 rounded-4 btn-warning text-black">
                      <IconEdit />
                      Edit Subscribe
                    </Button>
                    <Button className=" rounded-4 btn-danger ">
                      <IconMailOff className="me-2" />
                      Unsubscribe
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <h3 className="text-center mb-1 ">
                  At the moment you dont have subscriptions
                </h3>
                <p className="text-center">
                  try going to the{" "}
                  <Link to="/visualization">waterpoint display</Link> and
                  subscribing to a waterpoint
                </p>
                <img
                  src={noSubscriptionImg}
                  alt="no subscriptions"
                  className="img-fluid"
                />
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
