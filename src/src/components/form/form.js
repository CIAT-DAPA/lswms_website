import React from "react";
import { useTranslation } from "react-i18next";

const Form = ({
    filteredData,
    selectedScenario,
    setSelectedScenario,
    selectedDate,
    setSelectedDate
}) => {
    const [t] = useTranslation("global");
    
    return (
        <div
            className="card shadow-sm position-absolute"
            style={{ width: "350px", marginTop: "30px", marginLeft: "20px", zIndex: 1000 }}
        >
            <div className="card-body">
                {filteredData && (
                    <>
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

                                        // 📌 Solo mostrar si contiene "below", "normal", "above" o "dominant"
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

                        
                    </>
                )}
            </div>
        </div>
    );
};

export default Form;
