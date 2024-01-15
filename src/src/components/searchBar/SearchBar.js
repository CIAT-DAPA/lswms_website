import {
  IconSearch,
  IconDropletFilled,
  IconMapPin,
  IconCurrentLocation,
  IconAlertTriangleFilled,
  IconNavigation,
} from "@tabler/icons-react";
import React, { useState } from "react";
import "./SearchBar.css";
import Services from "../../services/apiService";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "react-bootstrap";
import { useDebouncedCallback } from "use-debounce";

function SearchBar({ waterpoints, onWpClick, type }) {
  const [t] = useTranslation("global");
  const [filterText, setFilterText] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [hits, setHits] = useState("");
  const [warning, setWarning] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [latCurrent, setLatCurrent] = useState();
  const [lonCurrent, setLonCurrent] = useState();

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setSelectedValue("");

    debouncedGetGeocoding(e.target.value);
  };

  const debouncedGetGeocoding = useDebouncedCallback((value) => {
    if (type === "places") {
      Services.get_geocoding(value)
        .then((response) => {
          setHits(response.hits);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, 300);

  const filteredWaterpoints = waterpoints.filter((wp) =>
    [wp.name, wp.adm1, wp.adm2, wp.adm3].some((prop) =>
      prop.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const handleWpClick = (wp) => {
    onWpClick(wp);
    setSelectedValue(`${wp.name}, ${wp.adm3}, ${wp.adm2}, ${wp.adm1}`);
  };

  const getRoute = () => {
    if ("geolocation" in navigator) {
      // El navegador admite geolocalización
      navigator.geolocation.getCurrentPosition(
        function (position) {
          Services.get_reverse_geocoding(
            position.coords.latitude,
            position.coords.longitude
          )
            .then((response) => {
              setLatCurrent(position.coords.latitude);
              setLonCurrent(position.coords.longitude);
              setSelectedValue(
                `${response.hits[0].name}, ${response.hits[0].city}, ${response.hits[0].country}`
              );
            })
            .catch((error) => {
              console.log(error);
            });
        },
        function (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setWarning(true);
              setWarningText(t("monitoring.warning-permission"));
              break;
            case error.POSITION_UNAVAILABLE:
              setWarning(true);
              setWarningText(t("monitoring.warning-position"));
              break;
            case error.TIMEOUT:
              setWarning(true);
              setWarningText(t("monitoring.warning-timeout"));
              break;
            default:
              setWarning(true);
              setWarningText(t("monitoring.warning-default"));
              break;
          }
        }
      );
    } else {
      setWarning(true);
      setWarningText(t("monitoring.warning-browser"));
    }
  };

  return (
    <>
      {/* Modal de warning de obtener ubicacion */}
      <Modal show={warning} onHide={() => setWarning(false)} centered>
        <Modal.Body className="d-flex align-items-center ">
          <IconAlertTriangleFilled
            className="me-2 text-warning "
            size={50}
          ></IconAlertTriangleFilled>
          {warningText}
        </Modal.Body>
      </Modal>
      <div className={`${type === "waterpoints" ? "bar-hints " : ""}`}>
        <div
          className={`search-bar d-flex px-3  bg-white align-items-center border-bottom justify-content-between ${
            type === "waterpoints" ? "py-2" : ""
          } ${
            filterText === "" || filterText.length < 3
              ? "search-bar-unfocused "
              : "search-bar-focused "
          }`}
        >
          <input
            type="search"
            className="form-control form-control-sm border-0 text-input w-100 text-capitalize "
            style={{ width: "350px" }}
            aria-label="Search waterpoint"
            placeholder={t("monitoring.placeholder-search")}
            onChange={handleFilterChange}
            value={selectedValue || filterText}
            autoFocus
          />
          {type === "places" ? (
            <>
              <Button
                className="btn-light bg-none rounded-0 py-2"
                onClick={() => {
                  getRoute();
                }}
              >
                <IconCurrentLocation />
              </Button>
              <Button
                className="btn-light bg-none rounded-0 py-2"
                onClick={() => {
                  if (latCurrent && lonCurrent) {
                    onWpClick(latCurrent, lonCurrent);
                  }
                }}
              >
                <IconNavigation />
              </Button>
            </>
          ) : (
            <IconSearch />
          )}
        </div>
        {filterText !== "" && filterText.length >= 3 && (
          <div className="bg-white waterpoints-search px-3 py-1">
            {filteredWaterpoints.map((wp, i) => {
              return (
                <div
                  className="py-1 small hint-div text-capitalize "
                  key={i}
                  onClick={() => {
                    if (type === "waterpoints") handleWpClick(wp);
                    if (type === "places") {
                      setSelectedValue(
                        `${wp.name.toLowerCase()}, ${wp.adm3.toLowerCase()}, ${wp.adm2.toLowerCase()}, ${wp.adm1.toLowerCase()}`
                      );
                      setLatCurrent(wp.lat);
                      setLonCurrent(wp.lon);
                    }
                  }}
                >
                  <IconDropletFilled
                    className="me-3"
                    style={{ color: "#6ecdeb" }}
                  />
                  {`${wp.name.toLowerCase()}, ${wp.adm3.toLowerCase()}, ${wp.adm2.toLowerCase()}, ${wp.adm1.toLowerCase()}`}
                </div>
              );
            })}
            {hits &&
              hits.map((e, i) => {
                return (
                  <div
                    className="py-1 small hint-div text-capitalize "
                    key={i}
                    onClick={() => {
                      if (type === "places") {
                        setSelectedValue(`${e.name}, ${e.country}`);
                        setLatCurrent(e.point.lat);
                        setLonCurrent(e.point.lng);
                      }
                    }}
                  >
                    <IconMapPin color="#4d4d4d" className="me-3" />
                    {e.name}, {e.country}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchBar;
