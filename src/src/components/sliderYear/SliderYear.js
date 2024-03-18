import React, { useEffect, useState } from "react";
import "./SliderYear.css";

function SliderYear({ step, min, max, value, onChange }) {
  const [minValue, setMinValue] = useState(max - 1);
  const [maxValue, setMaxValue] = useState(max);

  const minPos = ((minValue - min) / (max - min)) * 100;
  const maxPos = ((maxValue - min) / (max - min)) * 100;

  useEffect(() => {
    onChange({ min: minValue, max: maxValue });
  }, []);

  useEffect(() => {
    if (value) {
      setMinValue(value.min);
      setMaxValue(value.max);
    }
  }, [value]);

  const handleMinChange = (e) => {
    e.preventDefault();
    const newMinVal = Math.min(+e.target.value, maxValue - step);
    if (!value) setMinValue(newMinVal);
    onChange({ min: newMinVal, max: maxValue });
  };

  const handleMaxChange = (e) => {
    e.preventDefault();
    const newMaxVal = Math.max(+e.target.value, minValue + step);
    if (!value) setMaxValue(newMaxVal);
    onChange({ min: minValue, max: newMaxVal });
  };

  return (
    <div class="wrapper">
      <div class="input-wrapper">
        <h6 className="start-year">{min}</h6>
        <input
          class="input"
          type="range"
          value={minValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMinChange}
        />
        <input
          class="input"
          type="range"
          value={maxValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMaxChange}
        />
        <h6 className="end-year">{max}</h6>
      </div>

      <div class="control-wrapper">
        <div class="control" style={{ left: `${minPos}%` }} />
        <div class="rail">
          <div
            class="inner-rail"
            style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
          />
        </div>
        <div class="control" style={{ left: `${maxPos}%` }} />
      </div>
    </div>
  );
}

export default SliderYear;
