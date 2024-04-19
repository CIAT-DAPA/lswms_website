import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
      <h6>{t("data.filter")}</h6>
      <p className="mb-1">{t("data.year")}</p>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ marginRight: "10px" }}>
          <label htmlFor="min">Min:</label>
          <Form.Select id="min" value={minValue} onChange={handleMinChange}>
            {Array.from({ length: max - min + 1 }, (_, i) => (
              <option key={max - i} value={max - i}>{max - i}</option>
            ))}
          </Form.Select>
        </div>

        <div>
          <label htmlFor="max">Max:</label>
          <Form.Select id="max" value={maxValue} onChange={handleMaxChange} >
            {Array.from({ length: max - min + 1 }, (_, i) => (
              <option  key={min + i} value={min + i} >{min + i} </option>
            ))}
          </Form.Select>
        </div>
      </div>
    </div>
  );
}

export default SliderYear;