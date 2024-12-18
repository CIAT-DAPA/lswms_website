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
      <h2 className="mt-3">{t("aboutUs.about-project")}</h2>
      <p>{t("aboutUs.about-project-d")}</p>
      <h2 className="mt-3">{t("aboutUs.products")}</h2>
      <p>{t("aboutUs.products-d")}</p>
      <ul>
        <li>{t("aboutUs.products-1")}</li>
        <li>{t("aboutUs.products-2")}</li>
        <li>{t("aboutUs.products-3")}</li>
        <li>{t("aboutUs.products-4")}</li>
        <li>{t("aboutUs.products-5")}</li>
        <li>{t("aboutUs.products-6")}</li>
      </ul>
      <p>{t("aboutUs.products-d-2")}</p>
      <h2 className="mt-3">{t("aboutUs.key")}</h2>
      <p>{t("aboutUs.key-d")}</p>
    </div>
  );
}

export default AboutUs;
