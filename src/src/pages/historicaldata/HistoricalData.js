import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import { Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import ForecastItem from "../../components/forecastItem/ForecastItem";
import Configuration from "../../conf/Configuration";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

function HistoricalData() {
  const [wp, setWp] = useState();
  const [wpData, setWpData] = useState();
  const [loading, setLoading] = useState(true);
  const [depthData, setDepthData] = useState([]);
  const [scaledDepthData, setScaledDepthData] = useState([]);
  const [rain, setRain] = useState([]);
  const [evap, setEvap] = useState([]);
  const location = useLocation();
  const idWp = location.state?.idWater;
  let uniqueYears;
  const chartOptionsDepth = {
    chart: {
      id: "depth",
      group: "chart",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
      title: {
        text: "%",
      },
    },
    tooltip: {
      shared: true,
      y: {
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
    },
  };
  const chartOptionsRain = {
    chart: {
      id: "rainevap",
      group: "chart",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
      title: {
        text: "mm",
      },
    },
    tooltip: {
      shared: true,
      y: {
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
    },
  };

  const handleFilterYear = (event) => {
    const selectedYear = event?.target?.value || event;
    const filteredDepthData = wpData
      .filter(
        (item) => new Date(item.date).getFullYear() === Number(selectedYear)
      )
      .map((item) => ({
        x: new Date(item.date),
        y: item.values.find((value) => value.type === "depth")?.value || 0,
      }));
    filteredDepthData.sort((a, b) => a.x - b.x);
    setDepthData(filteredDepthData);

    const filteredScaledDepthData = wpData
      .filter(
        (item) => new Date(item.date).getFullYear() === Number(selectedYear)
      )
      .map((item) => ({
        x: new Date(item.date),
        y:
          item.values.find((value) => value.type === "scaled_depth")?.value ||
          0,
      }));
    filteredScaledDepthData.sort((a, b) => a.x - b.x);
    setScaledDepthData(filteredScaledDepthData);

    const filteredRain = wpData
      .filter(
        (item) => new Date(item.date).getFullYear() === Number(selectedYear)
      )
      .map((item) => ({
        x: new Date(item.date),
        y: item.values.find((value) => value.type === "rain")?.value || 0,
      }));
    filteredRain.sort((a, b) => a.x - b.x);
    setRain(filteredRain);

    const filteredEvap = wpData
      .filter(
        (item) => new Date(item.date).getFullYear() === Number(selectedYear)
      )
      .map((item) => ({
        x: new Date(item.date),
        y: item.values.find((value) => value.type === "evp")?.value || 0,
      }));
    filteredEvap.sort((a, b) => a.x - b.x);
    setEvap(filteredEvap);
  };

  const urlWp = `${Configuration.get_url_api_base()}/waterpointsprofiles/${idWp}`;
  useEffect(() => {
    //Call to API to get waterpoints
    axios
      .get(urlWp)
      .then((response) => {
        setWp(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const urlWpData = `${Configuration.get_url_api_base()}/monitored/${idWp}`;
  useEffect(() => {
    //Call to API to get monitored data waterpoints
    axios
      .get(urlWpData)
      .then((response) => {
        setWpData(response.data);
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

  if (wpData && wpData.length > 0) {
    uniqueYears = [
      ...new Set(wpData.map((item) => new Date(item.date).getFullYear())),
    ];
    uniqueYears.sort((a, b) => b - a);
  }

  return (
    <div>
      {idWp ? (
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
              <Row className="mt-3 ">
                <Col className="">
                  <h5>Monitored data</h5>
                  <p>
                    See how the rain gives life to the earth, evaporates
                    mysteriously and then returns in depth. The numbers in a
                    visual graph that connects you to the very essence of
                    nature.. You can filter the year that you want
                  </p>
                  <p className="mb-0">Year</p>
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
                  <h6 className="mt-2">Depth and Scaled Depth</h6>
                  {depthData.length > 0 && scaledDepthData.length > 0 && (
                    <ReactApexChart
                      options={chartOptionsDepth}
                      series={[
                        { name: "Depth", data: depthData },
                        { name: "Scaled depth", data: scaledDepthData },
                      ]}
                      type="line"
                      height={350}
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col className="col-12 col-lg-6">
                  <h6>Rain</h6>
                  {rain.length > 0 && (
                    <ReactApexChart
                      options={chartOptionsRain}
                      series={[{ name: "Rain", data: rain }]}
                      type="line"
                      height={350}
                    />
                  )}
                </Col>
                <Col className="col-12 col-lg-6">
                  <h6>Evaporation</h6>
                  {evap.length > 0 && (
                    <ReactApexChart
                      options={chartOptionsRain}
                      series={[{ name: "Evaporation", data: evap }]}
                      type="line"
                      height={350}
                    />
                  )}
                </Col>
              </Row>
              <Row className="mt-3">
                <h5>Sub-seasonal forecast</h5>
                <p>
                  This plot shows the historical values of rainfall,
                  evapotransporation and water level. You can filter the year
                  that you want
                </p>
                <Col className="col-12 col-md-6 col-xxl-3">
                  <ForecastItem />
                </Col>
                <Col className="col-12 col-md-6 col-xxl-3">
                  <ForecastItem />
                </Col>
                <Col className="col-12 col-md-6 col-xxl-3">
                  <ForecastItem />
                </Col>
                <Col className="col-12 col-md-6 col-xxl-3">
                  <ForecastItem />
                </Col>
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
            <h1>No aclimate ID was provided.</h1>
            <p>Try to get the profile from the waterpoints display.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoricalData;
