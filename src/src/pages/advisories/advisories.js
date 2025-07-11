import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Advisories.css";
import BtnDownload from "../../components/btnDownload/BtnDownload";
import ShareButton from "../../components/shareButton/ShereButton"; // Ajusta la ruta según tu estructura

function Advisories() {
    const { t } = useTranslation("global");

    const [type, setType] = useState("Seasonal");
    const [season, setSeason] = useState("");
    const [seasonOptions, setSeasonOptions] = useState([]);
    const selectedSeasonLabel = seasonOptions.find(opt => opt.value === season)?.label || "";

    const descriptionWithSeason = t("advisories.description-3").replace(
        "March-May 2025",
        selectedSeasonLabel
    );


    useEffect(() => {
        const now = new Date();
        const currentMonth = now.getMonth(); // 0-based
        const currentYear = now.getFullYear();

        if (type === "Seasonal") {
            const trimesters = [
                { label: `Jan-Mar ${currentYear}`, value: `q1-${currentYear}`, start: 0 },
                { label: `Apr-Jun ${currentYear}`, value: `q2-${currentYear}`, start: 3 },
                { label: `Jul-Sep ${currentYear}`, value: `q3-${currentYear}`, start: 6 },
                { label: `Oct-Dec ${currentYear}`, value: `q4-${currentYear}`, start: 9 },
            ];

            const currentQuarter = trimesters.find(
                q => currentMonth >= q.start && currentMonth < q.start + 3
            );

            setSeasonOptions(trimesters);
            setSeason(currentQuarter?.value || trimesters[0].value);
        } else if (type === "subseasonal") {
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const monthOptions = months.map((month, idx) => ({
                label: `${month} ${currentYear}`,
                value: `m${idx + 1}-${currentYear}`
            }));

            setSeasonOptions(monthOptions);
            setSeason(`m${currentMonth + 1}-${currentYear}`);
        }
    }, [type]);

    return (
        <div className="container pt-4">
            <h1 className="mb-4 mt-5">{t("advisories.title")}</h1>

            <div className="row">
                {/* Columna izquierda: Selectores */}
                <div className="col-md-4">
                    <div className="mb-3">
                        <label className="form-label">{t("rain.type")}</label>
                        <select
                            className="form-select"
                            value={type}
                            onChange={e => setType(e.target.value)}
                        >
                            <option value="Seasonal">{t("rain.seasonal")}</option>
                            <option value="subseasonal">{t("rain.subseasonal")}</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t("rain.escenario")}</label>
                        <select
                            className="form-select"
                            value={season}
                            onChange={e => setSeason(e.target.value)}
                        >
                            {seasonOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Columna derecha: Texto largo + botones */}
                <div className="col-md-8 mb-5">
                    <h5 className="fw-bold mb-2">
                        Pastoral {type} Advisory {seasonOptions.find(opt => opt.value === season)?.label}
                    </h5>
                    <p>
  {descriptionWithSeason.split("\n").map((line, idx) => (
    <span key={idx}>
      {line}
      <br />
    </span>
  ))}
</p>



                    <div className="mt-4 d-flex gap-3">
                        <BtnDownload
                            variant="success"
                            route="/data/Pastoral-Advisory.pdf"
                            nameFile="Pastoral-Advisory.pdf"
                            disabled={type === "subseasonal"}
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
