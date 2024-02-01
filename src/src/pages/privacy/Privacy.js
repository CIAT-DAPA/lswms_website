import React from "react";
import { useTranslation } from "react-i18next";

function Privacy() {
  const [t] = useTranslation("global");
  return (
    <div className="container">
      <h1 className="pt-5">{t("privacy.title")} </h1>
      <p>{t("privacy.description-1")}</p>
      <p className="mt-5">{t("privacy.description-2")}</p>
      <ul>
        <li>{t("privacy.description-2-1")}</li>
        <li>{t("privacy.description-2-2")}</li>
      </ul>
      <p className="mt-5">{t("privacy.description-3")}</p>
      <ol>
        <li>{t("privacy.description-3-1")}</li>
        <li className="mt-3">{t("privacy.description-3-2")}</li>
        <li className="mt-3">{t("privacy.description-3-3")}</li>
        <li className="mt-3">{t("privacy.description-3-4")}</li>
        <li className="mt-3">{t("privacy.description-3-5")}</li>
        <li className="mt-3">{t("privacy.description-3-6")}</li>
        <li className="mt-3">{t("privacy.description-3-7")}</li>
      </ol>
    </div>
  );
}

export default Privacy;
