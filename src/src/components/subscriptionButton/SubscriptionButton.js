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
  const [subscription, setSubscription] = useState();
  const { login } = useAuth();

  useEffect(() => {
    fetchSubscription();
  }, [idWater, idUser]);

  const fetchSubscription = () => {
    Services.get_one_subscription_by_user(idUser, idWater)
      .then((response) => {
        if (response.length > 0) setSubscription(response);
        else setSubscription();
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

  const handleUnsubscribe = (bolletin) => {
    if (bolletin === "weekly") {
      Services.patch_unsubscribe(
        idWater,
        subscription.find((item) => item.boletin === "weekly").id
      )
        .then((response) => {
          fetchSubscription();
          setShowToastSubscribe(true);
          setToastSuccess(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (bolletin === "alert") {
      Services.patch_unsubscribe(
        idWater,
        subscription.find((item) => item.boletin === "alert").id
      )
        .then((response) => {
          fetchSubscription();
          setShowToastSubscribe(true);
          setToastSuccess(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          size={size ? size : ""}
          className={`me-2 btn ${size ? "rounded-3" : "rounded-4"} ${
            isMonitoringBtn ? "btn-monitoring" : ""
          }
          ${language == "or" ? "btn-or" : ""}`}
          id="dropdown-basic"
        >
          <IconMailPlus
            size={isMonitoringBtn ? 24 : 20}
            className={label ? "me-2" : ""}
          />{" "}
          {label ? (
            language == "or" ? (
              <p className="p-or">{t("subscriptionButton.subscribe")}</p>
            ) : (
              t("subscriptionButton.subscribe")
            )
          ) : (
            ""
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {subscription &&
          subscription.some((sub) => sub.boletin === "weekly") ? (
            <Dropdown.Item
              className="d-flex align-items-center justify-content-between "
              onClick={() => handleUnsubscribe("weekly")}
            >
              {t("subscriptionButton.weekly")}{" "}
              <Button variant="danger" size="sm" className="rounded-3 ">
                <IconMailOff size={20} />
              </Button>
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              className="d-flex align-items-center justify-content-between "
              onClick={() => handleSubscription("weekly")}
            >
              {t("subscriptionButton.weekly")}{" "}
              <Button variant="success" size="sm" className="rounded-3 ">
                <IconMailPlus size={20} />
              </Button>
            </Dropdown.Item>
          )}
          {subscription &&
          subscription.some((sub) => sub.boletin === "alert") ? (
            <Dropdown.Item
              className="d-flex align-items-center justify-content-between "
              onClick={() => handleUnsubscribe("alert")}
            >
              {t("subscriptionButton.alert")}{" "}
              <Button variant="danger" size="sm" className="rounded-3 ">
                <IconMailOff size={20} />
              </Button>
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              className="d-flex align-items-center justify-content-between "
              onClick={() => handleSubscription("alert")}
            >
              {t("subscriptionButton.alert")}
              <Button variant="success" size="sm" className="rounded-3 ">
                <IconMailPlus size={20} />
              </Button>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default SubscriptionButton;
