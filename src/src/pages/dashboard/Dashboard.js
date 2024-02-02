import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import {
  Button,
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
import { IconDownload } from "@tabler/icons-react";
import Papa from "papaparse";
import SliderYear from "../../components/sliderYear/SliderYear";

function HistoricalData() {
  const [t, i18n] = useTranslation("global");
  const [wp, setWp] = useState();
  const [wpData, setWpData] = useState();
  const [climatology, setClimatology] = useState();
  const [loading, setLoading] = useState(true);
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
  const [value, setValue] = useState(null);
  const { idWp } = useParams();
  const typeNames = ["depth", "scaled_depth", "rain", "evp"];

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
    if (wpData) {
      const years = [
        ...new Set(wpData.map((item) => new Date(item.date).getFullYear())),
      ];
      years.sort((a, b) => b - a);
    }
  }, [wpData]);

  useEffect(() => {
    if (value) {
      setDepthData(filterData(wpData, "depth"));
      setScaledDepthData(filterData(wpData, "scaled_depth"));
      setRain(filterData(wpData, "rain"));
      setEvap(filterData(wpData, "evp"));

      const result = typeNames.map((type) => {
        return climatology?.climatology
          ?.flatMap((monthData) => {
            return monthData.flatMap((dayData) => {
              const month = dayData.month.toString().padStart(2, "0");
              const day = dayData.day.toString().padStart(2, "0");
              // Generate an array of years from value.min to value.max
              const years = Array.from(
                { length: value.max - value.min + 1 },
                (_, i) => value.min + i
              );
              // Map over each year in the range
              return years.map((year) => {
                const date = new Date(`${year}-${month}-${day}T05:00:00.000Z`);
                const formattedDate = date.toLocaleDateString("en-CA");
                const value =
                  dayData.values
                    .find((entry) => entry.type === type)
                    ?.value.toFixed(2) || 0;
                return { x: formattedDate, y: value };
              });
            });
          })
          .sort((a, b) => new Date(a.x) - new Date(b.x));
      });
      setClimaDepthData(result[0]);
      setClimaScaledDepthData(result[1]);
      setClimaRain(result[2]);
      setClimaEvap(result[3]);
    }
  }, [value]);

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

  const filterData = (data, type) => {
    const filteredData = data
      .filter((item) => {
        const itemYear = new Date(item.date).getFullYear();
        return itemYear >= Number(value.min) && itemYear <= Number(value.max);
      })
      .map((item) => ({
        x: new Date(item.date),
        y:
          item.values.find((value) => value.type === type)?.value.toFixed(2) ||
          0,
      }));
    const formattedData = filteredData.map((item) => ({
      ...item,
      x: item.x.toLocaleDateString("en-CA"),
    }));
    formattedData.sort((a, b) => new Date(a.x) - new Date(b.x));
    return formattedData;
  };

  const downloadAllData = () => {
    const dataToDownload = wpData.map((item) => {
      const date = new Date(item.date);
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const climatologyItem = climatology.climatology.find(
        (c) => c[0].month === month && c[0].day === day
      );

      const climatologyDepth = climatologyItem
        ? climatologyItem[0].values.find((value) => value.type === "depth")
            .value
        : null;
      const climatologyScaledDepth = climatologyItem
        ? climatologyItem[0].values.find(
            (value) => value.type === "scaled_depth"
          ).value
        : null;
      const climatologyRain = climatologyItem
        ? climatologyItem[0].values.find((value) => value.type === "rain").value
        : null;
      const climatologyEvp = climatologyItem
        ? climatologyItem[0].values.find((value) => value.type === "evp").value
        : null;

      return {
        date,
        depth: item.values
          .find((value) => value.type === "depth")
          ?.value.toFixed(2),
        trend_value_depth: climatologyDepth,
        scaled_depth: item.values
          .find((value) => value.type === "scaled_depth")
          ?.value.toFixed(2),
        trend_value_scaled_depth: climatologyScaledDepth,
        rain: item.values
          .find((value) => value.type === "rain")
          ?.value.toFixed(2),
        trend_value_rain: climatologyRain,
        evaporation: item.values
          .find((value) => value.type === "evp")
          ?.value.toFixed(2),
        trend_value_evaporation: climatologyEvp,
      };
    });
    const dataToDownloadFormatted = dataToDownload.map((item) => ({
      ...item,
      date: item.date.toLocaleDateString("en-CA"),
    }));
    dataToDownloadFormatted.sort((a, b) => new Date(a.date) - new Date(b.date));

    const csv = Papa.unparse(dataToDownloadFormatted);
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const csvURL = window.URL.createObjectURL(csvData);
    let tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", `${wp.name}.csv`);
    tempLink.click();
  };

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
              <Tabs
                defaultActiveKey="Monitored-data"
                id="fill-tab-example"
                className="mb-3 bg-body-tertiary "
                fill
              >
                <Tab eventKey="Monitored-data" title={t("data.monitored")}>
                  <Row className="mt-3 ">
                    <Col className="">
                      <h5>{t("data.monitored")}</h5>
                      <p>{t("data.monitored-d")}</p>
                      <p className="mb-0">{t("data.year")}</p>
                      {(() => {
                        const years = [
                          ...new Set(
                            wpData.map((item) =>
                              new Date(item.date).getFullYear()
                            )
                          ),
                        ];

                        return (
                          <>
                            <Row className="justify-content-around ">
                              <Col className="col-auto">
                                <p> {t("data.min-year")}</p>
                                <h4>{value && value.min}</h4>
                              </Col>
                              <Col className="col-auto">
                                <p> {t("data.max-year")}</p>
                                <h4>{value && value.max}</h4>
                              </Col>
                            </Row>
                            <SliderYear
                              step={1}
                              min={Math.min(...years)}
                              max={Math.max(...years)}
                              onChange={setValue}
                            />
                          </>
                        );
                      })()}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col-12 col-lg-6">
                      <h6 className="mt-2">{t("data.depth")}</h6>
                      {depthData?.length > 0 && (
                        <>
                          <p>
                            {t("data.depth-description")}{" "}
                            <span className="fw-bold ">{wp.name}</span>,{" "}
                            {t("data.depth-year")} {t("data.between")}{" "}
                            <span className="fw-bold ">{value.min}</span> and{" "}
                            <span className="fw-bold ">{value.max}</span>.
                          </p>
                          <ReactApexChart
                            options={{
                              chart: {
                                id: "depth",
                                group: "historical",
                                toolbar: {
                                  export: {
                                    csv: {
                                      filename: `${wp.name}-${value.min}-${value.max}`,
                                      dateFormatter(timestamp) {
                                        const newDate = new Date(timestamp);
                                        const formattedDate = newDate
                                          .toISOString()
                                          .split("T")[0];
                                        return formattedDate;
                                      },
                                    },
                                  },
                                },
                              },
                              xaxis: {
                                type: "datetime",
                              },
                            }}
                            series={[
                              { name: t("data.depth"), data: depthData },
                              {
                                name: t("data.climatology"),
                                data: climaDepthData,
                              },
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
                              {t("data.scaled-description")}{" "}
                              <span className="fw-bold ">{wp.name}</span>,{" "}
                              {t("data.depth-year")} {t("data.between")}{" "}
                              <span className="fw-bold ">{value.min}</span> and{" "}
                              <span className="fw-bold ">{value.max}</span>.
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
                                {
                                  name: t("data.scaled"),
                                  data: scaledDepthData,
                                },
                                {
                                  name: t("data.climatology"),
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
                      <h6 className="mb-0">{t("data.rain")}</h6>
                      <p className="fw-light ">{t("data.source")}: RFE</p>
                      {rain?.length > 0 && (
                        <>
                          <p>
                            {t("data.rain-description")}{" "}
                            <span className="fw-bold ">{wp.name}</span>,{" "}
                            {t("data.depth-year")} {t("data.between")}{" "}
                            <span className="fw-bold ">{value.min}</span> and{" "}
                            <span className="fw-bold ">{value.max}</span>.
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
                              { name: t("data.rain"), data: rain },
                              { name: t("data.climatology"), data: climaRain },
                            ]}
                            type="line"
                            height={350}
                          />
                          <p className="label-y">mm</p>
                        </>
                      )}
                    </Col>
                    <Col className="col-12 col-lg-6">
                      <h6 className="mb-0">{t("data.evap")}</h6>
                      <p className="fw-light ">
                        {t("data.source")}: Global GDAS
                      </p>
                      {evap?.length > 0 && (
                        <>
                          <p>
                            {t("data.evap-description")}{" "}
                            <span className="fw-bold ">{wp.name}</span>,{" "}
                            {t("data.depth-year")} {t("data.between")}{" "}
                            <span className="fw-bold ">{value.min}</span> and{" "}
                            <span className="fw-bold ">{value.max}</span>.
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
                              { name: t("data.evap"), data: evap },
                              { name: t("data.climatology"), data: climaEvap },
                            ]}
                            type="line"
                            height={350}
                          />
                          <p className="label-y">mm</p>
                        </>
                      )}
                    </Col>
                    <Col className="mb-4">
                      <Button onClick={() => downloadAllData()}>
                        <IconDownload className="me-2" />
                        {t("data.download")}
                      </Button>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="Climate Forecast" title={t("data.climate")}>
                  <Row className="mt-3">
                    <h5 className="mb-0">{t("data.subseasonal")}</h5>
                    <p className="fw-light ">
                      {t("data.source")}: AClimate Ethiopia
                    </p>
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
                    <h5 className="mb-0">{t("data.seasonal")}</h5>
                    <p className="fw-light ">
                      {t("data.source")}: AClimate Ethiopia
                    </p>
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
