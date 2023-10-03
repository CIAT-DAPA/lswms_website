import { IconSearch, IconDropletFilled } from "@tabler/icons-react";
import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar({ waterpoints, onWpClick }) {
  const [filterText, setFilterText] = useState("");
  const [selectedWaterpoint, setSelectedWaterpoint] = useState("");

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setSelectedWaterpoint("");
  };

  const filteredWaterpoints = waterpoints.filter((wp) =>
    wp.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleWpClick = (wp) => {
    onWpClick(wp);
    setSelectedWaterpoint(wp.name);
  };

  return (
    <div className="bar-hints">
      <div
        className={`search-bar d-flex px-3 py-2 bg-white align-items-center border-bottom ${
          filteredWaterpoints.length === waterpoints.length
            ? "search-bar-unfocused "
            : "search-bar-focused "
        }`}
      >
        <input
          type="search"
          className="form-control form-control-sm border-0 text-input"
          aria-label="Search waterpoint"
          placeholder="Search waterpoint"
          onChange={handleFilterChange}
          value={selectedWaterpoint || filterText}
          autoFocus
        />
        <IconSearch />
      </div>
      {filterText !== "" && (
        <div className="bg-white waterpoints-search px-3 py-2">
          {filteredWaterpoints.map((wp, i) => {
            return (
              <div
                className="mb-2 small"
                key={i}
                onClick={() => handleWpClick(wp)}
              >
                <IconDropletFilled
                  className="me-3"
                  style={{ color: "#6ecdeb" }}
                />
                {wp.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
