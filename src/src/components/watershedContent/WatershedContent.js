import React from "react";
import WatershedItem from "../watershedItem/WatershedItem";

function WatershedContent({ contentWs }) {
  return (
    <>
      <h5 className="mt-4 mb-3">Watershed</h5>
      {contentWs
        .find((e) => {
          return e.title === "zone overview";
        })
        .values.map((e, i) => {
          const key = Object.keys(e)[0];
          const value = e[key];
          return (
            <WatershedItem
              key={i}
              title={key}
              description={value}
            />
          );
        })}
    </>
  );
}

export default WatershedContent;
