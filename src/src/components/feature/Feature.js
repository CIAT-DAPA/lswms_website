import React from "react";
import { Col } from "react-bootstrap";
import './Feature.css';

function Feature(props) {
  return (
    <Col className={`py-5 px-5 ${props.color==="white"?"feature-white":"feature-blue"}`}>
      <div className="d-flex align-items-center mb-4">
        <img src={props.image} alt={props.title} className="me-2" />
        <h5 className="fw-medium m-0">{props.title}</h5>
      </div>
      <p className="fw-normal">
        {props.description}
      </p>
    </Col>
  );
}

export default Feature;
