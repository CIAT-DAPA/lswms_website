import React from "react";
import { useTranslation } from "react-i18next";

const Form = ({
    filteredData,
    selectedScenario,
    setSelectedScenario,
    selectedDate,
    setSelectedDate,
    dates,
    selectedOption,
    setSelectedOption
}) => {
    const [t] = useTranslation("global");
    return (
        <div
            className="card shadow-sm position-absolute"
            style={{ width: "350px", marginTop: "80px", marginLeft: "20px", zIndex: 1000 }}
        >
            <div className="card-body">
                {filteredData && (
                    <>
                        <div className="mb-3">
                            <label className="form-label fw-bold">{t("rain.type")}</label>
                            <select
                                className="form-select"
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(e.target.value)}
                            >
                                <option value="">{t("rain.select-type")}</option>
                                <option value="Seasonal">{t("rain.seasonal")}</option>
                                <option value="Subseasonal">{t("rain.subseasonal")}</option>
                            </select>
                        </div>

                        {selectedOption && (
                            <div className="mb-3">
                                <label className="form-label fw-bold">{t("rain.escenario")}</label>
                                <select
                                    className="form-select"
                                    value={selectedScenario}
                                    onChange={(e) => setSelectedScenario(e.target.value)}
                                >
                                    <option value="">{t("rain.select")}</option>
                                    {filteredData
                                        .map((item) => {
                                            const name = item.Name.toLowerCase();

                                            
                                            if (
                                                name.includes("below") ||
                                                name.includes("normal") ||
                                                name.includes("above") ||
                                                name.includes("dominant")
                                            ) {
                                                return (
                                                    <option key={item.Name} value={item.Name}>
                                                        {item.Name.replace(/.*_/, "")} {/* Elimina prefijos */}
                                                    </option>
                                                );
                                            }
                                            return null;
                                        })
                                        .filter(Boolean)} {/* Filtra valores nulos */}
                                </select>

                            </div>
                        )}
                        {selectedScenario && (
                            <div className="mb-3">
                                <label className="form-label fw-bold">{t("rain.date")}</label>
                                <select
                                    className="form-select"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                >
                                    <option value="">{t("rain.select-date")}</option>
                                    {(() => {
                                        let filteredDates = dates;

                                        if (selectedScenario.startsWith("seasonal")) {
                                            // Eliminar la última y luego tomar las últimas dos
                                            filteredDates = dates.slice(0, -1).slice(-2);
                                        } else if (selectedScenario.startsWith("subseasonal")) {
                                            // Tomar las últimas cuatro sin eliminar nada
                                            filteredDates = dates.slice(-4);
                                        }

                                        return filteredDates.map((date) => {
                                            let displayText = date; // Por defecto, se muestra la fecha tal cual

                                            if (selectedScenario.startsWith("seasonal")) {
                                                const monthNumber = date.split("-")[1].replace(/^0/, ""); // Extraer el mes sin el cero inicial
                                                displayText = `${t(`data.month${monthNumber - 1}`)} - ${t(`data.month${monthNumber}`)} - ${t(`data.month${Number(monthNumber) + 1}`)}`;
                                            }

                                            return (
                                                <option key={date} value={date}>
                                                    {displayText}
                                                </option>
                                            );
                                        });
                                    })()}

                                </select>
                            </div>
                        )}





                    </>
                )}
            </div>
        </div>
    );
};

export default Form;
