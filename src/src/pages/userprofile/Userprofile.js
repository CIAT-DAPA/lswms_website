import React from "react";
import "./Userprofile.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import userImg from "../../assets/img/userTest.png";
import editIcon from "../../assets/svg/edit.svg";
import smsIcon from "../../assets/svg/sms.svg";
import emailIcon from "../../assets/svg/emailChannel.svg";
import unsubscribeIcon from "../../assets/svg/unsubscribe.svg";
import noSubscriptionImg from "../../assets/img/noSubscription.png";
import { Link } from "react-router-dom";

function Userprofile() {
  const subscriptions = false;
  return (
    <>
      <div className="user-bg">
        <Container className="container-user">
          <Row className="text-white align-items-center ">
            <Col className="col-3 col-md-2 text-center">
              <img
                src={userImg}
                alt="user profile"
                className="img-fluid border border-5 border-white rounded-circle position-relative"
                style={{ bottom: "15px" }}
              />
            </Col>
            <Col className="pb-5">
              <h3 className="fw-normal my-4">Mekonnen Tolcha</h3>
            </Col>
            <Col className="col-1 pb-5 text-end">
              <Button className="rounded-4">
                <img src={editIcon} alt="" className="" />
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
                      <img src={emailIcon} alt="email" className="me-2" />
                      <img
                        src={smsIcon}
                        alt="sms"
                        style={{ minWidth: "16px" }}
                      />
                    </div>
                    <div>Borena, Yabelo, Tsadim</div>
                  </Col>
                  <Col className="col-auto">
                    <p>Depth: 3.50%</p>
                  </Col>
                  <Col className="d-flex col-auto">
                    <Button className="me-4 rounded-4 btn-warning text-black">
                      <img
                        src={editIcon}
                        alt="edit"
                        className="me-2 editIconBlack"
                      />
                      Edit Subscribe
                    </Button>
                    <Button className=" rounded-4 btn-danger ">
                      <img
                        src={unsubscribeIcon}
                        alt="Unsubscribe"
                        className="me-2"
                      />
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
                <img src={noSubscriptionImg} alt="no subscriptions" className="img-fluid"/>
              </>
            )}
          </Col>
          <Col className="col-12 col-md-4 mt-4">
            <h5 className="text-capitalize ">Contact information</h5>
            <table className="fs-6 w-100">
              <tbody>
                <tr className="tr-table">
                  <td className="text-capitalize ">{`Cellphone:`}</td>
                  <td className="text-end text-capitalize">{`+251 91 405 5461`}</td>
                </tr>
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
