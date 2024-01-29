import React, { useEffect, useState } from "react";
import { IconMailOff, IconMailPlus } from "@tabler/icons-react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import Services from "../../services/apiService";
import { useAuth } from "../../hooks/useAuth";

function SubscriptionButton({
  idWater,
  idUser,
  label,
  setShowToastSubscribe,
  setToastSuccess,
  size,
}) {
  const [modalSubscription, setModalSubscription] = useState(false);
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
      console.log("no user");
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
      <Modal
        show={modalSubscription}
        onHide={() => setModalSubscription(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">
            What type of subscription do you want?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Check
              type={"checkbox"}
              id={`default-checkbox`}
              label={`Weekly`}
            />
            <Form.Check
              type={"checkbox"}
              id={`default-checkbox`}
              label={`Alert`}
            />
          </Form>
        </Modal.Body>
      </Modal>
      {subscription ? (
        <Button
          size={size ? size : ""}
          className={`me-2 btn-danger ${size ? "rounded-3" : "rounded-4"}`}
          onClick={() => handleUnsubscribe()}
        >
          <IconMailOff size={20} className={label ? "me-2" : ""} />
          {label ? "Unsubscribe" : ""}
        </Button>
      ) : (
        <Dropdown>
          <Dropdown.Toggle
            size={size ? size : ""}
            className={`me-2 btn-success ${size ? "rounded-3" : "rounded-4"}`}
            id="dropdown-basic"
          >
            <IconMailPlus size={20} className={label ? "me-2" : ""} />{" "}
            {label ? "Subscribe" : ""}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSubscription("weekly")}>
              Weekly
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSubscription("alert")}>
              Alert
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  );
}

export default SubscriptionButton;
