import React from "react";
import { useTranslation } from "react-i18next";

function AboutUs() {
  const [t, i18n] = useTranslation("global");
  return (
    <div className="container" style={{height:"90vh"}}>
      <h1 className="display-4 pt-5">{t("aboutUs.title")}</h1>
      <p>{t("aboutUs.description")}</p>
    </div>
  );
}

export default AboutUs;
