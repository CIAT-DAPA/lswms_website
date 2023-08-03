import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import tempImg from "../../assets/svg/temp.svg";
import tempMaxImg from "../../assets/svg/tempMax.svg";
import tempMinImg from "../../assets/svg/tempMin.svg";
import rainImg from "../../assets/svg/rain.svg";
import evapImg from "../../assets/svg/evap.svg";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import ForecastItem from "../../components/forecastItem/ForecastItem";
import Configuration from "../../conf/Configuration";
import axios from "axios";

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

  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       label: "Dataset 1",
  //       data: [12, 43, 54, 23, 43, 45, 23],
  //       borderColor: "rgb(255, 99, 132)",
  //       backgroundColor: "rgba(255, 99, 132, 0.5)",
  //       yAxisID: "y",
  //     },
  //     {
  //       label: "Dataset 2",
  //       data: [23, 54, 23, 45, 12, 54, 21],
  //       borderColor: "rgb(53, 162, 235)",
  //       backgroundColor: "rgba(53, 162, 235, 0.5)",
  //       yAxisID: "y1",
  //     },
  //   ],
  // };
  const [wp, setWp] = useState();
  const [wpData, setWpData] = useState();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const idWp = location.state?.idWater;

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
    //Call to API to get waterpoints
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

  let uniqueYears;
  let depthData;
  let scaledDepthData;
  let data;
  // let options;
  if (wpData) {
    uniqueYears = [
      ...new Set(wpData.map((item) => new Date(item.date).getFullYear())),
    ];
    depthData = wpData.map((item) => ({
      x: new Date(item.date),
      y: item.values.find((value) => value.type === "depth")?.value || 0,
    }));
    scaledDepthData = wpData.map((item) => ({
      x: new Date(item.date),
      y: item.values.find((value) => value.type === "scaled_depth")?.value || 0,
    }));
    console.log(depthData)
    data = {
      datasets: [
        {
          label: "Depth",
          data: depthData,
          fill: false,
          borderColor: "blue", // Color de la línea para depth
        },
        {
          label: "Scaled Depth",
          data: scaledDepthData,
          fill: false,
          borderColor: "green", // Color de la línea para scaled_depth
        },
      ],
    };
    // options = {
    //   // Opciones de configuración de la gráfica, por ejemplo:
    //   scales: {
    //     x: {
    //       type: "time", // Escala para fechas en el eje X
    //       time: {
    //         unit: "day", // Unidad de tiempo para agrupar los datos
    //       },
    //     },
    //   },
    // };
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
                    class="form-select"
                    aria-label="Default select example"
                  >
                    {uniqueYears.map((year) => (
                      <option value={year} key={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <Line options={options} data={data} />
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
