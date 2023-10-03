import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import {
  Col,
  Container,
  Modal,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import ForecastItem from "../../components/forecastItem/ForecastItem";
import Services from "../../services/apiService";
import ReactApexChart from "react-apexcharts";
import "./Dashboard.css";
import { useTranslation } from "react-i18next";

function HistoricalData() {
  const [t, i18n] = useTranslation("global");
  const [wp, setWp] = useState();
  const [wpData, setWpData] = useState();
  const [climatology, setClimatology] = useState();
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState();
  const [depthData, setDepthData] = useState([]);
  const [climaDepthData, setClimaDepthData] = useState([]);
  const [scaledDepthData, setScaledDepthData] = useState([]);
  const [climaScaledDepthData, setClimaScaledDepthData] = useState([]);
  const [rain, setRain] = useState([]);
  const [climaRain, setClimaRain] = useState([]);
  const [evap, setEvap] = useState([]);
  const [climaEvap, setClimaEvap] = useState([]);
  const [aclimateId, setAclimateId] = useState(null);
  const [subseasonal, setSubseasonal] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const { idWp } = useParams();
  let uniqueYears;
  const typeNames = ["depth", "scaled_depth", "rain", "evp"];

  const filterData = (data, type, year) => {
    const filteredData = data
      .filter((item) => new Date(item.date).getFullYear() === Number(year))
      .map((item) => ({
        x: new Date(item.date),
        y:
          item.values.find((value) => value.type === type)?.value.toFixed(2) ||
          0,
      }));
    filteredData.sort((a, b) => a.x - b.x);
    return filteredData;
  };

  const handleFilterYear = (event) => {
    const selectedYear = event?.target?.value || event;
    setDepthData(filterData(wpData, "depth", selectedYear));
    setScaledDepthData(filterData(wpData, "scaled_depth", selectedYear));
    setRain(filterData(wpData, "rain", selectedYear));
    setEvap(filterData(wpData, "evp", selectedYear));
    setYear(selectedYear);
    const result = typeNames.map((type) => {
      return climatology.climatology.flatMap((monthData) => {
        return monthData.map((dayData) => {
          const month = dayData.month.toString().padStart(2, "0");
          const day = dayData.day.toString().padStart(2, "0");
          const date = new Date(
            `${selectedYear}-${month}-${day}T05:00:00.000Z`
          );
          const value = dayData.values
            .find((entry) => entry.type === type)
            .value.toFixed(2);
          return { x: date, y: value };
        });
      });
    });

    setClimaDepthData(result[0].sort((a, b) => a.x - b.x));
    setClimaScaledDepthData(result[1].sort((a, b) => a.x - b.x));
    setClimaRain(result[2].sort((a, b) => a.x - b.x));
    setClimaEvap(result[3].sort((a, b) => a.x - b.x));
  };

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
        setClimatology(response[0]);
        setAclimateId(response[0].aclimate_id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
  }, [wp]);

  useEffect(() => {
    if (uniqueYears) {
      handleFilterYear(uniqueYears[0]);
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

  if (wpData && wpData.length > 0) {
    uniqueYears = [
      ...new Set(wpData.map((item) => new Date(item.date).getFullYear())),
    ];
    uniqueYears.sort((a, b) => b - a);
  }

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
              Getting the waterpoint data...
            </Modal.Body>
          </Modal>
        ) : (
          <>
            <Container className="">
              <Row className="pt-5 border-bottom border-2">
                <h1 className="pt-2 mb-0">{wp.name}</h1>
                <p className="mb-0">{`${wp.adm1}, ${wp.adm2}, ${wp.adm3}, ${wp.watershed_name}`}</p>
              </Row>
              <Tabs
                defaultActiveKey="Monitored-data"
                id="fill-tab-example"
                className="mb-3 bg-body-tertiary "
                fill
              >
                <Tab eventKey="Monitored-data" title="Monitored data">
                  <Row className="mt-3 ">
                    <Col className="">
                      <h5>{t("data.monitored")}</h5>
                      <p>{t("data.monitored-d")}</p>
                      <p className="mb-0">{t("data.year")}</p>
                      <select
                        className="form-select w-50"
                        aria-label="Default select example"
                        onChange={handleFilterYear}
                      >
                        {uniqueYears.map((year) => (
                          <option value={year} key={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col-12 col-lg-6">
                      <h6 className="mt-2">{t("data.depth")}</h6>
                      {depthData?.length > 0 && (
                        <>
                          <p>
                            {t("data.depth-description")} {wp.name},{" "}
                            {t("data.depth-year")} {year}.
                          </p>
                          <ReactApexChart
                            options={{
                              chart: {
                                id: "depth",
                                group: "historical",
                              },
                              xaxis: {
                                type: "datetime",
                              },
                            }}
                            series={[
                              { name: "Depth", data: depthData },
                              { name: "Climatology", data: climaDepthData },
                            ]}
                            type="line"
                            height={350}
                          />
                          <p className="label-y">m</p>
                        </>
                      )}
                    </Col>
                    <Col className="col-12 col-lg-6">
                      <h6 className="mt-2">{t("data.scaled")}</h6>
                      <div id="line-scaled">
                        {scaledDepthData?.length > 0 && (
                          <>
                            <p>
                              {t("data.scaled-description")} {wp.name},{" "}
                              {t("data.depth-year")} {year}.
                            </p>
                            <ReactApexChart
                              options={{
                                chart: {
                                  id: "scaled",
                                  group: "historical",
                                },
                                xaxis: {
                                  type: "datetime",
                                },
                              }}
                              series={[
                                { name: "Scaled depth", data: scaledDepthData },
                                {
                                  name: "Climatology",
                                  data: climaScaledDepthData,
                                },
                              ]}
                              type="line"
                              height={350}
                            />
                            <p className="label-y">%</p>
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col-12 col-lg-6">
                      <h6>{t("data.rain")}</h6>
                      {rain?.length > 0 && (
                        <>
                          <p>
                            {t("data.rain-description")} {wp.name},{" "}
                            {t("data.depth-year")} {year}.
                          </p>
                          <ReactApexChart
                            options={{
                              chart: {
                                id: "rain",
                                group: "historical",
                              },
                              xaxis: {
                                type: "datetime",
                              },
                            }}
                            series={[
                              { name: "Rain", data: rain },
                              { name: "Climatology", data: climaRain },
                            ]}
                            type="line"
                            height={350}
                          />
                          <p className="label-y">mm</p>
                        </>
                      )}
                    </Col>
                    <Col className="col-12 col-lg-6">
                      <h6>{t("data.evap")}</h6>
                      {evap?.length > 0 && (
                        <>
                          <p>
                            {t("data.evap-description")} {wp.name},{" "}
                            {t("data.depth-year")} {year}.
                          </p>
                          <ReactApexChart
                            options={{
                              chart: {
                                id: "evap",
                                group: "historical",
                              },
                              xaxis: {
                                type: "datetime",
                              },
                            }}
                            series={[
                              { name: "Evaporation", data: evap },
                              { name: "Climatology", data: climaEvap },
                            ]}
                            type="line"
                            height={350}
                          />
                          <p className="label-y">mm</p>
                        </>
                      )}
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="Climate Forecast" title="Climate Forecast">
                  <Row className="mt-3">
                    <h5>{t("data.subseasonal")}</h5>
                    <p>{t("data.subseasonal-d")}</p>
                    {subseasonal &&
                      subseasonal.map((week, i) => {
                        return (
                          <Col className="col-12 col-md-3">
                            <ForecastItem
                              year={week.year}
                              month={week.month}
                              week={week.week}
                              probabilities={week.probabilities}
                              name={wp.name}
                              key={i}
                            />
                          </Col>
                        );
                      })}
                  </Row>
                  <Row className="mt-3 justify-content-around ">
                    <h5>{t("data.seasonal")}</h5>
                    <p>{t("data.seasonal-d")}</p>
                    {seasonal &&
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
                      })}
                  </Row>
                </Tab>
              </Tabs>
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

export default HistoricalData;
