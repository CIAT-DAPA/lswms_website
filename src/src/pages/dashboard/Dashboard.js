import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import {
  Col,
  Container,
  Modal,
  Row,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Services from "../../services/apiService";
import ReactApexChart from "react-apexcharts";
import "./Dashboard.css";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import SliderYear from "../../components/sliderYear/SliderYear";
import { useAuth } from "../../hooks/useAuth";

import NavigationGroupBtns from "../../components/navigationGroupBtns/NavigationGroupBtns";
function HistoricalData() {
  const { userInfo } = useAuth();
  const [show, setShow] = useState(false);
  const [showToastSubscribe, setShowToastSubscribe] = useState(false);
  const [toastSuccess, setToastSuccess] = useState();
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
  const [evap, setEvap] = useState([]);
  const [value, setValue] = useState(null);
  const [dataFilterByYearsToDownload, setDataFilterByYearsToDownload] =
    useState([]);
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
    filterData2();
  }, [value]);

  const filterData2 = () => {
    if (!wpData) return;

    const { min, max } = value;
    const filteredValues = wpData.filter((item) => {
      const itemDate = new Date(item.date);
      const itemYear = itemDate.getFullYear();
      return itemYear >= min && itemYear <= max;
    });
    setDataFilterByYearsToDownload(filteredValues);
  };

  useEffect(() => {
    if (value) {
      setDepthData(filterData(wpData, "depth"));
      setScaledDepthData(filterData(wpData, "scaled_depth"));
      setRain(filterData(wpData, "rain"));
      setEvap(filterData(wpData, "evp"));

      const result = typeNames.map((type) => {
        // Asegurar que climatology.climatology sea un array
        const climatologyData = climatology?.climatology ?? [];

        return climatologyData
          .flatMap((monthData) => {
            // Asegurar que monthData sea un array
            const monthArray = Array.isArray(monthData) ? monthData : [];
            return monthArray.flatMap((dayData) => {
              const month = dayData.month.toString().padStart(2, "0");
              const day = dayData.day.toString().padStart(2, "0");
              const years = Array.from(
                { length: value.max - value.min + 1 },
                (_, i) => value.min + i
              );

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
    }
  }, [value]);

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
    const dataToDownload = dataFilterByYearsToDownload.map((item) => {
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
  function groupAndSum(data, groupSize) {
    let result = [];
    for (let i = 0; i < data.length; i += groupSize) {
      let group = data.slice(i, i + groupSize);
      let sum = group.reduce((acc, curr) => acc + parseFloat(curr.y), 0);
      let startDate = group[0].x;
      let endDate = group[group.length - 1].x;
      result.push({ x: `${startDate} - ${endDate}`, y: sum.toFixed(2) });
    }
    return result;
  }

  const rainTendaysSum = groupAndSum(rain, 10);

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
            <ToastContainer
              className="p-3 position-fixed "
              position="bottom-end"
              style={{ zIndex: 1 }}
            >
              <Toast
                show={show}
                onClose={() => setShow(false)}
                autohide
                delay={3000}
              >
                <Toast.Header className="bg-warning-subtle">
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                  />
                  <strong className="me-auto">
                    {t("profile.toast-title") || "Warning"}
                  </strong>
                </Toast.Header>
                <Toast.Body>
                  {t("profile.toast-body") ||
                    "The waterpoint profile is not available in the language selected"}
                </Toast.Body>
              </Toast>
            </ToastContainer>

            <ToastContainer
              className="p-3 position-fixed"
              position="bottom-end"
              style={{ zIndex: 2000 }}
            >
              <Toast
                onClose={() => setShowToastSubscribe(false)}
                show={showToastSubscribe}
                delay={2000}
                className={
                  !toastSuccess ? `bg-danger-subtle` : `bg-success-subtle`
                }
                autohide
              >
                <Toast.Body>
                  {!toastSuccess
                    ? t("subscriptionToast.unsubscribed")
                    : t("subscriptionToast.subscribed")}
                </Toast.Body>
              </Toast>
            </ToastContainer>
            <Container className="">
              <Row className="pt-5 border-bottom border-2 align-items-center">
                <Col xs={6}>
                  <div>
                    <h1 className="pt-2 mb-0">{wp.name}</h1>
                    <p className="mb-0">{`${wp.adm1}, ${wp.adm2}, ${wp.adm3}, ${wp.watershed_name}`}</p>
                  </div>
                </Col>
                <Col
                  xs={6}
                  className="d-flex justify-content-end align-items-center"
                >
                  <NavigationGroupBtns
                    labelDownload="data.download"
                    noData
                    downloadAction={downloadAllData}
                    idWater={idWp}
                    idUser={userInfo?.sub}
                    setShowToastSubscribe={setShowToastSubscribe}
                    setToastSuccess={setToastSuccess}
                    wp={wp}
                    wpId={wp.id}
                    positionTooltip="bottom"
                  />
                </Col>
              </Row>

              <Row className="mt-3 ">
                <Col className="">
                  <h5>{t("data.monitored")}</h5>
                  <p>{t("data.monitored-d")}</p>

                  {(() => {
                    const years = [
                      ...new Set(
                        wpData.map((item) => new Date(item.date).getFullYear())
                      ),
                    ];

                    return (
                      <>
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
                        <span className="fw-bold ">{value.min}</span>{" "}
                        {t("data.and")}{" "}
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
                            name: t("data.depth_daily_average"),
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
                  <h6 className="mt-2">
                    {t("data.scaled_depth_daily_average")}
                  </h6>
                  <div id="line-scaled">
                    {scaledDepthData?.length > 0 && (
                      <>
                        <p>
                          {t("data.scaled-description")}{" "}
                          <span className="fw-bold ">{wp.name}</span>,{" "}
                          {t("data.depth-year")} {t("data.between")}{" "}
                          <span className="fw-bold ">{value.min}</span>{" "}
                          {t("data.and")}{" "}
                          <span className="fw-bold ">{value.max}</span>.
                        </p>
                        <ReactApexChart
                          options={{
                            chart: {
                              id: "scaled",
                              group: "",
                            },
                            xaxis: {
                              type: "datetime",
                            },
                            yaxis: {
                              max: 100,
                            },
                          }}
                          series={[
                            {
                              name: t("data.scaled"),
                              data: scaledDepthData,
                            },
                            {
                              name: t("data.scaled_depth_daily_average"),
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
                  {rainTendaysSum?.length > 0 && (
                    <>
                      <p>
                        {t("data.rain-description")}{" "}
                        <span className="fw-bold ">{wp.name}</span>,{" "}
                        {t("data.depth-year")} {t("data.between")}{" "}
                        <span className="fw-bold ">{value.min}</span>{" "}
                        {t("data.and")}{" "}
                        <span className="fw-bold ">{value.max}</span>.
                      </p>
                      <ReactApexChart
                        options={{
                          chart: {
                            id: "rain",
                            group: "rain",
                          },
                          xaxis: {
                            type: "",
                            tickAmount: 3,
                            labels: {
                              show: false,
                            },
                          },

                          legend: {
                            show: true,
                          },
                        }}
                        series={[
                          { name: t("data.rain"), data: rainTendaysSum },
                        ]}
                        type="line"
                        height={350}
                      />

                      <p className="label-y">mm</p>

                      <div
                        className="text-center"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "-35px",
                        }}
                      >
                        <span
                          className="apexcharts-legend-text"
                          rel="1"
                          i="0"
                          data-default-text={t("data.rain")}
                          data-collapsed="false"
                          style={{
                            color: "rgb(55, 61, 63)",
                            fontSize: "12px",
                            fontWeight: 400,
                            fontFamily: "Helvetica, Arial, sans-serif",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: "13px",
                              height: "13px",
                              borderRadius: "50%",
                              backgroundColor: "#008ffb",
                              marginRight: "5px",
                            }}
                          ></span>
                          {t("data.rain")}
                        </span>
                      </div>
                    </>
                  )}
                </Col>

                <Col className="col-12 col-lg-6">
                  <h6 className="mb-0">{t("data.evap")}</h6>
                  <p className="fw-light ">{t("data.source")}: Global GDAS</p>
                  {evap?.length > 0 && (
                    <>
                      <p>
                        {t("data.evap-description")}{" "}
                        <span className="fw-bold ">{wp.name}</span>,{" "}
                        {t("data.depth-year")} {t("data.between")}{" "}
                        <span className="fw-bold ">{value.min}</span>{" "}
                        {t("data.and")}{" "}
                        <span className="fw-bold ">{value.max}</span>.
                      </p>
                      <ReactApexChart
                        options={{
                          chart: {
                            id: "evap",
                            group: "evap",
                          },
                          xaxis: {
                            type: "datetime",
                          },
                        }}
                        series={[{ name: t("data.evap"), data: evap }]}
                        type="line"
                        height={350}
                      />
                      <p className="label-y">mm</p>
                      <div
                        className="text-center"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "-35px",
                        }}
                      >
                        <span
                          className="apexcharts-legend-text"
                          rel="1"
                          i="0"
                          data-default-text={t("data.rain")}
                          data-collapsed="false"
                          style={{
                            color: "rgb(55, 61, 63)",
                            fontSize: "12px",
                            fontWeight: 400,
                            fontFamily: "Helvetica, Arial, sans-serif",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: "13px",
                              height: "13px",
                              borderRadius: "50%",
                              backgroundColor: "#008ffb",
                              marginRight: "5px",
                            }}
                          ></span>
                          {t("data.evap")}
                        </span>
                      </div>
                    </>
                  )}
                </Col>
              </Row>
            </Container>
            <Container className="mb-2 mt-4">
              <div className="d-flex align-items-center">
                <NavigationGroupBtns
                  noData
                  downloadAction={downloadAllData}
                  labelDownload="data.download"
                  idWater={idWp}
                  idUser={userInfo?.sub}
                  setShowToastSubscribe={setShowToastSubscribe}
                  setToastSuccess={setToastSuccess}
                  wp={wp}
                  wpId={wp.id}
                  positionTooltip="bottom"
                  label
                  noTooltip
                />
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
            <h1>{t("data.notFound-title")}</h1>
            <p>{t("data.notFound-d")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoricalData;
