import React from "react";
import WaterpointItem from "../waterpointItem/WaterpointItem";

function WaterpointContent({contentWp}) {

  const challengeCrop = contentWp.find((c)=>c.title==="challenges crops")
  const challengeLivestock = contentWp.find((c)=>c.title==="challenges livestock")

  return (
    <>
      <h5 className="mt-4 mb-3">Waterpoint</h5>
      <div className="d-flex justify-content-between flex-column flex-lg-row">
        <WaterpointItem item={challengeCrop} type="icon-x" />
        <WaterpointItem item={challengeLivestock} type="icon-x" />
      </div>
      {/* <WaterpointItem item={wpContentWomen} type="text" /> */}
    </>
  );
}

export default WaterpointContent;
