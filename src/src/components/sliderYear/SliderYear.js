import React, { useEffect, useState } from "react";
import { Form,Col,Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { IconCalendarTime } from "@tabler/icons-react";

function SliderYear({ step, min, max, value, onChange }) {
  const [t, i18n] = useTranslation("global");

  const [minValue, setMinValue] = useState(max);
  const [maxValue, setMaxValue] = useState(max);

  useEffect(() => {
    onChange({ min: minValue, max: maxValue });
  }, [minValue, maxValue]);

  useEffect(() => {
    if (value) {
      setMinValue(value.min);
      setMaxValue(value.max);
    }
  }, [value]);

  const handleMinChange = (e) => {
    const newMinVal = parseInt(e.target.value);
    setMinValue(newMinVal);
    if (newMinVal > maxValue) {
      setMaxValue(newMinVal);
    }
  };

  const handleMaxChange = (e) => {
    const newMaxVal = parseInt(e.target.value);
    setMaxValue(newMaxVal);
    if (newMaxVal < minValue) {
      setMinValue(newMaxVal);
    }
  };

  return (
    <div>
      <p className="mb-1">{t("data.filter")}</p>
      
      <Row >
        <Col className="col-4 col-lg-2">
          <label className="mb-1 d-flex aling-items-center" htmlFor="min"><IconCalendarTime stroke={1} className="me-2"/>Start:</label>
          <Form.Select size="lg" id="min" value={minValue} onChange={handleMinChange}>
            {Array.from({ length: max - min + 1 }, (_, i) => (
              <option key={max - i} value={max - i}>{max - i}</option>
            ))}
          </Form.Select>
        </Col>
            <Col className="col-2 col-lg-1 d-flex flex-column fs-2 justify-content-end text-center w-auto">-</Col>
        <Col className="col-4 col-lg-2">
          <label className="mb-1 d-flex aling-items-center" htmlFor="max"><IconCalendarTime stroke={1} className="me-2"/>End:</label>
          <Form.Select size="lg"id="max" value={maxValue} onChange={handleMaxChange} >
            {Array.from({ length: max - min + 1 }, (_, i) => (
              <option  key={min + i} value={min + i} >{min + i} </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
}

export default SliderYear;