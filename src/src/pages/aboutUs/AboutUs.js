import React from "react";
import { useTranslation } from "react-i18next";

function AboutUs() {
  const [t, i18n] = useTranslation("global");
  return (
    <div className="container">
      <h1 className="pt-5">{t("aboutUs.title")}</h1>
      <p>{t("aboutUs.description")}</p>
      <h2>{t("aboutUs.about-project")}</h2>
      <p>{t("aboutUs.about-project-d")}</p>
      <h2>{t("aboutUs.product")}</h2>
      <p>{t("aboutUs.product-d")}</p>
    </div>
  );
}

export default AboutUs;
