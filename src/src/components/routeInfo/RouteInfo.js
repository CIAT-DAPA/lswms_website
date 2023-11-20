import React from "react";
import "./RouteInfo.css";
import { IconClockHour3, IconRuler2 } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

function RouteInfo({ route }) {
    const [t, i18n] = useTranslation("global");
  const distanceInKm = (route.distance / 1000).toFixed(2);
  const timeInHours = Math.floor(route.time / 3600000);
  const timeInMinutes = Math.floor((route.time % 3600000) / 60000);

  return (
    <div className="route-info bg-white px-4 py-3 rounded-4">
      <p className="fw-medium mb-2">{t("route.title")}</p>
      <table className="fs-6" style={{ width: "100%" }}>
        <tbody>
          <tr>
            <IconClockHour3 size={20} />
            <td>{t("route.time")}:</td>
            <td>
              {timeInHours} hrs {timeInMinutes} min
            </td>
          </tr>
          <tr>
            <IconRuler2 size={20} />
            <td className="pe-2">{t("route.distance")}:</td>
            <td>{distanceInKm} km</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default RouteInfo;
