import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import { Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import ForecastItem from "../../components/forecastItem/ForecastItem";
import Configuration from "../../conf/Configuration";
import axios from "axios";

function HistoricalData() {
  ChartJS.register(
    TimeScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
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
  let dataDepth;
  let dataRain;
  let dataEvap;
  let optionsDepth;
  let optionsRain;
  let optionsEvap;

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
    setScaledDepthData(filteredScaledDepthData);

    const filteredRain = wpData
      .filter(
        (item) => new Date(item.date).getFullYear() === Number(selectedYear)
      )
      .map((item) => ({
        x: new Date(item.date),
        y: item.values.find((value) => value.type === "rain")?.value || 0,
      }));
    setRain(filteredRain);

    const filteredEvap = wpData
      .filter(
        (item) => new Date(item.date).getFullYear() === Number(selectedYear)
      )
      .map((item) => ({
        x: new Date(item.date),
        y: item.values.find((value) => value.type === "evp")?.value || 0,
      }));
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
    dataDepth = {
      datasets: [
        {
          label: "Depth",
          data: depthData,
          fill: false,
          borderColor: "blue",
        },
        {
          label: "Scaled Depth",
          data: scaledDepthData,
          fill: false,
          borderColor: "green",
        },
      ],
    };
    dataRain = {
      datasets: [
        {
          label: "Rain",
          data: rain,
          fill: false,
          borderColor: "blue",
        }
      ],
    };
    dataEvap = {
      datasets: [
        {
          label: "Evaporation",
          data: evap,
          fill: false,
          borderColor: "blue",
        }
      ],
    };
    optionsDepth = {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
        },
        y: {
          title: {
            display: true,
            text: "Depth in %",
          },
        },
      },
    };
    optionsRain = {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
        },
        y: {
          title: {
            display: true,
            text: "Rain in mm",
          },
        },
      },
    };
    optionsEvap = {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
        },
        y: {
          title: {
            display: true,
            text: "Evap in mm",
          },
        },
      },
    };
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
                  <h6>Depth and Scaled Depth</h6>
                  <p>
                    This plot shows the historical values of rainfall,
                    evapotransporation and water level. You can filter the year
                    that you want
                  </p>
                  <p>Year</p>
                  <select
                    className="form-select w-25"
                    aria-label="Default select example"
                    onChange={handleFilterYear}
                  >
                    {uniqueYears.map((year) => (
                      <option value={year} key={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <Line options={optionsDepth} data={dataDepth} />
                </Col>
              </Row>
              <Row>
                <Col className="col-12 col-lg-6">
                  <h6>Rain</h6>
                  <p>
                    This plot shows the historical values of rainfall,
                    evapotransporation and water level. You can filter the year
                    that you want
                  </p>
                  <Line options={optionsRain} data={dataRain} />
                </Col>
                <Col className="col-12 col-lg-6">
                  <h6>Evaporation</h6>
                  <p>
                    This plot shows the historical values of rainfall,
                    evapotransporation and water level. You can filter the year
                    that you want
                  </p>
                  <Line options={optionsEvap} data={dataEvap} />
                </Col>
              </Row>
              <Row className="mt-3">
                <h5>Sub-seasonal forecast</h5>
                <p>
                  This plot shows the historical values of rainfall,
                  evapotransporation and water level. You can filter the year
                  that you want
                </p>
                <Col>
                  <ForecastItem />
                </Col>
                <Col>
                  <ForecastItem />
                </Col>
                <Col>
                  <ForecastItem />
                </Col>
                <Col>
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
