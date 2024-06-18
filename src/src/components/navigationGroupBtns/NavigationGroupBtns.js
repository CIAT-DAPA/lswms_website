import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip, Button, Modal } from "react-bootstrap";
import { IconChartDonut, IconCloudRain, IconId } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Services from "../../services/apiService";

function NavigationGroupBtns({
  wp,
  profile,
  data,
  forecast,
  wpId,
  positionTooltip,
  label,
  noTooltip,
}) {
  const [t, i18n] = useTranslation("global");
  const [showWarning, setShowWarning] = useState(false);
  const [monitoredData, setMonitoredData] = useState();

  useEffect(() => {
    Services.get_last_data(wp.id)
      .then((response) => {
        setMonitoredData(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const hasContentsWp =
    monitoredData?.am || monitoredData?.or || monitoredData?.en;
  const handleClose = () => setShowWarning(false);
  {
    hasContentsWp && (
      <Modal show={showWarning} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("monitoring.modal-title") || "Warning"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("monitoring.modal-body") ||
            "The waterpoint profile is not available in the language selected, only in"}{" "}
          <strong>
            {monitoredData["en"]
              ? "English"
              : monitoredData["am"]
              ? "Amharic"
              : "Afaan Oromo"}
          </strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("monitoring.modal-close") || "Close"}
          </Button>
          <Link
            type="button"
            className={`btn btn-primary text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-3 py-2 ${
              hasContentsWp ? "" : "disabled "
            }`}
            to={`/profile/${wpId}/${Object.keys(monitoredData).find(
              (key) => monitoredData[key] === true
            )}`}
          >
            {t("monitoring.modal-continue") || "Continue to waterpoint profile"}
          </Link>
        </Modal.Footer>
      </Modal>
    );
  }
  return (
    <>
      {hasContentsWp && (
        <Modal show={showWarning} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {t("monitoring.modal-title") || "Warning"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {t("monitoring.modal-body") ||
              "The waterpoint profile is not available in the language selected, only in"}{" "}
            <strong>
              {monitoredData["en"]
                ? "English"
                : monitoredData["am"]
                ? "Amharic"
                : "Afaan Oromo"}
            </strong>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t("monitoring.modal-close") || "Close"}
            </Button>
            <Link
              type="button"
              className={`btn btn-primary text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-3 py-2 ${
                hasContentsWp ? "" : "disabled "
              }`}
              to={`/profile/${wpId}/${Object.keys(monitoredData).find(
                (key) => monitoredData[key] === true
              )}`}
            >
              {t("monitoring.modal-continue") ||
                "Continue to waterpoint profile"}
            </Link>
          </Modal.Footer>
        </Modal>
      )}
      {data &&
        (noTooltip ? (
          <a
            href={`/dashboard/${wp.id}`}
            className="btn btn-primary me-2 rounded-4"
          >
            <IconChartDonut />
            {label && <span className="ms-2">{t("monitoring.data")}</span>}
          </a>
        ) : (
          <OverlayTrigger
            placement={positionTooltip}
            overlay={
              <Tooltip id="dashboard-tooltip">
                {t("profile.data-popup")}
              </Tooltip>
            }
          >
            <a
              href={`/dashboard/${wp.id}`}
              className="btn btn-primary me-2 rounded-4"
            >
              <IconChartDonut />
              {label && <span className="ms-2">{t("monitoring.data")}</span>}
            </a>
          </OverlayTrigger>
        ))}

      {forecast &&
        (noTooltip ? (
          <Link
            type="button"
            className="btn btn-primary me-2 rounded-4"
            to={`/forecast/${wp.id}`}
          >
            <IconCloudRain />
            {label && <span className="ms-2">{t("monitoring.forecast")}</span>}
          </Link>
        ) : (
          <OverlayTrigger
            placement={positionTooltip}
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
              {label && (
                <span className="ms-2">{t("monitoring.forecast")}</span>
              )}
            </Link>
          </OverlayTrigger>
        ))}

      {profile &&
        (noTooltip ? (
          hasContentsWp && !monitoredData[i18n.language] ? (
            <Button
              className={`btn btn-primary text-white rounded-3 fw-medium d-flex align-items-center justify-content-between py-2 me-2 ${
                hasContentsWp ? "" : "disabled "
              }`}
              onClick={() => setShowWarning(true)}
            >
              <IconId style={{ position: "inherit" }} />
              {label && <span className="ms-2">{t("monitoring.profile")}</span>}
            </Button>
          ) : (
            <Link
              type="button"
              className={`btn btn-primary  text-white rounded-4 fw-medium d-flex align-items-center justify-content-between py-2 me-2 ${
                hasContentsWp ? "" : "disabled "
              }`}
              to={`/profile/${wpId}`}
            >
              <IconId style={{ position: "inherit" }} />
              {label && <span className="ms-2">{t("monitoring.profile")}</span>}
            </Link>
          )
        ) : hasContentsWp && !monitoredData[i18n.language] ? (
          <OverlayTrigger
            placement={positionTooltip}
            overlay={
              <Tooltip id="forecast-tooltip">
                {t("profile.profile-popup")}
              </Tooltip>
            }
          >
            <Button
              className={`btn btn-primary text-white rounded-3 fw-medium d-flex align-items-center justify-content-between py-2 me-2 ${
                hasContentsWp ? "" : "disabled "
              }`}
              onClick={() => setShowWarning(true)}
            >
              <IconId style={{ position: "inherit" }} />
              {label && <span className="ms-2">{t("monitoring.profile")}</span>}
            </Button>
          </OverlayTrigger>
        ) : (
          <OverlayTrigger
            placement={positionTooltip}
            overlay={
              <Tooltip id="forecast-tooltip">
                {t("profile.profile-popup")}
              </Tooltip>
            }
          >
            <Link
              type="button"
              className={`btn btn-primary  text-white rounded-4 fw-medium d-flex align-items-center justify-content-between py-2 me-2 ${
                hasContentsWp ? "" : "disabled "
              }`}
              to={`/profile/${wpId}`}
            >
              <IconId style={{ position: "inherit" }} />
              {label && <span className="ms-2">{t("monitoring.profile")}</span>}
            </Link>
          </OverlayTrigger>
        ))}
    </>
  );
}

export default NavigationGroupBtns;
