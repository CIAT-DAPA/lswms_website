import React from "react";
import img404 from "../../assets/img/404.png";
import { useTranslation } from "react-i18next";

function NotFound() {
  const [t] = useTranslation("global");
  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex justify-content-around flex-column align-items-center flex-lg-row"
    >
      <img src={img404} alt="" />
      <div>
        <h1>{t("notFound.title")}</h1>
        <p>{t("notFound.description")}</p>
      </div>
    </div>
  );
}

export default NotFound;
