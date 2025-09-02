import React from "react";
import BtnDownload from "../../components/btnDownload/BtnDownload";

function Manuals() {
    const MANUAL_NAME = "Training Manual LWSM.pdf";
    const MANUAL_ROUTE = "/data/Training Manual LWSM.pdf";

    return (
        <div className="container pt-4">
            <h1 className="mb-3 mt-5">User Guidelines and Training Manuals</h1>

            <div className="row">
                <div className="col-md-10 col-lg-8">
                    <h5 className="fw-bold mb-2">Training Manual — ET‑Monitoring</h5>

                    <p className="mb-2">
                        This section is intended to provide official training materials for using the
                        ET‑Monitoring platform. The manual supports regional and zonal water and
                        livestock extension officers and researchers, strengthening capacity to access
                        the system, interpret water and pasture data, generate reports, and deliver early
                        warnings for climate risk management.
                    </p>

                    <ul className="mb-3">
                        <li><strong>What you’ll learn:</strong> system access (registration & login), dashboard navigation, and product interpretation.</li>
                        <li><strong>Main modules:</strong> platform overview; seasonal & sub‑seasonal climate forecasts; waterpoint monitoring & modeling; pasture monitoring; and climate‑risk advisories for early action.</li>
                        <li><strong>Key features:</strong> waterpoint location & profiles, rainfall & evaporation, scaled water depth, pasture biomass, and movement routes, plus six‑month forecasts.</li>
                        <li><strong>Alert colors (waterpoint status):</strong> Green (Good), Yellow (Watch), Gold (Alert), Red (Near‑dry), Grey (Seasonally dry).</li>
                        <li><strong>Languages:</strong> English, Amharic, and Afan Oromo.</li>
                        <li><strong>Data export & updates:</strong> download CSVs of core variables; subscribe to updates/alerts for selected waterpoints.</li>
                    </ul>


                    <div className="mt-3 d-flex gap-3">
                        <BtnDownload
                            variant="success"
                            route={MANUAL_ROUTE}
                            nameFile={MANUAL_NAME}
                            disabled={false}
                            manuals={true}
                        />

                    </div>

                    <small className="text-muted d-block mt-3">
                        Content based on the “Training of Trainers Manual and Guide” (July 2024).
                    </small>
                </div>
            </div>
        </div>
    );
}

export default Manuals;
