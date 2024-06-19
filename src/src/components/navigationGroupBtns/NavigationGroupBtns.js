import React, { useState, useEffect } from "react";
import {
  OverlayTrigger,
  Tooltip,
  Button,
  Modal,
  Popover,
} from "react-bootstrap";
import {
  IconBrandFacebook,
  IconBrandX,
  IconChartDonut,
  IconCloudRain,
  IconDownload,
  IconId,
  IconInfoCircleFilled,
  IconShare,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import Services from "../../services/apiService";
import SubscriptionButton from "../subscriptionButton/SubscriptionButton";

const NavigationButton = ({
  href,
  downloadAction,
  share,
  icon: IconComponent,
  labelKey,
  tooltipKey,
  noTooltip,
  positionTooltip,
  additionalClasses = "",
}) => {
  const { t } = useTranslation("global");
  const content = (
    <>
      <IconComponent />
      {labelKey && <span className="ms-2">{t(labelKey)}</span>}
    </>
  );

  const popoverShare = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">{t("profile.share")}</Popover.Header>
      <Popover.Body>
        <Button
          className="me-2 btn-facebook"
          onClick={() => {
            const url = window.location.href;
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
              url
            )}`;
            window.open(shareUrl, "_blank");
          }}
        >
          <IconBrandFacebook />
        </Button>
        <Button
          className="btn-x"
          onClick={() => {
            const url = window.location.href;
            const text = "Check this waterpoint!";
            const shareUrl = `https://twitter.com/share?url=${encodeURI(
              url
            )}&text=${encodeURI(text)}`;
            window.open(shareUrl, "_blank");
          }}
        >
          <IconBrandX />
        </Button>
      </Popover.Body>
    </Popover>
  );

  return href ? (
    noTooltip ? (
      <a
        href={href}
        className={`btn btn-primary me-2 rounded-4 ${additionalClasses}`}
      >
        {content}
      </a>
    ) : (
      <OverlayTrigger
        placement={positionTooltip}
        overlay={
          <Tooltip id={`${tooltipKey}-tooltip`}>{t(tooltipKey)}</Tooltip>
        }
      >
        <a
          href={href}
          className={`btn btn-primary me-2 rounded-4 ${additionalClasses}`}
        >
          {content}
        </a>
      </OverlayTrigger>
    )
  ) : noTooltip ? (
    share ? (
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        rootClose={true}
        overlay={popoverShare}
      >
        <Button className="rounded-4 me-2">{content}</Button>
      </OverlayTrigger>
    ) : (
      <button
        className={`btn btn-primary me-2 rounded-4 ${additionalClasses}`}
        onClick={() => downloadAction()}
      >
        {content}
      </button>
    )
  ) : (
    <OverlayTrigger
      placement={positionTooltip}
      overlay={<Tooltip id={`${tooltipKey}-tooltip`}>{t(tooltipKey)}</Tooltip>}
    >
      {share ? (
        <div>
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            rootClose={true}
            overlay={popoverShare}
          >
            <Button className="rounded-4 me-2">{content}</Button>
          </OverlayTrigger>
        </div>
      ) : (
        <button
          className={`btn btn-primary me-2 rounded-4 ${additionalClasses}`}
          onClick={() => downloadAction()}
        >
          {content}
        </button>
      )}
    </OverlayTrigger>
  );
};

function NavigationGroupBtns({
  wp,
  noProfile,
  noData,
  noForecast,
  noDownload,
  downloadAction,
  labelDownload,
  noShare,
  noSubscription,
  infoWhite,
  idWater,
  idUser,
  setShowToastSubscribe,
  setToastSuccess,
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
      .then((response) => setMonitoredData(response.data[0]))
      .catch((error) => console.log(error));
  }, [wp.id]);

  const hasContentsWp =
    monitoredData?.am || monitoredData?.or || monitoredData?.en;
  const handleClose = () => setShowWarning(false);

  return (
    <>
      {hasContentsWp && (
        <Modal show={showWarning} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t("monitoring.modal-title", "Warning")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {t(
              "monitoring.modal-body",
              "The waterpoint profile is not available in the language selected, only in"
            )}{" "}
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
              {t("monitoring.modal-close", "Close")}
            </Button>
            <a
              href={`/profile/${wpId}/${Object.keys(monitoredData).find(
                (key) => monitoredData[key] === true
              )}`}
              className={`btn btn-primary text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-3 py-2 ${
                hasContentsWp ? "" : "disabled "
              }`}
            >
              {t("monitoring.modal-continue", "Continue to waterpoint profile")}
            </a>
          </Modal.Footer>
        </Modal>
      )}
      {!noData && (
        <NavigationButton
          href={`/dashboard/${wp.id}`}
          icon={IconChartDonut}
          labelKey={label ? "monitoring.data" : ""}
          tooltipKey="profile.data-popup"
          noTooltip={noTooltip}
          positionTooltip={positionTooltip}
        />
      )}
      {!noForecast && (
        <NavigationButton
          href={`/forecast/${wp.id}`}
          icon={IconCloudRain}
          labelKey={label ? "monitoring.forecast" : ""}
          tooltipKey="profile.forecast-popup"
          noTooltip={noTooltip}
          positionTooltip={positionTooltip}
        />
      )}
      {!noProfile &&
        (hasContentsWp && !monitoredData[i18n.language] ? (
          noTooltip ? (
            <Button
              className={`btn btn-primary text-white rounded-4 d-flex align-items-center justify-content-between  me-2 ${
                hasContentsWp ? "" : "disabled "
              }`}
              onClick={() => setShowWarning(true)}
            >
              <IconId style={{ position: "inherit" }} />
              {label && <span className="ms-2">{t("monitoring.profile")}</span>}
            </Button>
          ) : (
            <OverlayTrigger
              placement={positionTooltip}
              overlay={
                <Tooltip id={`profile.popup-tooltip`}>
                  {t("profile.profile-popup")}
                </Tooltip>
              }
            >
              <Button
                className={`btn btn-primary text-white rounded-4 d-flex align-items-center justify-content-between  me-2 ${
                  hasContentsWp ? "" : "disabled "
                }`}
                onClick={() => setShowWarning(true)}
              >
                <IconId style={{ position: "inherit" }} />
                {label && (
                  <span className="ms-2">{t("monitoring.profile")}</span>
                )}
              </Button>
            </OverlayTrigger>
          )
        ) : (
          <NavigationButton
            href={`/profile/${wp.id}`}
            icon={IconId}
            labelKey={label ? "monitoring.profile" : ""}
            tooltipKey="profile.profile-popup"
            noTooltip={noTooltip}
            positionTooltip={positionTooltip}
            additionalClasses={`text-white rounded-4 d-flex align-items-center justify-content-between  me-2 ${
              hasContentsWp ? "" : "disabled "
            }`}
          />
        ))}
      {!noDownload && (
        <NavigationButton
          icon={IconDownload}
          downloadAction={downloadAction}
          labelKey={
            label && labelDownload
              ? labelDownload
              : label
              ? "profile.download"
              : ""
          }
          tooltipKey={labelDownload ? labelDownload : "profile.download"}
          noTooltip={noTooltip}
          positionTooltip={positionTooltip}
        />
      )}
      {!noShare && (
        <NavigationButton
          icon={IconShare}
          share={!noShare}
          labelKey={label ? "profile.share" : ""}
          tooltipKey="profile.share"
          noTooltip={noTooltip}
          positionTooltip={positionTooltip}
        />
      )}
      {!noSubscription &&
        (noTooltip ? (
          <>
            <SubscriptionButton
              idWater={idWater}
              idUser={idUser}
              setShowToastSubscribe={setShowToastSubscribe}
              setToastSuccess={setToastSuccess}
              label
            />
            <OverlayTrigger
              placement={positionTooltip}
              overlay={
                <Tooltip id={`tooltip-top`}>
                  {t("monitoring.subscription-info")}
                </Tooltip>
              }
            >
              <IconInfoCircleFilled
                style={{ color: infoWhite ? "#4d9b8d" : "#1a473f" }}
              />
            </OverlayTrigger>
          </>
        ) : (
          <>
            <OverlayTrigger
              placement={positionTooltip}
              overlay={
                <Tooltip id="subscription-tooltip">
                  {t("profile.subscribe-popup")}
                </Tooltip>
              }
            >
              <div>
                <SubscriptionButton
                  idWater={idWater}
                  idUser={idUser}
                  setShowToastSubscribe={setShowToastSubscribe}
                  setToastSuccess={setToastSuccess}
                />
              </div>
            </OverlayTrigger>
            <OverlayTrigger
              placement={positionTooltip}
              overlay={
                <Tooltip id={`tooltip-top`}>
                  {t("monitoring.subscription-info")}
                </Tooltip>
              }
            >
              <IconInfoCircleFilled
                style={{ color: infoWhite ? "#4d9b8d" : "#1a473f" }}
              />
            </OverlayTrigger>
          </>
        ))}
    </>
  );
}

export default NavigationGroupBtns;
