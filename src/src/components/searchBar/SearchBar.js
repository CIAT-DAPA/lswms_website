import { IconSearch, IconDropletFilled } from "@tabler/icons-react";
import React, { useState } from "react";
import "./SearchBar.css";
import { useTranslation } from "react-i18next";

function SearchBar({ waterpoints, onWpClick }) {
  const [t, i18n] = useTranslation("global");
  const [filterText, setFilterText] = useState("");
  const [selectedWaterpoint, setSelectedWaterpoint] = useState("");

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setSelectedWaterpoint("");
  };

  const filteredWaterpoints = waterpoints.filter((wp) =>
    [wp.name, wp.adm1, wp.adm2, wp.adm3].some((prop) =>
      prop.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const handleWpClick = (wp) => {
    onWpClick(wp);
    setSelectedWaterpoint(`${wp.name}, ${wp.adm3}, ${wp.adm2}, ${wp.adm1}`);
  };

  return (
    <div className="bar-hints">
      <div
        className={`search-bar d-flex px-3 py-2 bg-white align-items-center border-bottom ${
          filterText === "" || filterText.length < 3
            ? "search-bar-unfocused "
            : "search-bar-focused "
        }`}
      >
        <input
          type="search"
          className="form-control form-control-sm border-0 text-input"
          style={{ width: "350px" }}
          aria-label="Search waterpoint"
          placeholder={t("monitoring.placeholder-search")}
          onChange={handleFilterChange}
          value={selectedWaterpoint || filterText}
          autoFocus
        />
        <IconSearch />
      </div>
      {filterText !== "" && filterText.length >= 3 && (
        <div className="bg-white waterpoints-search px-3 py-1">
          {filteredWaterpoints.map((wp, i) => {
            return (
              <div
                className="py-1 small hint-div text-capitalize "
                key={i}
                onClick={() => handleWpClick(wp)}
              >
                <IconDropletFilled
                  className="me-3"
                  style={{ color: "#6ecdeb" }}
                />
                {`${wp.name.toLowerCase()}, ${wp.adm3.toLowerCase()}, ${wp.adm2.toLowerCase()}, ${wp.adm1.toLowerCase()}`}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
