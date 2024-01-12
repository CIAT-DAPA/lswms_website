import React, { useEffect, useState } from "react";
import "./BiomassLegend.css";
import Configuration from "../../conf/Configuration";

function BiomassLegend({ layer }) {
  const [legend, setLegend] = useState();

  useEffect(() => {
    const image = `${Configuration.get_url_geoserver()}?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER=${layer}&Transparent=True&LEGEND_OPTIONS=dx:3;fontName:Helvetica`;
    setLegend(image);
  }, [layer]);

  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control leaflet-bar">
        <div className="biomass-legend bg-white px-4 py-3 rounded-4 ">
          <h5 className="fw-medium">Biomass</h5>
          <img src={legend}></img>
        </div>
      </div>
    </div>
  );
}

export default BiomassLegend;
