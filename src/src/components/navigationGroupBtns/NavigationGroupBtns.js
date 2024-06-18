import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IconChartDonut, IconCloudRain } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function NavigationGroupBtns({ wp, profile, data, forecast }) {
  const [t, i18n] = useTranslation("global");

  return (
    <>
      {data && (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="dashboard-tooltip">{t("profile.data-popup")}</Tooltip>
          }
        >
          <a
            href={`/dashboard/${wp.id}`}
            className="btn btn-primary me-2 rounded-4"
          >
            <IconChartDonut />
          </a>
        </OverlayTrigger>
      )}

      {forecast && (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="forecast-tooltip">
              {t("profile.forecast-popup")}
            </Tooltip>
          }
        >
          <Link
            type="button"
            className="btn btn-primary me-2 rounded-4"
            to={`/forecast/${wp.id}`}
          >
            <IconCloudRain />
          </Link>
        </OverlayTrigger>
      )}
    </>
  );
}

export default NavigationGroupBtns;
