import React from "react";
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import {
  IconBrandFacebook,
  IconBrandX,
  IconShare,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

function ShareButton({ tooltip = "profile.share", labelKey = "", noTooltip = false, position = "top" }) {
  const { t } = useTranslation("global");

  const popoverShare = (
    <Popover id="popover-share">
      <Popover.Header as="h3">{t("profile.share")}</Popover.Header>
      <Popover.Body>
        <Button
          className="me-2 btn-facebook"
          onClick={() => {
            const url = window.location.href;
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
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
            const shareUrl = `https://twitter.com/share?url=${encodeURIComponent(
              url
            )}&text=${encodeURIComponent(text)}`;
            window.open(shareUrl, "_blank");
          }}
        >
          <IconBrandX />
        </Button>
      </Popover.Body>
    </Popover>
  );

  const content = (
    <>
      <IconShare />
      {labelKey && <span className="ms-2">{t(labelKey)}</span>}
    </>
  );

  return noTooltip ? (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      rootClose={true}
      overlay={popoverShare}
    >
      <Button className="rounded-4 me-2 d-flex align-items-center gap-2">
        {content}
      </Button>
    </OverlayTrigger>
  ) : (
    <OverlayTrigger
      placement={position}
      overlay={<Tooltip id={`${tooltip}-tooltip`}>{t(tooltip)}</Tooltip>}
    >
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        rootClose={true}
        overlay={popoverShare}
      >
        <Button className="rounded-4 me-2 d-flex align-items-center gap-2">
          {content}
        </Button>
      </OverlayTrigger>
    </OverlayTrigger>
  );
}

export default ShareButton;
