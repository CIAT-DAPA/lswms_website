import React, { useEffect, useState } from "react";
import { IconMailOff, IconMailPlus } from "@tabler/icons-react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import Services from "../../services/apiService";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

function SubscriptionButton({
  idWater,
  idUser,
  label,
  setShowToastSubscribe,
  setToastSuccess,
  size,
}) {
  const [t] = useTranslation("global");
  const [subscription, setSubscription] = useState();
  const { login } = useAuth();

  useEffect(() => {
    fetchSubscription();
  }, [idWater, idUser]);

  const fetchSubscription = () => {
    Services.get_one_subscription_by_user(idUser, idWater)
      .then((response) => {
        if (response.length > 0) setSubscription(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubscription = (bolletin) => {
    if (!idUser) {
      login();
      return;
    }

    Services.post_subscription(idUser, idWater, bolletin)
      .then((response) => {
        fetchSubscription();
        setShowToastSubscribe(true);
        setToastSuccess(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUnsubscribe = () => {
    Services.patch_unsubscribe(idWater, subscription[0].id)
      .then((response) => {
        setSubscription();
        setShowToastSubscribe(true);
        setToastSuccess(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {subscription ? (
        <Button
          size={size ? size : ""}
          className={`me-2 btn-danger ${size ? "rounded-3" : "rounded-4"}`}
          onClick={() => handleUnsubscribe()}
        >
          <IconMailOff size={20} className={label ? "me-2" : ""} />
          {label ? t("subscriptionButton.unsubscribe") : ""}
        </Button>
      ) : (
        <Dropdown>
          <Dropdown.Toggle
            size={size ? size : ""}
            className={`me-2 btn-success ${size ? "rounded-3" : "rounded-4"}`}
            id="dropdown-basic"
          >
            <IconMailPlus size={20} className={label ? "me-2" : ""} />{" "}
            {label ? t("subscriptionButton.subscribe") : ""}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSubscription("weekly")}>
              {t("subscriptionButton.weekly")}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSubscription("alert")}>
              {t("subscriptionButton.alert")}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  );
}

export default SubscriptionButton;
