import { IconDownload } from "@tabler/icons-react";
import "./BtnDownload.css";
import html2canvas from "html2canvas";
import React from "react";
import { Button, Dropdown } from "react-bootstrap";

function BtnDownload({ idElement, jpg, raster, rasterFile, nameFile, route }) {
  const downloadMapAsJpg = async () => {
    try {
      const html = document.querySelector(idElement);
      const canvas = await html2canvas(html, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        ignoreElements: (element) => {
          return element.classList?.contains("exclude");
        },
      });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement("a");
      link.href = imgData;
      link.download = nameFile ? nameFile : "screenshot.jpg";
      link.click();
    } catch (error) {
      console.error("Error al descargar el mapa como JPG:", error);
    }
  };

  const downloadRaster = async () => {
    try {
      const link = document.createElement("a");
      link.href = rasterFile;
      link.download = nameFile ? nameFile : "raster.tif";
      link.click();
    } catch (error) {
      console.error("Error al descargar el mapa como raster:", error);
    }
  };

  return (
    <Dropdown className="position-static exclude">
      <Dropdown.Toggle
        variant="primary"
        id={route ? `btn-download-map-up` : `btn-download-map`}
        className="rounded-4 exclude"
      >
        <IconDownload size={20} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {jpg && <Dropdown.Item onClick={downloadMapAsJpg}>JPG</Dropdown.Item>}
        {raster && (
          <Dropdown.Item onClick={downloadRaster}>Raster</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default BtnDownload;
