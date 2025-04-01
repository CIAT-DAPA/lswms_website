import React, { useEffect, useState } from "react";
import { IconMailOff, IconMailPlus } from "@tabler/icons-react";
import { Button, Dropdown } from "react-bootstrap";
import Services from "../../services/apiService";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import "./SubscriptionButton.css";

function SubscriptionButton({
  idWater,
  idUser,
  label,
  setShowToastSubscribe,
  setToastSuccess,
  size,
  isMonitoringBtn,
  language,
}) {
  const [t] = useTranslation("global");
  const [subscription, setSubscription] = useState(null);
  const { login } = useAuth();

  useEffect(() => {
    fetchSubscription();
  }, [idWater, idUser]);

  const fetchSubscription = async () => {
    try {
      const response = await Services.get_one_subscription_by_user(
        idUser,
        idWater
      );
      setSubscription(response.length > 0 ? response : null);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const handleSubscriptionAction = async (action, boletin) => {
    if (!idUser) {
      login();
      return;
    }

    try {
      if (action === "subscribe") {
        await Services.post_subscription(idUser, idWater, boletin);
        setToastSuccess(true);
      } else if (action === "unsubscribe") {
        const subItem = subscription?.find((item) => item.boletin === boletin);
        if (subItem) {
          await Services.patch_unsubscribe(idWater, subItem.id);
          setToastSuccess(false);
        }
      }
      await fetchSubscription();
      setShowToastSubscribe(true);
    } catch (error) {
      console.error(`Error on ${action} for ${boletin}:`, error);
    }
  };

  const renderDropdownItem = (boletinKey) => {
    const isSubscribed = subscription?.some(
      (sub) => sub.boletin === boletinKey
    );
    return (
      <Dropdown.Item
        className="d-flex align-items-center justify-content-between"
        onClick={() =>
          handleSubscriptionAction(
            isSubscribed ? "unsubscribe" : "subscribe",
            boletinKey
          )
        }
      >
        {t(`subscriptionButton.${boletinKey}`)}
        <Button
          variant={isSubscribed ? "danger" : "success"}
          size="sm"
          className="rounded-3"
        >
          {isSubscribed ? (
            <IconMailOff size={20} />
          ) : (
            <IconMailPlus size={20} />
          )}
        </Button>
      </Dropdown.Item>
    );
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        size={size || ""}
        className={`me-2 btn ${size ? "rounded-3" : "rounded-4"} ${
          isMonitoringBtn ? "btn-monitoring" : ""
        } ${language === "or" ? "btn-or" : ""}`}
        id="dropdown-basic"
      >
        <IconMailPlus
          size={isMonitoringBtn ? 24 : 20}
          className={label ? "me-2" : ""}
        />
        {label &&
          (language === "or" ? (
            <p className="p-or">{t("subscriptionButton.subscribe")}</p>
          ) : (
            t("subscriptionButton.subscribe")
          ))}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {renderDropdownItem("weekly")}
        {renderDropdownItem("alert")}
        {renderDropdownItem("forecast")}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SubscriptionButton;
