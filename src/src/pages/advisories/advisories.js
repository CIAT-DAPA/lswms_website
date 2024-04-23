import React from "react";
import { useTranslation } from "react-i18next";
import eiarImg from "../../assets/img/EIAR.jpg";
import "./Advisories.css"
function Advisories() {
    const [t] = useTranslation("global");
    return (
        <div className="container">
            <div className="pt-5 d-flex align-items-center justify-content-around ">
                <div className="text-center">
                </div>
            </div>

            <h1 className="pt-3">{t("advisories.title")}</h1>
            <p>{t("advisories.description-1")}</p>
            <p>{t("advisories.description-2")}</p>
            <p>{t("advisories.description-3")}</p>
            <h2 className="mt-3">{t("advisories.condition")}</h2>
            <ul>
                <li>
                    {" "}
                    {t("advisories.status-d")}
                    <ul>
                        <li>{t("advisories.good")}</li>
                        <li>{t("advisories.watch")}</li>
                        <li>{t("advisories.alert")}</li>
                        <li>{t("advisories.near-dry")}</li>
                        <li>{t("advisories.seasonal-dry")}</li>

                    </ul>
                </li>
            </ul>
            <h2 className="mt-3">{t("advisories.message")}</h2>
            <ul>
                <li>
                    {" "}
                    {t("advisories.messages-d")}
                    <ul>
                        <li >{t("advisories.good")}: {t("advisories.good-message")}</li>
                        <li>{t("advisories.watch")}: {t("advisories.watch-message")}</li>
                        <li>{t("advisories.alert")}: {t("advisories.alert-message")}</li>
                        <li>{t("advisories.near-dry")}: {t("advisories.near-dry-message")}</li>
                        <li>{t("advisories.seasonal-dry")}: {t("advisories.seasonal-dry-message")}</li>
                    </ul>
                   
                </li>
            </ul>

        </div>
    );
}

export default Advisories;
