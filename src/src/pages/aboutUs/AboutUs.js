import React from "react";
import { useTranslation } from "react-i18next";
import eiarImg from "../../assets/img/EIAR.jpg";

function AboutUs() {
  const [t] = useTranslation("global");
  return (
    <div className="container">
      <div className="pt-5 d-flex align-items-center justify-content-around ">
        <img src={eiarImg} alt="EIAR" className="img-fluid " />
        <div className="text-center">
          <h1 className="" style={{ color: "#007E39" }}>
            የኢትዮጵያ የግብርና ምርምር ኢንስቲትዩት
          </h1>
          <h1 className="" style={{ color: "#007E39" }}>
            Ethiopian Institute of Agricultural Research
          </h1>
        </div>
      </div>

      <h1 className="pt-3">{t("aboutUs.title")}</h1>
      <p>{t("aboutUs.description-1")}</p>
      <p>{t("aboutUs.description-2")}</p>
      <p>{t("aboutUs.description-3")}</p>
      <h2 className="mt-3">{t("aboutUs.vision")}</h2>
      <p>{t("aboutUs.vision-d")}</p>
      <h2 className="mt-3">{t("aboutUs.mission")}</h2>
      <p>{t("aboutUs.mission-d")}</p>
      <h2 className="mt-3">{t("aboutUs.core-values")}</h2>
      <ul>
        <li>
          {" "}
          {t("aboutUs.core-values-d")}
          <ul>
            <li>{t("aboutUs.core-values-1")}</li>
            <li>{t("aboutUs.core-values-2")}</li>
            <li>{t("aboutUs.core-values-3")}</li>
            <li>{t("aboutUs.core-values-4")}</li>
            <li>{t("aboutUs.core-values-5")}</li>
            <li>{t("aboutUs.core-values-6")}</li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default AboutUs;
