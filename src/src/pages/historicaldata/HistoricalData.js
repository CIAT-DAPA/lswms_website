import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import img404 from "../../assets/img/404.png";
import { Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import ForecastItem from "../../components/forecastItem/ForecastItem";
import Configuration from "../../conf/Configuration";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import "./HistoricalData.css";

function HistoricalData() {
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
  const location = useLocation();
  const idWp = location.state?.idWater;
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

  const urlWp = `${Configuration.get_url_api_base()}/waterpointsprofiles/${idWp}`;
  const urlClimatology = `${Configuration.get_url_api_base()}/waterpoints/${idWp}`;
  useEffect(() => {
    //Call to API to get waterpoint
    axios
      .get(urlWp)
      .then((response) => {
        setWp(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });

    //Call to API to get climatology
    axios
      .get(urlClimatology)
      .then((response) => {
        setClimatology(response.data[0]);
        setAclimateId(response.data[0].aclimate_id);
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

  useEffect(() => {
    if (aclimateId) {
      const urlSubseasonal = `${Configuration.get_url_api_aclimate()}/Forecast/SubseasonalWS/${aclimateId}/json`;
      const urlSeasonal = `${Configuration.get_url_api_aclimate()}/Forecast/Climate/${aclimateId}/true/json`;
      //Call to API to get forecast
      axios
        .get(urlSubseasonal)
        .then((response) => {
          setSubseasonal(response.data.subseasonal[0].data);
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .get(urlSeasonal)
        .then((response) => {
          setSeasonal(response.data.climate[0].data);
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
                    Explore a variety of charts covering depth of field, depth
                    scale, precipitation and evapotranspiration. Customise your
                    experience by filtering these graphs according to your
                    preferred year.
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
                </Col>
              </Row>
              <Row>
                <Col className="col-12 col-lg-6">
                  <h6 className="mt-2">Depth</h6>
                  {depthData?.length > 0 && (
                    <>
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
                  <h6 className="mt-2">Scaled Depth</h6>
                  <div id="line-scaled">
                    {scaledDepthData?.length > 0 && (
                      <>
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
                            { name: "Climatology", data: climaScaledDepthData },
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
                  <h6>Rain</h6>
                  {rain?.length > 0 && (
                    <>
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
                  <h6>Evaporation</h6>
                  {evap?.length > 0 && (
                    <>
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
              <Row className="mt-3">
                <h5>Sub-seasonal forecast</h5>
                <p>
                  The climate prediction is given in percentage of probability
                  with respect to the normal range of precipitation of an area
                  and a specific month. Below, you can find the most probable
                  category for the selected municipality and the forecast month.
                </p>
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
                        />
                      </Col>
                    );
                  })}
              </Row>
              <Row className="mt-3 justify-content-around ">
                <h5>Seasonal forecast</h5>
                <p>
                  The climate prediction is given in percentage of probability
                  with respect to the normal range of precipitation of an area
                  and a specific quarter. Below, you can find the most probable
                  category for the selected municipality and the forecast
                  quarter.
                </p>
                {seasonal &&
                  seasonal.map((month, i) => {
                    return (
                      <Col className="col-12 col-md-4">
                        <ForecastItem
                          year={month.year}
                          month={month.month}
                          probabilities={month.probabilities}
                          name={wp.name}
                        />
                      </Col>
                    );
                  })}
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
