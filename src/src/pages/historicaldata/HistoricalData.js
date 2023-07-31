import React from "react";
import { useLocation } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import tempImg from "../../assets/svg/temp.svg";
import tempMaxImg from "../../assets/svg/tempMax.svg";
import tempMinImg from "../../assets/svg/tempMin.svg";
import rainImg from "../../assets/svg/rain.svg";
import evapImg from "../../assets/svg/evap.svg";
import { Col, Container, Row } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import WaterpointItem from "../../components/waterpointItem/WaterpointItem";
import ForecastItem from "../../components/forecastItem/ForecastItem";

function HistoricalData() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Chart.js Line Chart - Multi Axis",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [12, 43, 54, 23, 43, 45, 23],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Dataset 2",
        data: [23, 54, 23, 45, 12, 54, 21],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1",
      },
    ],
  };
  const location = useLocation();
  const idAclimate = location.state?.idAclimate;
  var tableContent = {
    district: "Haro",
    kebele: "Bake",
    region: "Borona",
    zone: "Oromia",
  };
  return (
    <div>
      {idAclimate ? (
        <>
          <Container className="">
            <Row className="pt-5 border-bottom border-2">
              <h1 className="pt-2 ">Name waterpoint</h1>
            </Row>
            <Row className="mt-3 ">
              <Col className="col-8">
                <h5>Monitored data</h5>
                <h6>Historical data</h6>
                <p>
                  This plot shows the historical values of rainfall,
                  evapotransporation and water level. You can filter the year
                  that you want
                </p>
                <p>Year</p>
                <select class="form-select" aria-label="Default select example">
                  <option selected>Select a year</option>
                  <option value="1">2023</option>
                  <option value="2">2022</option>
                  <option value="3">2021</option>
                </select>
                <Line options={options} data={data} />
              </Col>
              <Col>
                <WaterpointItem
                  type="table"
                  title="Waterpoint description"
                  item={tableContent}
                />
              </Col>
            </Row>
            <Row className="mt-3 border-bottom border-2">
              <h6>Climate</h6>
              <Col className="d-flex">
                <img src={tempImg} alt="temperature" className="me-2" />
                <div>
                  <p className="mb-0 ">Temperature: </p>
                  <p className="mb-0 fs-4 fw-medium ">31°C</p>
                </div>
              </Col>
              <Col className="d-flex">
                <img src={tempMaxImg} alt="temperature Max" className="me-2" />
                <div>
                  <p className="mb-0 ">Max temperature:: </p>
                  <p className="mb-0 fs-4 fw-medium ">31°C</p>
                </div>
              </Col>
              <Col className="d-flex">
                <img src={tempMinImg} alt="temperature Min" className="me-2" />
                <div>
                  <p className="mb-0 ">Min temperature:: </p>
                  <p className="mb-0 fs-4 fw-medium ">31°C</p>
                </div>
              </Col>
              <Col className="d-flex">
                <img src={rainImg} alt="rain" className="me-2" />
                <div>
                  <p className="mb-0 ">Average Rainfall:: </p>
                  <p className="mb-0 fs-4 fw-medium ">31mm</p>
                </div>
              </Col>
              <Col className="d-flex">
                <img src={evapImg} alt="evap" className="me-2" />
                <div>
                  <p className="mb-0 ">Average Evaporation:: </p>
                  <p className="mb-0 fs-4 fw-medium ">31mm</p>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <h5>Sub-seasonal forecast</h5>
              <p>
                This plot shows the historical values of rainfall,
                evapotransporation and water level. You can filter the year that
                you want
              </p>
              <Col>
                <ForecastItem/>
              </Col>
              <Col>
                <ForecastItem/>
              </Col>
              <Col>
                <ForecastItem/>
              </Col>
              <Col>
                <ForecastItem/>
              </Col>
            </Row>
          </Container>
        </>
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
