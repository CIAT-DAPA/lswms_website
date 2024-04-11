import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import noDataImg from "../../assets/img/noSubscription.png";
import {
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import ForecastItem from "../../components/forecastItem/ForecastItem";
import Services from "../../services/apiService";
import { useTranslation } from "react-i18next";
import "./Forecast.css";

function Forecast() {
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
            <Container className="">
              <Row className="pt-5 border-bottom border-2">
                <h1 className="pt-2 mb-0">{wp.name}</h1>
                <p className="mb-0">{`${wp.adm1}, ${wp.adm2}, ${wp.adm3}, ${wp.watershed_name}`}</p>
              </Row>
                  <Row className="mt-3">
                    <h5 className="mb-0">{t("data.subseasonal")}</h5>
                      <p className="fw-light ">
                        {t("data.source")}: <a className="edacap-link" href="https://edacap.ethioagroclimate.net/#/Home" target="_blank" rel="noopener noreferrer">AClimate Ethiopia </a>
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
                        <h6 className=" mb-1 ">
                          At the moment there is no data available
                        </h6>
                        <img
                          src={noDataImg}
                          alt="no data available"
                          height={200}
                        />
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
                        <h6 className=" mb-1 ">
                          At the moment there is no data available
                        </h6>
                        <img
                          src={noDataImg}
                          alt="no data available"
                          height={200}
                        />
                      </div>
                    )}
                  </Row>
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