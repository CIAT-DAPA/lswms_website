import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./Advisories.css";
import BtnDownload from "../../components/btnDownload/BtnDownload";
import ShareButton from "../../components/shareButton/ShereButton";
import Services from "../../services/apiService"; // ajusta el path si es diferente

function Advisories() {
  const { t } = useTranslation("global");

  // UI state
  const [type, setType] = useState("seasonal"); // "seasonal" | "subseasonal"
  const [season, setSeason] = useState(""); // aquí guardamos el filename seleccionado

  // data state
  const [pdfs, setPdfs] = useState({ seasonal: [], subseasonal: [] });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 1) cargar PDFs desde el endpoint
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await Services.get_all_pdfs(); // debe devolver { seasonal: [], subseasonal: [] }
        if (!isMounted) return;

        setPdfs({
          seasonal: Array.isArray(data?.seasonal) ? data.seasonal : [],
          subseasonal: Array.isArray(data?.subseasonal) ? data.subseasonal : [],
        });
      } catch (e) {
        if (!isMounted) return;
        setErrorMsg("Failed to load advisories.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2) lista actual según type
  const currentList = useMemo(() => {
    return type === "seasonal" ? pdfs.seasonal : pdfs.subseasonal;
  }, [type, pdfs]);

  // 3) opciones para el select (label = name, value = filename)
  const seasonOptions = useMemo(() => {
    return (currentList || []).map((item) => ({
      value: item.filename,
      label: item.name || item.filename,
    }));
  }, [currentList]);

  // 4) cuando cambie type o lleguen datos, setear selección por defecto
  useEffect(() => {
    if (!seasonOptions.length) {
      setSeason("");
      return;
    }

    // si lo que está seleccionado no existe en el nuevo listado, ponemos el último
    const exists = seasonOptions.some((o) => o.value === season);
    if (!exists) {
      setSeason(seasonOptions[seasonOptions.length - 1].value);
    }
  }, [type, seasonOptions, season]);

  // 5) item seleccionado (por filename)
  const selected = useMemo(() => {
    if (!season) return null;
    return currentList.find((x) => x.filename === season) || null;
  }, [season, currentList]);

  const downloadInfo = useMemo(() => {
    if (!selected?.url || !selected?.filename) {
      return { name: "", route: "", disabled: true };
    }
    return {
      name: selected.filename,
      route: selected.url, // <-- viene del backend
      disabled: false,
    };
  }, [selected]);

  const { name, route, disabled } = downloadInfo;

  return (
    <div className="container pt-4">
      <h1 className="mb-4 mt-5">{t("advisories.title")}</h1>

      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">{t("rain.type")}</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label={t("rain.type")}
              disabled={loading}
            >
              <option value="seasonal">{t("rain.seasonal")}</option>
              <option value="subseasonal">{t("rain.subseasonal")}</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">{t("rain.escenario")}</label>
            <select
              className="form-select"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              aria-label={t("rain.escenario")}
              disabled={loading || !seasonOptions.length}
            >
              {seasonOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {loading && <small className="text-muted">Loading...</small>}
            {!loading && errorMsg && (
              <small className="text-danger">{errorMsg}</small>
            )}
            {!loading && !errorMsg && !seasonOptions.length && (
              <small className="text-muted">No advisories available.</small>
            )}
          </div>
        </div>

        <div className="col-md-8 mb-5">
          <h5 className="fw-bold mb-2">
            {selected?.name
              ? selected.name
              : `Pastoral ${type} Advisory`}
          </h5>

          {selected?.description ? (
            <p style={{ whiteSpace: "pre-line" }}>{selected.description}</p>
          ) : (
            <p className="text-muted">{t("advisories.description-3")}</p>
          )}

          <div className="mt-4 d-flex gap-3">
            <BtnDownload
              variant="success"
              route={route}
              nameFile={name}
              disabled={disabled}
            />
            <ShareButton
              labelKey="profile.share"
              tooltip="profile.share"
              position="top"
              noTooltip={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Advisories;