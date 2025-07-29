import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Advisories.css";
import BtnDownload from "../../components/btnDownload/BtnDownload";
import ShareButton from "../../components/shareButton/ShereButton"; // Ajusta si es necesario

function Advisories() {
    const { t } = useTranslation("global");

    const [type, setType] = useState("Seasonal");
    const [season, setSeason] = useState("");
    const [seasonOptions, setSeasonOptions] = useState([]);

    // Map de archivos disponibles
    const FILE_MAP = {
        "q2-2024": {
            label: "Jun-Aug 2024",
            name: "Pastoral-Advisory-Jun-August-2024.pdf",
            route: "/data/Pastoral-Advisory-Jun-August-2024.pdf"
        },
        "q4-2024": {
            label: "Oct-Dec 2024",
            name: "Pastoral-Advisory-October-December-2024.pdf",
            route: "/data/Pastoral-Advisory-October-December-2024.pdf"
        },
        "q1-2025": {
            label: "Mar-May 2025",
            name: "Pastoral-Advisory-March-May-2025.pdf",
            route: "/data/Pastoral-Advisory-March-May-2025.pdf"
        },
        "q3-2025": {
            label: "Jul-Sep 2025",
            name: "Pastoral-Advisory-July-September-2025.pdf",
            route: "/data/Pastoral-Advisory-July-September-2025.pdf"
        }
    };

    const selectedSeasonLabel = FILE_MAP[season]?.label || "";

    const descriptionWithSeason = t("advisories.description-3").replace(
        "March-May 2025",
        selectedSeasonLabel
    );

    useEffect(() => {
        if (type === "Seasonal") {
            const options = Object.entries(FILE_MAP).map(([value, { label }]) => ({
                value,
                label
            }));
            setSeasonOptions(options);
            setSeason(options[0].value);
        } else if (type === "subseasonal") {
            const now = new Date();
            const currentMonth = now.getMonth(); // 0 = Jan
            const currentYear = now.getFullYear();

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

    const getDownloadInfo = () => {
        if (type !== "Seasonal" || !FILE_MAP[season]) {
            return { name: "", route: "", disabled: true };
        }
        const { name, route } = FILE_MAP[season];
        return { name, route, disabled: false };
    };

    const { name, route, disabled } = getDownloadInfo();

    return (
        <div className="container pt-4">
            <h1 className="mb-4 mt-5">{t("advisories.title")}</h1>

            <div className="row">
                {/* Selectores */}
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

                {/* Texto y botones */}
                <div className="col-md-8 mb-5">
                    <h5 className="fw-bold mb-2">
                        Pastoral {type} Advisory {selectedSeasonLabel}
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
