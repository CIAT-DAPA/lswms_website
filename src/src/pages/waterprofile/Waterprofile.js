import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import bgImg from "../../assets/img/profilebg.jpg";
import downloadImg from "../../assets/svg/download.svg";
import dataIcon from "../../assets/svg/data.svg";
import emailImg from "../../assets/svg/email.svg";
import {
  Button,
  Carousel,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import "./Waterprofile.css";
import {
  LayersControl,
  MapContainer,
  TileLayer,
  WMSTileLayer,
} from "react-leaflet";
import WaterpointItem from "../../components/waterpointItem/WaterpointItem";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import Configuration from "../../conf/Configuration";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Waterprofile() {
  const [t, i18n] = useTranslation("global");
  const location = useLocation();
  const idWater = location.state?.idWater;
  const [wpProfile, setWpProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [wsTable, setWsTable] = useState(null);

  const [wsLeft, setWsLeft] = useState(null);
  const [wsRight, setWsRight] = useState(null);
  const [wpLeft, setWpLeft] = useState(null);
  const [wpRight, setWpRight] = useState(null);

  const urlWp = `${Configuration.get_url_api_base()}/waterpointsprofiles/${idWater}/en`;
  useEffect(() => {
    //Call to API to get waterpoint
    axios
      .get(urlWp)
      .then((response) => {
        setWpProfile(response.data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (wpProfile) {
      setWsLeft(
        wpProfile.contents_ws.filter((item) => item.position === "left")
      );
      setWsRight(
        wpProfile.contents_ws.filter((item) => item.position === "right")
      );
      setWpLeft(
        wpProfile.contents_wp.filter((item) => item.position === "left")
      );
      setWpRight(
        wpProfile.contents_wp.filter((item) => item.position === "right")
      );
      const { adm1, adm2, adm3, watershed_name } = wpProfile;
      setWsTable({ adm1, adm2, adm3, watershed_name });
    }
  }, [wpProfile]);

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
    report.save(`Profile_${wpProfile.name}.pdf`);
  };
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
            <div id="profile">
              <div className="profile-bg">
                <Carousel
                  fade
                  controls={false}
                  interval={1000}
                  pause={false}
                  className="w-100"
                >
                  <Carousel.Item>
                    <img src={bgImg} className="w-100 img-carousel" />
                    <Carousel.Caption>
                      <h5 className="fw-medium">{`${wpProfile.adm1}, ${wpProfile.adm2}, ${wpProfile.adm3}, ${wpProfile.watershed_name}`}</h5>
                      <h1 className="fw-normal my-2">{wpProfile.name}</h1>
                      <p className="fw-normal">
                        {t("profile.area")}: {wpProfile.area} ha <br />{" "}
                        {t("profile.population")}:{" "}
                        {
                          wpProfile.contents_wp
                            .find((e) => e.title === "general")
                            .values.find((e) => "population" in e)["population"]
                        }{" "}
                        <br /> Lat: {wpProfile.lat}, Lon: {wpProfile.lon}
                      </p>
                      <div className="d-flex justify-content-end ">
                        <Button
                          className="rounded-4"
                          onClick={downloadProfileAsPdf}
                        >
                          <img src={downloadImg} alt="" className="" />
                        </Button>
                      </div>
                    </Carousel.Caption>
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      src={bgImg}
                      style={{ filter: "grayscale(1)" }}
                      className="w-100 img-carousel"
                    />
                    <Carousel.Caption>
                      <h5 className="fw-medium">{`${wpProfile.adm1}, ${wpProfile.adm2}, ${wpProfile.adm3}, ${wpProfile.watershed_name}`}</h5>
                      <h1 className="fw-normal my-2">{wpProfile.name}</h1>
                      <p className="fw-normal">
                        {t("profile.area")}: {wpProfile.area} ha <br />{" "}
                        {t("profile.population")}:{" "}
                        {
                          wpProfile.contents_wp
                            .find((e) => e.title === "general")
                            .values.find((e) => "population" in e)["population"]
                        }{" "}
                        <br /> Lat: {wpProfile.lat}, Lon: {wpProfile.lon}
                      </p>
                      <div className="d-flex justify-content-end ">
                        <Button
                          className="rounded-4"
                          onClick={downloadProfileAsPdf}
                        >
                          <img src={downloadImg} alt="" className="" />
                        </Button>
                      </div>
                    </Carousel.Caption>
                  </Carousel.Item>
                </Carousel>
              </div>
              <Container className="mt-3">
                <Row>
                  <Col className="col-12 col-md-8">
                    <h5 className="fw-medium">{t("profile.map")}</h5>
                    <MapContainer
                      center={[wpProfile.lat, wpProfile.lon]}
                      zoom={8}
                      style={{
                        height: "400px",
                        width: "100%",
                      }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LayersControl position="topright">
                        <LayersControl.Overlay name="Show watershred" checked>
                          <WMSTileLayer
                            url={
                              "http://localhost:8080/geoserver/wpProject/wms"
                            }
                            layers={`wpProject:Burra`}
                            format="image/png"
                            transparent={true}
                            zIndex={1000}
                          />
                        </LayersControl.Overlay>
                      </LayersControl>
                    </MapContainer>
                    <h5 className="mt-4 mb-3">{t("profile.watershed")}</h5>
                    {wsLeft?.length > 0 &&
                      wsLeft.map((e, index) => {
                        return (
                          <WaterpointItem type={e.type} item={e} key={index} />
                        );
                      })}
                    <h5 className="mt-4 mb-3">{t("profile.waterpoint")}</h5>
                    {wpLeft?.length > 0 &&
                      wpLeft.map((e, index) => {
                        return (
                          <WaterpointItem type={e.type} item={e} key={index} />
                        );
                      })}
                  </Col>
                  <Col className="col-12 col-md-4">
                    <h5 className="text-capitalize ">
                      {t("profile.watershed-d")}
                    </h5>
                    {wsTable && (
                      <WaterpointItem
                        item={wsTable}
                        type="table"
                        title="Watershed description"
                      />
                    )}
                    {wsRight?.length > 0 &&
                      wsRight.map((e, index) => {
                        return (
                          <WaterpointItem type={e.type} item={e} key={index} />
                        );
                      })}
                    <h5 className="text-capitalize ">
                      {t("profile.waterpoint-d")}
                    </h5>
                    {wpRight?.length > 0 &&
                      wpRight.map((e, index) => {
                        return (
                          <WaterpointItem type={e.type} item={e} key={index} />
                        );
                      })}
                  </Col>
                </Row>
              </Container>
            </div>
            <Container className="mb-5 mt-2">
              <Button className="me-5 rounded-4" onClick={downloadProfileAsPdf}>
                <img src={downloadImg} alt="" className="me-3" />
                {t("profile.download")}
              </Button>
              {/* <Button disabled={true}>
          <img src={emailImg} className="me-3" />
          Send profile
        </Button> */}
              <Link
                type="button"
                className="btn btn-primary me-5 rounded-4"
                to="/historicaldata"
                state={{ idWater: wpProfile.id }}
              >
                <img src={dataIcon} alt="" className="me-3" />
                {t("monitoring.data")}
              </Link>
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
