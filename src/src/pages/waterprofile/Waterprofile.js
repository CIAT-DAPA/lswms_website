import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import downloadImg from "../../assets/svg/download.svg";
import emailImg from "../../assets/svg/email.svg";
import { Button, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import "./Waterprofile.css";
import { MapContainer, TileLayer } from "react-leaflet";
import WatershedContent from "../../components/watershedContent/WatershedContent";
import WaterpointContent from "../../components/waterpointContent/WaterpointContent";
import WaterpointItem from "../../components/waterpointItem/WaterpointItem";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Configuration from "../../conf/Configuration";
import axios from "axios";

function Waterprofile() {
  const location = useLocation();
  const idWater = location.state?.idWater;
  const [wpProfile, setWpProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [wsTable, setWsTable] = useState(null);
  const [listSeason, setListSeason] = useState(null);
  const [listWater, setListWater] = useState(null);
  const [livestock, setLivestock] = useState(null);

  const urlWp = `${Configuration.get_url_api_base()}/waterpointsprofiles/${idWater}`;
  useEffect(() => {
    //Call to API to get waterpoints
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
      const { adm1, adm2, adm3, watershed_name } = wpProfile;
      setWsTable({ adm1, adm2, adm3, watershed_name });
      setListSeason(wpProfile.contents_ws.find((e) => e.title === "seasons"));
      setListWater(
        wpProfile.contents_ws.find((e) => e.title === "water sources")
      );
      setLivestock(
        wpProfile.contents_wp.find(
          (e) => e.title === "agriculture context livestock"
        )
      );
    }
  }, [wpProfile]);

  const downloadProfileAsPdf = () => {
    const profileElement = document.getElementById("profile");

    html2canvas(profileElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("profile.pdf");
    });
  };

  return (
    <div id="profile">
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
              Getting the waterpoint profile...
            </Modal.Body>
          </Modal>
        ) : (
          <>
            <div className="profile-bg">
              <Container className="container-profile">
                <Row className="text-white ">
                  <Col className="col-12 text-center">
                    <h5 className="fw-medium">{`${wpProfile.adm1}, ${wpProfile.adm2}, ${wpProfile.adm3}, ${wpProfile.watershed_name}`}</h5>
                    <h1 className="fw-normal my-4">{wpProfile.name}</h1>
                    <p className="fw-normal">
                      Area: {wpProfile.area} ha <br /> Population:{" "}
                      {wpProfile.contents_wp[7].values[0].male} <br />{" "}
                      {wpProfile.lat}, {wpProfile.lon}
                    </p>
                  </Col>
                </Row>
              </Container>
            </div>
            <Container className="mt-3">
              <Row>
                <Col className="col-12 col-md-8">
                  <h5 className="fw-medium">Map</h5>
                  <MapContainer
                    center={[wpProfile.lat, wpProfile.lon]}
                    zoom={7}
                    style={{
                      height: "400px",
                      width: "100%",
                    }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </MapContainer>
                  <WatershedContent contentWs={wpProfile.contents_ws} />
                  <WaterpointContent contentWp={wpProfile.contents_wp} />
                </Col>
                <Col className="col-12 col-md-4">
                  {wsTable && (
                    <WaterpointItem
                      item={wsTable}
                      type="table"
                      title="Watershed description"
                    />
                  )}

                  {listSeason && (
                    <WaterpointItem item={listSeason} type="list" />
                  )}

                  {listWater && <WaterpointItem item={listWater} type="list" />}

                  {wpProfile && (
                    <WaterpointItem
                      item={
                        wpProfile.contents_wp.find((e) => e.title === "general")
                          .values
                      }
                      type="table"
                      title="Waterpoint description"
                    />
                  )}
                  {livestock && (
                    <WaterpointItem item={livestock} type="icon-y" />
                  )}
                </Col>
              </Row>
              <div className="mb-5 mt-4">
                <Button
                  className="me-5 rounded-4"
                  onClick={downloadProfileAsPdf}
                >
                  <img src={downloadImg} alt="" className="me-3" />
                  Download profile
                </Button>
                {/* <Button disabled={true}>
                <img src={emailImg} className="me-3" />
                Send profile
              </Button> */}
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
            <h1>No water ID was provided.</h1>
            <p>Try to get the profile from the waterpoints display.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Waterprofile;
