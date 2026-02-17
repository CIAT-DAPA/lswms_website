import { IconDownload } from "@tabler/icons-react";
import "./BtnDownload.css";
import html2canvas from "html2canvas";
import React from "react";
import { Button, Dropdown } from "react-bootstrap";

function BtnDownload({
  idElement,
  jpg,
  raster,
  rasterFile,
  nameFile,
  route,
  disabled,
  manuals,
}) {
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
      link.download = nameFile || "screenshot.jpg";
      link.click();
    } catch (error) {
      console.error("Error downloading JPG:", error);
    }
  };

  const downloadRaster = () => {
    try {
      const link = document.createElement("a");
      link.href = rasterFile;
      link.download = nameFile || "raster.tif";
      link.click();
    } catch (error) {
      console.error("Error downloading raster:", error);
    }
  };

  // ✅ FORZAR DESCARGA PDF (aunque el server lo abra inline)
  const downloadFromRoute = async () => {
    try {
      if (!route) return;

      const filename =
        nameFile || (manuals ? "manuals.pdf" : "advisory.pdf");

      const response = await fetch(route, {
        method: "GET",
        // headers: { accept: "application/pdf" }, // opcional
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  if (route && !jpg && !raster) {
    return (
      <Button
        variant="primary"
        className="rounded-4 me-2 d-flex align-items-center gap-2 exclude"
        onClick={downloadFromRoute}
        disabled={disabled}
      >
        <IconDownload size={20} />
        {manuals ? "Download Manuals" : "Download Advisory"}
      </Button>
    );
  }

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
        {route && (
          <Dropdown.Item onClick={downloadFromRoute}>
            {manuals ? "Manuals (PDF)" : "Advisory (PDF)"}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default BtnDownload;